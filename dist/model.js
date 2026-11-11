import { ASSETS, assetMarkup } from './assets.js';

const SHAPES = ['circle', 'shield', 'hexagon', 'square'];
const FONTS = ['Arial', 'Georgia', 'Verdana', 'Trebuchet MS', 'Courier New', 'Inter', 'Space Grotesk', 'sans-serif', 'serif', 'monospace'];
const HEX = /^#[0-9a-f]{6}$/i;
const escapeXML = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[character]));
let renderSerial = 0;

export const TEMPLATES = [
  { id: 'odyssey', name: 'Odisea', category: 'Exploración', description: 'El comienzo de una gran misión', colors: ['#152c3c', '#eee3c9', '#ed794b'] },
  { id: 'luna', name: 'Destino lunar', category: 'Exploración', description: 'Un pequeño paso, una gran idea', colors: ['#162532', '#e9e2cd', '#91bfc4'] },
  { id: 'mars', name: 'Horizonte Marte', category: 'Planetas', description: 'El próximo horizonte es rojo', colors: ['#351f29', '#f1d6b6', '#dc7951'] },
  { id: 'ocean', name: 'Planeta azul', category: 'Tierra', description: 'Una misión por nuestro hogar', colors: ['#123d48', '#d8e8ce', '#5eafac'] },
  { id: 'solar', name: 'Solaris', category: 'Planetas', description: 'Sigue la energía de las estrellas', colors: ['#392c43', '#f8dfb0', '#f5ac58'] },
  { id: 'voyager', name: 'Más allá', category: 'Exploración', description: 'Para quienes miran más lejos', colors: ['#263047', '#efe5cf', '#c09ecb'] },
  { id: 'aurora', name: 'Aurora', category: 'Tierra', description: 'La ciencia ilumina el camino', colors: ['#193b39', '#e4e1bd', '#7ac5a5'] },
  { id: 'orbit', name: 'En órbita', category: 'Exploración', description: 'Ideas que conectan al mundo', colors: ['#1b364c', '#e6e0cb', '#ef946b'] },
  { id: 'frontier', name: 'Nueva frontera', category: 'Exploración', description: 'Tu equipo, un universo de posibilidades', colors: ['#222d41', '#f2dfc1', '#e39a65'] },
  { id: 'blank', name: 'Lienzo en blanco', category: 'Esenciales', description: 'Dale forma a tu propia historia', colors: ['#152c3c', '#eee3c9', '#ed794b'] },
];

export function patchShapePath(shape = 'circle') {
  switch (shape) {
    case 'shield': return 'M 70 30 H 530 Q 568 30 568 68 V 290 C 568 410 438 525 300 576 C 162 525 32 410 32 290 V 68 Q 32 30 70 30 Z';
    case 'hexagon': return 'M 300 22 L 541 161 V 439 L 300 578 L 59 439 V 161 Z';
    case 'square': return 'M 108 30 H 492 Q 570 30 570 108 V 492 Q 570 570 492 570 H 108 Q 30 570 30 492 V 108 Q 30 30 108 30 Z';
    default: return 'M 300 22 A 278 278 0 1 1 300 578 A 278 278 0 1 1 300 22 Z';
  }
}

function color(value, fallback, label) {
  const result = value === undefined ? fallback : value;
  if (typeof result !== 'string' || !HEX.test(result)) throw new Error(`El color de ${label} no es válido.`);
  return result.toLowerCase();
}

function number(value, fallback, min, max, label) {
  const result = value === undefined ? fallback : value;
  if (typeof result !== 'number' || !Number.isFinite(result) || result < min || result > max) throw new Error(`El valor de ${label} no es válido.`);
  return result;
}

function string(value, fallback, max, label) {
  const result = value === undefined ? fallback : value;
  if (typeof result !== 'string' || result.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(result)) throw new Error(`El texto de ${label} no es válido.`);
  return result;
}

