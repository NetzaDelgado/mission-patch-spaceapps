import { renderPatch, validateDocument } from './model.js';

function safeFilename(name) {
  return (name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'mi-parche').toLowerCase();
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

export function downloadProject(document) {
  const doc = validateDocument(document);
  const filename = `${safeFilename(doc.name)}.mission.json`;
  const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
  downloadBlob(blob, filename);
  return { filename, blob };
}

/** Creates an RGB image PDF. Offsets and stream lengths are counted in bytes, never characters. */
export function createPDF(jpeg, width, height) {
  if (!(jpeg instanceof Uint8Array) || jpeg.length < 2 || jpeg[0] !== 0xff || jpeg[1] !== 0xd8) throw new Error('La imagen del PDF debe ser JPEG.');
  if (![width, height].every(value => Number.isInteger(value) && value > 0 && value <= 8192)) throw new Error('El tamaño del PDF no es válido.');
  const encoder = new TextEncoder();
  const chunks = [];
  let length = 0;
  const offsets = [0];
  const append = value => { const bytes = typeof value === 'string' ? encoder.encode(value) : value; chunks.push(bytes); length += bytes.length; };
  const object = (id, value) => { offsets[id] = length; append(`${id} 0 obj\n${value}\nendobj\n`); };
  append('%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n');
  object(1, '<< /Type /Catalog /Pages 2 0 R >>');
  object(2, '<< /Type /Pages /Count 1 /Kids [3 0 R] >>');
  object(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 600 600] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
  offsets[4] = length;
  append(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);
  append(jpeg);
  append('\nendstream\nendobj\n');
  const commands = 'q\n600 0 0 600 0 0 cm\n/Im0 Do\nQ\n';
  object(5, `<< /Length ${encoder.encode(commands).length} >>\nstream\n${commands}endstream`);
  const start = length;
  append('xref\n0 6\n0000000000 65535 f \n');
  for (let index = 1; index <= 5; index++) append(`${String(offsets[index]).padStart(10, '0')} 00000 n \n`);
  append(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`);
  const bytes = new Uint8Array(length);
  let position = 0;
  for (const chunk of chunks) { bytes.set(chunk, position); position += chunk.length; }
  return bytes;
}

export async function rasterizePatch(document, { size = 1024, transparent = true } = {}) {
  if (!Number.isInteger(size) || size < 128 || size > 4096) throw new Error('Elige una resolución de 128 a 4096 píxeles.');
  const svg = renderPatch(document, { size, background: transparent ? undefined : '#ffffff' });
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      const cleanup = () => { clearTimeout(timer); img.onload = null; img.onerror = null; };
      const timer = setTimeout(() => { cleanup(); reject(new Error('La imagen tardó demasiado en prepararse. Prueba descargar el formato SVG.')); }, 15000);
      img.onload = () => { cleanup(); resolve(img); };
      img.onerror = () => { cleanup(); reject(new Error('No se pudo preparar la imagen. Prueba descargar el formato SVG.')); };
      img.src = url;
    });
    const canvas = documentGlobal().createElement('canvas');
    canvas.width = canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Tu navegador no pudo crear la imagen. Prueba con SVG.');
    if (!transparent) { context.fillStyle = '#ffffff'; context.fillRect(0, 0, size, size); }
    context.drawImage(image, 0, 0, size, size);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Keep the project parameter distinct from the browser's document object.
function documentGlobal() { return globalThis.document; }

function canvasBlob(canvas, type, quality = .96) {
  return new Promise((resolve, reject) => canvas.toBlob(blob => {
    if (!blob) reject(new Error('No se pudo generar el archivo. Intenta una resolución menor.'));
    else if (blob.type !== type) reject(new Error('Tu navegador no admite este formato. Prueba PNG o SVG.'));
    else resolve(blob);
  }, type, quality));
}

/** Export PNG, JPEG, WebP, standalone SVG, or a raster PDF without a server. */
export async function exportPatch(document, { format = 'png', size = 1024, transparent = true } = {}) {
  const doc = validateDocument(document);
  if (!['png', 'svg', 'jpg', 'jpeg', 'webp', 'pdf'].includes(format)) throw new Error('Este formato de descarga no está disponible.');
  if (!Number.isInteger(size) || size < 128 || size > 4096) throw new Error('Elige una resolución de 128 a 4096 píxeles.');
  if (format === 'jpeg') format = 'jpg';
  const filename = `${safeFilename(doc.name)}.${format}`;
  let blob;
  if (format === 'svg') {
    blob = new Blob([renderPatch(doc, { size, background: transparent ? undefined : '#ffffff' })], { type: 'image/svg+xml;charset=utf-8' });
  } else {
    const allowTransparency = transparent && (format === 'png' || format === 'webp');
    const canvas = await rasterizePatch(doc, { size, transparent: allowTransparency });
    try {
      if (format === 'pdf') {
        const jpeg = await canvasBlob(canvas, 'image/jpeg');
        blob = new Blob([createPDF(new Uint8Array(await jpeg.arrayBuffer()), size, size)], { type: 'application/pdf' });
      } else {
        blob = await canvasBlob(canvas, `image/${format === 'jpg' ? 'jpeg' : format}`);
      }
    } finally {
      canvas.width = canvas.height = 0;
    }
  }
  downloadBlob(blob, filename);
  return { filename, format, size, blob };
}
