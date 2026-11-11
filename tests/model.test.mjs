import test from 'node:test';
import assert from 'node:assert/strict';
import { createDocument, validateDocument, renderPatch, TEMPLATES, patchShapePath } from '../dist/model.js';
import { createPDF } from '../dist/export.js';
import { ASSETS, assetMarkup } from '../dist/assets.js';
import { PALETTES } from '../dist/palettes.js';

test('library has 500 uniquely named illustrations and palette choices', () => {
  assert.equal(ASSETS.length, 500);
  assert.equal(new Set(ASSETS.map(asset => asset.id)).size, 500);
  assert.equal(new Set(ASSETS.map(asset => asset.name)).size, 500);
  assert.equal(ASSETS.filter(asset => asset.variant).length, 444);
  assert.equal(new Set(PALETTES.map(palette => palette.name)).size, 12);
  for (const palette of PALETTES) {
    for (const value of Object.values(palette.colors)) assert.match(value, /^#[0-9a-f]{6}$/i);
  }
});

test('generated illustrations render unique, valid vector markup', () => {
  const generated = ASSETS.filter(asset => asset.variant);
  const artwork = generated.map(asset => assetMarkup(asset.id, asset.colors));
  assert.equal(new Set(artwork).size, 444);
  assert.ok(artwork.every(svg => svg.startsWith('<g ') && !/undefined|NaN/.test(svg)));
  const document = createDocument('blank');
  document.elements.push({id:'generated-1',type:'asset',assetId:generated.at(-1).id});
  assert.equal(validateDocument(document).elements[0].assetId, generated.at(-1).id);
});

test('all templates have valid editable documents and available assets', () => {
  assert.ok(TEMPLATES.length >= 8);
  for (const template of TEMPLATES) {
    const doc = createDocument(template.id);
    assert.deepEqual(validateDocument(doc), doc);
    assert.equal(new Set(doc.elements.map(element => element.id)).size, doc.elements.length);
    for (const element of doc.elements) assert.ok(ASSETS.some(asset => asset.id === element.assetId));
    const svg = renderPatch(doc);
    assert.match(svg, /viewBox="0 0 600 600"/);
    assert.match(svg, /<clipPath/);
    assert.ok(!svg.includes('undefined'));
    assert.ok(!svg.includes('NaN'));
  }
  assert.equal(createDocument('blank').elements.length, 0);
});

test('templates are independent editable copies', () => {
  const first = createDocument();
  const second = createDocument();
  first.elements[0].colors[0] = '#ffffff';
  first.title = 'Changed';
  assert.notDeepEqual(first, second);
  assert.equal(second.title, 'ODYSSEY');
});

test('SVG escapes user text and generates distinct definition IDs', () => {
  const doc = createDocument('blank');
  doc.name = 'A "special" <patch>';
  doc.title = '<script>alert(1)</script>';
  doc.elements.push({ id: 'text-1', type: 'text', text: '<image href="https://evil.example"/>', x: 300, y: 300, size: 100, colors: ['#ffffff', '#000000', '#ff0000'] });
  const svg = renderPatch(doc, { interactive: true });
  assert.ok(!svg.includes('<script>'));
  assert.ok(!svg.includes('<image href='));
  assert.ok(svg.includes('&lt;script&gt;'));
  assert.ok(svg.includes('data-element-id="text-1"'));
  const another = renderPatch(doc);
  assert.notEqual(svg.match(/id="(patch-\d+-clip)"/)[1], another.match(/id="(patch-\d+-clip)"/)[1]);
});

test('renderer excludes hidden elements and keeps transforms for editing', () => {
  const doc = createDocument();
  doc.elements[0].hidden = true;
  doc.elements[1].x = 123;
  doc.elements[1].y = 456;
  doc.elements[1].rotation = 42;
  doc.elements[1].size = 210;
  const svg = renderPatch(doc, { interactive: true });
  assert.ok(!svg.includes(`data-element-id="${doc.elements[0].id}"`));
  assert.ok(svg.includes('translate(123 456) rotate(42) scale(2.1)'));
  assert.ok(!renderPatch(doc).includes('data-element-id'));
});

test('multiline text keeps line breaks, centering, and XML escaping in export', () => {
  const doc = createDocument('blank');
  doc.elements = [{ id: 'text-multiline', type: 'text', text: 'LÍNEA UNO\nLÍNEA & DOS', fontSize: 20 }];
  const svg = renderPatch(doc);
  assert.ok(svg.includes('<tspan x="0" y="-12">LÍNEA UNO</tspan>'));
  assert.ok(svg.includes('<tspan x="0" y="12">LÍNEA &amp; DOS</tspan>'));
  assert.ok(svg.includes('xml:space="preserve"'));
});

test('invalid, oversized and unsafe imported projects are rejected', () => {
  const reject = mutation => { const doc = createDocument(); mutation(doc); assert.throws(() => validateDocument(doc)); };
  reject(doc => { doc.version = 9; });
  reject(doc => { doc.shape = 'javascript'; });
  reject(doc => { doc.background = 'red" onload="alert(1)'; });
  reject(doc => { doc.elements[0].x = NaN; });
  reject(doc => { doc.elements[0].size = Infinity; });
  reject(doc => { doc.elements[0].colors = ['#fff']; });
  reject(doc => { doc.elements[0].assetId = 'https://example.com/asset.svg'; });
  reject(doc => { doc.elements[1].id = doc.elements[0].id; });
  reject(doc => { doc.elements[0].id = '"><script>'; });
  reject(doc => { doc.title = 'a'.repeat(71); });
  reject(doc => { doc.elements = Array(201).fill(doc.elements[0]); });
  assert.throws(() => validateDocument(null));
});

test('raster imports allow self-contained images but reject SVG and URLs', () => {
  const doc = createDocument('blank');
  const image = { id: 'image-1', type: 'image', src: 'data:image/png;base64,iVBORw0KGgo=', x: 300, y: 300, size: 200 };
  doc.elements = [image];
  assert.equal(validateDocument(doc).elements[0].src, image.src);
  assert.match(renderPatch(doc), /preserveAspectRatio="xMidYMid meet"/);
  for (const src of ['https://example.com/photo.png', 'data:image/svg+xml;base64,PHN2Zz4=', 'data:image/png;base64,a" onload="alert(1)', 'data:image/png;base64,' + 'a'.repeat(4 * 1024 * 1024)]) {
    assert.throws(() => validateDocument({ ...doc, elements: [{ ...image, src }] }));
  }
});

test('all patch outlines are distinct closed vector paths', () => {
  const paths = ['circle', 'shield', 'hexagon', 'square'].map(patchShapePath);
  assert.equal(new Set(paths).size, 4);
  paths.forEach(path => assert.match(path, /Z$/));
});

test('SVG export resolution and optional background are explicit', () => {
  const doc = createDocument();
  const svg = renderPatch(doc, { size: 2048, background: '#ffffff' });
  assert.match(svg, /width="2048" height="2048"/);
  assert.match(svg, /<rect width="600" height="600" fill="#ffffff"\/>/);
  assert.ok(!renderPatch(doc).includes('<rect width="600" height="600"'));
});

test('PDF stores byte-accurate cross-reference offsets and JPEG stream', () => {
  const jpeg = new Uint8Array([0xff, 0xd8, 0x80, 0xc3, 0xff, 0xd9]);
  const bytes = createPDF(jpeg, 1024, 1024);
  const latin = new TextDecoder('latin1').decode(bytes);
  assert.ok(latin.startsWith('%PDF-1.4'));
  assert.match(latin, /\/Width 1024 \/Height 1024/);
  const xref = Number(latin.match(/startxref\n(\d+)/)[1]);
  assert.equal(new TextDecoder().decode(bytes.slice(xref, xref + 4)), 'xref');
  const records = latin.slice(xref).split('\n').slice(3, 8);
  records.forEach((record, index) => {
    const offset = Number(record.slice(0, 10));
    assert.equal(new TextDecoder().decode(bytes.slice(offset, offset + 7)), `${index + 1} 0 obj`);
  });
  assert.match(latin, /\/DCTDecode \/Length 6/);
  assert.throws(() => createPDF(new Uint8Array([1, 2]), 1, 1));
  assert.throws(() => createPDF(jpeg, Infinity, 100));
});