/** Validate and copy only supported fields. Importing a project never imports markup or remote content. */
export function validateDocument(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || input.version !== 1) throw new Error('Este archivo no es un proyecto de Mission Patch Studio compatible.');
  if (!SHAPES.includes(input.shape)) throw new Error('La forma del parche no es compatible.');
  if (!Array.isArray(input.elements) || input.elements.length > 200) throw new Error('Un proyecto puede contener hasta 200 elementos.');
  const ids = new Set();
  const elements = input.elements.map((element, index) => {
    if (!element || typeof element !== 'object' || Array.isArray(element)) throw new Error('El proyecto contiene un elemento inválido.');
    const id = string(element.id, `element-${index}`, 80, 'identificador');
    if (!/^[\w-]+$/.test(id) || ids.has(id)) throw new Error('El proyecto contiene identificadores inválidos o repetidos.');
    ids.add(id);
    const type = element.type ?? 'asset';
    if (!['asset', 'text', 'image'].includes(type)) throw new Error('El proyecto contiene un tipo de elemento no compatible.');
    const asset = type === 'asset' ? ASSETS.find(item => item.id === element.assetId) : null;
    if (type === 'asset' && !asset) throw new Error('El proyecto utiliza un elemento que no está en la biblioteca.');
    if (element.colors !== undefined && (!Array.isArray(element.colors) || element.colors.length !== 3)) throw new Error('Cada elemento debe tener tres colores válidos.');
    const defaults = asset?.colors ?? ['#eee3c9', '#ed794b', '#152c3c'];
    const normalized = {
      id, type, assetId: asset?.id ?? '',
      x: number(element.x, 300, -600, 1200, 'posición horizontal'),
      y: number(element.y, 300, -600, 1200, 'posición vertical'),
      size: number(element.size, 100, 5, 1200, 'tamaño'),
      rotation: number(element.rotation, 0, -36000, 36000, 'rotación'),
      colors: defaults.map((fallback, channel) => color(element.colors?.[channel], fallback, 'elemento')),
      opacity: number(element.opacity, 1, 0, 1, 'opacidad'),
      locked: Boolean(element.locked), hidden: Boolean(element.hidden),
    };
    if (type === 'text') {
      normalized.text = string(element.text, 'Tu misión', 200, 'elemento');
      normalized.fontSize = number(element.fontSize, 24, 6, 160, 'tipografía');
      normalized.fontFamily = FONTS.includes(element.fontFamily) ? element.fontFamily : 'Arial';
      normalized.bold = element.bold === undefined ? true : Boolean(element.bold);
    }
    if (type === 'image') {
      if (typeof element.src !== 'string' || element.src.length > 4 * 1024 * 1024 || !/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(element.src)) throw new Error('La imagen debe ser un PNG, JPEG o WebP integrado de hasta 4 MB.');
      normalized.src = element.src;
    }
    return normalized;
  });
  return {
    version: 1,
    name: string(input.name, 'Mi parche de misión', 120, 'nombre'),
    shape: input.shape,
    background: color(input.background, '#152c3c', 'fondo'),
    border: color(input.border, '#eee3c9', 'borde'),
    accent: color(input.accent, '#ed794b', 'acento'),
    titleColor: color(input.titleColor, '#152c3c', 'títulos'),
    title: string(input.title, 'ODYSSEY', 70, 'título'),
    subtitle: string(input.subtitle, 'SPACE APPS · 2026', 100, 'subtítulo'),
    stars: input.stars === undefined ? true : Boolean(input.stars),
    elements,
  };
}

function resolveAsset(...candidates) {
  return ASSETS.find(asset => candidates.includes(asset.id)) ?? ASSETS.find(asset => candidates.some(candidate => asset.name.toLowerCase().includes(candidate.toLowerCase()))) ?? ASSETS[0];
}

export function createDocument(templateId = 'odyssey') {
  const template = TEMPLATES.find(item => item.id === templateId) ?? TEMPLATES[0];
  const [background, border, accent] = template.colors;
  const doc = { version: 1, name: `Misión ${template.name}`, shape: 'circle', background, border, accent, titleColor: background, title: 'ODYSSEY', subtitle: 'SPACE APPS · 2026', stars: true, elements: [] };
  const add = (candidates, x, y, size, rotation = 0, colors) => {
    const asset = resolveAsset(...candidates);
    if (asset) doc.elements.push({ id: `element-${doc.elements.length + 1}`, type: 'asset', assetId: asset.id, x, y, size, rotation, colors: colors ?? [border, accent, '#75aba6'], opacity: 1, locked: false, hidden: false });
  };
  switch (template.id) {
    case 'luna':
      doc.title = 'LUNAR EXPLORERS'; doc.subtitle = 'ONE GIANT LEAP · SPACE APPS';
      add(['moon', 'luna'], 370, 226, 165, 0, ['#d7d7ce', '#9faeae', '#627c85']);
      add(['mountain', 'montaña'], 302, 417, 355, 0, ['#647d87', '#9dafad', border]);
      add(['astronaut', 'astronauta'], 258, 328, 222, -8);
      add(['flag', 'bandera'], 401, 372, 108, 0);
      break;
    case 'mars':
      doc.shape = 'shield'; doc.title = 'MARS PIONEERS'; doc.subtitle = 'DARE TO EXPLORE';
      add(['mars', 'marte'], 326, 263, 286, 0, ['#df8658', '#b85845', '#f2c48c']);
      add(['rover'], 290, 388, 230, 0, [border, accent, '#78413c']);
      add(['star', 'estrella'], 176, 190, 43);
      break;
    case 'ocean':
      doc.title = 'OUR BLUE HOME'; doc.subtitle = 'EARTH IS OUR MISSION';
      add(['earth', 'tierra'], 300, 278, 290, -15, ['#529baf', '#a0c38c', '#e4ead0']);
      add(['wave', 'ola'], 297, 400, 300, 0, ['#e1e7cf', '#65b5b1', '#337b87']);
      add(['satellite', 'satélite'], 411, 180, 87, 25, [border, accent, '#529baf']);
      break;
    case 'solar':
      doc.shape = 'hexagon'; doc.title = 'SOLARIS'; doc.subtitle = 'FOLLOW YOUR STAR';
      add(['sun', 'sol'], 300, 286, 252, 0, ['#ffd082', '#e99150', '#fce6b9']);
      add(['orbit', 'órbita'], 300, 315, 380, -25, [border, accent, '#cb8d70']);
      add(['star', 'estrella'], 165, 349, 36);
      break;
    case 'voyager':
      doc.title = 'VOYAGER'; doc.subtitle = 'BEYOND THE KNOWN';
      add(['saturn', 'saturno'], 326, 285, 298, -17, [border, '#c09ecb', '#d5b2d0']);
      add(['probe', 'sonda'], 211, 366, 136, -27);
      add(['comet', 'cometa'], 197, 181, 91, 0);
      break;
    case 'aurora':
      doc.shape = 'shield'; doc.title = 'AURORA'; doc.subtitle = 'SCIENCE LIGHTS THE WAY';
      add(['moon', 'luna'], 383, 190, 93, 0, [border, '#8faf9c', '#496b5b']);
      add(['mountain', 'montaña'], 302, 344, 359, 0, ['#6db49a', '#b2d5ae', '#294e49']);
      add(['tree', 'árbol'], 217, 382, 119, 0, ['#e4e1bd', '#80bca2', '#2d7164']);
      add(['star', 'estrella'], 203, 184, 46);
      break;
    case 'orbit':
      doc.title = 'CONNECTED'; doc.subtitle = 'ONE PLANET · INFINITE IDEAS';
      add(['earth', 'tierra'], 300, 310, 242, 15, ['#72aeba', '#acc2a0', border]);
      add(['orbit', 'órbita'], 300, 300, 386, -38, [accent, border, '#6b99a3']);
      add(['satellite', 'satélite'], 407, 192, 139, 25);
      break;
    case 'frontier':
      doc.shape = 'square'; doc.title = 'NEW FRONTIERS'; doc.subtitle = 'CREATE · COLLABORATE · EXPLORE';
      add(['moon', 'luna'], 187, 202, 100);
      add(['mountain', 'montaña'], 306, 383, 372, 0, ['#c07853', '#e0ac7b', '#4e4450']);
      add(['rocket', 'cohete'], 330, 277, 259, 24, [border, accent, '#74a3aa']);
      break;
    case 'blank':
      doc.name = 'Mi nueva misión'; doc.title = 'TU MISIÓN'; doc.subtitle = 'NASA SPACE APPS CHALLENGE'; doc.stars = false;
      break;
    default:
      add(['earth', 'tierra'], 355, 359, 258, -14, ['#78aaa5', '#b9cbad', '#e9e0c4']);
      add(['orbit', 'órbita'], 297, 306, 364, -31, [accent, border, '#83b8b1']);
      add(['rocket', 'cohete'], 278, 286, 268, 28, [border, accent, '#69a7ab']);
      add(['star', 'estrella'], 158, 252, 38, 8, [border, accent, border]);
      add(['star', 'estrella'], 400, 184, 31, 5, [accent, border, accent]);
  }
  return validateDocument(doc);
}

function titlePaths(shape) {
  if (shape === 'shield') return ['M 100 90 H 500', 'M 120 410 Q 300 592 480 410'];
  if (shape === 'hexagon') return ['M 120 188 Q 300 -22 480 188', 'M 116 414 Q 300 594 484 414'];
  if (shape === 'square') return ['M 90 86 H 510', 'M 90 539 H 510'];
  return ['M 58 300 A 242 242 0 0 1 542 300', 'M 61 300 A 239 239 0 0 0 539 300'];
}

const STAR_POINTS = [[181, 177, 2], [244, 149, 2.2], [351, 143, 2], [426, 258, 2.3], [163, 354, 2.6], [386, 413, 2], [244, 438, 1.5], [443, 334, 1.6], [315, 192, 1.5], [140, 289, 1.5], [211, 393, 1.5], [378, 224, 2], [317, 458, 1.3], [202, 220, 1.5]];

function textMarkup(element) {
  const lines = element.text.replace(/\r\n?/g, '\n').split('\n');
  const lineHeight = element.fontSize * 1.2;
  const content = lines.map((line, index) => `<tspan x="0" y="${(index - (lines.length - 1) / 2) * lineHeight}">${escapeXML(line || ' ')}</tspan>`).join('');
  return `<text text-anchor="middle" dominant-baseline="central" fill="${element.colors[0]}" font-family="${escapeXML(element.fontFamily)}, sans-serif" font-size="${element.fontSize}" font-weight="${element.bold ? 700 : 400}" xml:space="preserve">${content}</text>`;
}

/** A complete self-contained SVG. Each render has unique defs IDs, so previews can coexist. */
export function renderPatch(document, options = {}) {
  const doc = validateDocument(document);
  const id = `patch-${++renderSerial}`;
  const outer = patchShapePath(doc.shape);
  const [topPath, bottomPath] = titlePaths(doc.shape);
  const size = Number.isFinite(options.size) ? Math.min(8192, Math.max(32, options.size)) : 600;
  const innerScale = doc.shape === 'circle' ? 0.775 : doc.shape === 'hexagon' ? 0.785 : 0.77;
  const innerTransform = `translate(300 300) scale(${innerScale}) translate(-300 -300)`;
  const art = doc.elements.filter(element => !element.hidden).map(element => {
    const interaction = options.interactive ? ` data-element-id="${escapeXML(element.id)}" data-locked="${element.locked}" role="button" aria-label="${escapeXML(element.type === 'text' ? element.text : ASSETS.find(asset => asset.id === element.assetId)?.name ?? 'Elemento')}" style="cursor:${element.locked ? 'default' : 'move'}"` : '';
    const content = element.type === 'text'
      ? textMarkup(element)
      : element.type === 'image'
      ? `<image x="-50" y="-50" width="100" height="100" preserveAspectRatio="xMidYMid meet" href="${element.src}" xlink:href="${element.src}"/>`
      : `<g transform="translate(-50 -50)">${assetMarkup(element.assetId, element.colors)}</g>`;
    return `<g${interaction} transform="translate(${element.x} ${element.y}) rotate(${element.rotation}) scale(${element.size / 100})" opacity="${element.opacity}">${content}</g>`;
  }).join('');
  const stars = doc.stars ? STAR_POINTS.map(([x, y, radius]) => `<circle cx="${x}" cy="${y}" r="${radius}" fill="${doc.border}" opacity=".72"/>`).join('') + `<path d="M 440 208 v 14 M 433 215 h 14 M 180 402 v 12 M 174 408 h 12" fill="none" stroke="${doc.border}" stroke-width="2" opacity=".8"/>` : '';
  const background = typeof options.background === 'string' && HEX.test(options.background) ? `<rect width="600" height="600" fill="${options.background}"/>` : '';
  const titleSize = doc.title.length > 30 ? 18 : doc.title.length > 20 ? 23 : 29;
  const subtitleSize = doc.subtitle.length > 42 ? 13 : doc.subtitle.length > 30 ? 16 : 20;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 600 600" role="img" aria-label="${escapeXML(doc.name)}"${options.interactive ? ' data-patch-canvas="true"' : ''}>
<title>${escapeXML(doc.name)}</title><defs><clipPath id="${id}-clip"><path d="${outer}" transform="${innerTransform}"/></clipPath><path id="${id}-top" d="${topPath}"/><path id="${id}-bottom" d="${bottomPath}"/></defs>
${background}<path d="${outer}" fill="${doc.border}" stroke="${doc.accent}" stroke-width="5"/>
<path d="${outer}" transform="translate(300 300) scale(.968) translate(-300 -300)" fill="none" stroke="${doc.background}" stroke-width="1.6" stroke-dasharray="2 5" opacity=".6"/>
<path d="${outer}" transform="${innerTransform}" fill="${doc.background}" stroke="${doc.accent}" stroke-width="5"/>
<g clip-path="url(#${id}-clip)">${stars}${art}</g>
<text fill="${doc.titleColor}" font-family="Arial, sans-serif" font-weight="800" font-size="${titleSize}" letter-spacing="${doc.title.length > 30 ? 2 : 4}" text-anchor="middle"><textPath href="#${id}-top" xlink:href="#${id}-top" startOffset="50%">${escapeXML(doc.title)}</textPath></text>
<text fill="${doc.titleColor}" font-family="Arial, sans-serif" font-weight="700" font-size="${subtitleSize}" letter-spacing="${doc.subtitle.length > 30 ? 1.7 : 2.8}" text-anchor="middle"><textPath href="#${id}-bottom" xlink:href="#${id}-bottom" startOffset="50%">${escapeXML(doc.subtitle)}</textPath></text>
${doc.shape === 'circle' ? `<g fill="${doc.accent}"><path d="M 57 296 l 4 -8 4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 Z"/><path d="M 535 296 l 4 -8 4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 Z"/></g>` : ''}</svg>`;
}
