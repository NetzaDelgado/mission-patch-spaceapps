// Original vector illustrations for Mission Patch Studio. All artwork is editable.
export const CATEGORIES = ['Naves', 'Planetas', 'Exploración', 'Órbitas', 'Símbolos', 'Naturaleza'];

const cream = '#f6ebd5', orange = '#ed7044', navy = '#173b4b', teal = '#4fa69e', gold = '#efbd63';
const entries = [
  ['rocket','Cohete pionero','Naves',[cream,orange,navy],'cohete lanzamiento rocket nave'],
  ['rocket-round','Cohete retro','Naves',[orange,cream,navy],'cohete retro nave'],
  ['shuttle','Transbordador','Naves',[cream,orange,navy],'transbordador nave shuttle'],
  ['satellite','Satélite','Naves',[cream,teal,navy],'satelite comunicaciones paneles'],
  ['iss','Estación espacial','Naves',[cream,gold,navy],'estacion iss orbital'],
  ['capsule','Cápsula de misión','Naves',[cream,orange,navy],'capsula astronautas retorno'],
  ['probe','Sonda Voyager','Naves',[cream,gold,navy],'sonda voyager exploracion'],
  ['ufo','Platillo cósmico','Naves',[teal,cream,navy],'ovni ufo platillo'],
  ['spaceplane','Avión espacial','Naves',[cream,orange,navy],'avion nave plane'],
  ['booster','Cohete pesado','Naves',[cream,orange,navy],'cohete lanzador booster'],
  ['earth','Planeta Tierra','Planetas',[teal,cream,navy],'tierra earth mundo planeta'],
  ['mars','Planeta Marte','Planetas',[orange,cream,navy],'marte mars planeta rojo'],
  ['moon','Luna de cráteres','Planetas',[cream,teal,navy],'luna moon crater satelite'],
  ['saturn','Saturno y anillos','Planetas',[gold,cream,navy],'saturno saturn anillos planeta'],
  ['sun','Sol radiante','Planetas',[gold,orange,navy],'sol sun estrella luz'],
  ['jupiter','Bandas de Júpiter','Planetas',[cream,orange,navy],'jupiter planeta bandas'],
  ['neptune','Neptuno azul','Planetas',[teal,cream,navy],'neptuno planeta oceano azul'],
  ['eclipse','Eclipse solar','Planetas',[navy,gold,cream],'eclipse sol luna'],
  ['crescent','Luna creciente','Planetas',[cream,gold,navy],'luna creciente noche'],
  ['planet','Mundo por descubrir','Planetas',[orange,teal,cream],'planeta exoplaneta mundo'],
  ['astronaut','Astronauta','Exploración',[cream,orange,navy],'astronauta persona traje astronaut'],
  ['helmet','Casco espacial','Exploración',[cream,orange,navy],'casco astronauta helmet'],
  ['glove','Guante espacial','Exploración',[cream,orange,navy],'guante astronauta mano'],
  ['boot','Bota lunar','Exploración',[cream,orange,navy],'bota huella luna pie'],
  ['flag','Bandera de misión','Exploración',[orange,cream,navy],'bandera equipo mision flag'],
  ['rover','Explorador marciano','Exploración',[cream,orange,navy],'rover robot marte explorador'],
  ['telescope','Telescopio orbital','Exploración',[cream,gold,navy],'telescopio hubble observatorio'],
  ['antenna','Antena de espacio profundo','Exploración',[cream,teal,navy],'antena radio señal comunicacion'],
  ['lander','Módulo lunar','Exploración',[gold,cream,navy],'modulo lunar lander alunizaje'],
  ['observatory','Observatorio','Exploración',[cream,teal,navy],'observatorio astronomia telescopio'],
  ['orbit','Órbita elíptica','Órbitas',[teal,cream,orange],'orbita elipse trayectoria'],
  ['orbit-cross','Órbitas cruzadas','Órbitas',[cream,teal,orange],'orbita anillos cruzados'],
  ['comet','Cometa viajero','Órbitas',[cream,orange,gold],'cometa meteorito cola'],
  ['constellation','Constelación boreal','Órbitas',[cream,teal,orange],'constelacion estrellas astronomia'],
  ['galaxy','Galaxia espiral','Órbitas',[cream,teal,orange],'galaxia espiral universo'],
  ['shooting-star','Estrella fugaz','Órbitas',[gold,orange,cream],'estrella fugaz meteoro'],
  ['solar-system','Sistema solar','Órbitas',[gold,teal,cream],'sistema solar orbitas planetas'],
  ['star-field','Campo de estrellas','Órbitas',[cream,gold,teal],'estrellas cielo campo espacio'],
  ['star','Estrella de cinco puntas','Símbolos',[gold,cream,navy],'estrella cinco star'],
  ['sparkle','Destello polar','Símbolos',[cream,gold,navy],'destello estrella cuatro sparkle'],
  ['compass','Rosa de los vientos','Símbolos',[orange,cream,navy],'brujula rosa vientos norte compass'],
  ['diamond','Diamante orbital','Símbolos',[teal,cream,navy],'diamante geometria rombo'],
  ['lightning','Rayo de energía','Símbolos',[gold,orange,navy],'rayo energia lightning'],
  ['atom','Átomo científico','Símbolos',[teal,cream,orange],'atomo ciencia fisica'],
  ['laurel','Corona de laurel','Símbolos',[gold,cream,navy],'laurel corona equipo logro'],
  ['ribbon','Cinta de misión','Símbolos',[orange,cream,navy],'cinta banner etiqueta'],
  ['target','Coordenadas','Símbolos',[teal,cream,orange],'objetivo coordenadas cruz target'],
  ['hexagon','Insignia hexagonal','Símbolos',[teal,cream,navy],'hexagono insignia geometria'],
  ['mountain','Cumbres planetarias','Naturaleza',[teal,cream,navy],'montaña cumbres paisaje volcan'],
  ['wave','Olas del océano','Naturaleza',[teal,cream,navy],'olas agua oceano mar'],
  ['tree','Árbol de la vida','Naturaleza',[teal,cream,navy],'arbol bosque vida naturaleza'],
  ['leaf','Hoja de futuro','Naturaleza',[teal,cream,navy],'hoja vida ecologia naturaleza'],
  ['desert','Horizonte marciano','Naturaleza',[orange,gold,navy],'desierto marte paisaje dunas'],
  ['aurora','Aurora boreal','Naturaleza',[teal,cream,gold],'aurora cielo luz boreal'],
  ['cloud','Nube terrestre','Naturaleza',[cream,teal,navy],'nube atmosfera clima'],
  ['drop','Gota de agua','Naturaleza',[teal,cream,navy],'gota agua vida oceano'],
];

const star = (cx,cy,r,inner=r*.43,n=5) => Array.from({length:n*2},(_,i)=>{const a=i*Math.PI/n-Math.PI/2;const d=i%2?inner:r;return `${cx+Math.cos(a)*d},${cy+Math.sin(a)*d}`}).join(' ');
const ring = (cx,cy,rx,ry,color,width=3,rotation=0) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${color}" stroke-width="${width}" transform="rotate(${rotation} ${cx} ${cy})"/>`;
const circle=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
const line=(d,c,w=3)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const poly=(points,c)=>`<polygon points="${points}" fill="${c}"/>`;
const path=(d,c)=>`<path d="${d}" fill="${c}"/>`;
const rect=(x,y,w,h,c,r=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"/>`;

const generatedNames = [
  ['Lanzador Aurora', 'Sonda Horizonte', 'Nave Peregrina', 'Satélite Vigía', 'Módulo Estelar', 'Explorador Orbital', 'Vehículo Celeste', 'Cápsula Pionera'],
  ['Mundo Carmesí', 'Luna Boreal', 'Gigante Anillado', 'Planeta Azul', 'Esfera Remota', 'Satélite Rocoso', 'Mundo Oceánico', 'Cuerpo Celeste'],
  ['Astronauta Pionero', 'Rover Explorador', 'Estación de Campo', 'Telescopio Lejano', 'Módulo de Descenso', 'Antena Científica', 'Equipo de Exploración', 'Laboratorio Orbital'],
  ['Trayectoria Lunar', 'Órbita de Encuentro', 'Ruta Interplanetaria', 'Arco Celeste', 'Ventana de Lanzamiento', 'Sistema Binario', 'Ruta de Retorno', 'Anillo de Exploración'],
  ['Rosa de Navegación', 'Estrella Guía', 'Insignia Vectorial', 'Brújula Estelar', 'Marca de Misión', 'Símbolo de Equipo', 'Faro Orbital', 'Emblema Científico'],
  ['Cumbres del Horizonte', 'Océano Planetario', 'Bosque Remoto', 'Aurora Polar', 'Dunas de Marte', 'Nube de Nitrógeno', 'Jardín Espacial', 'Valle Lunar'],
];
const generatedTags = [
  'nave cohete sonda satelite exploracion espacio',
  'planeta luna crater anillos mundo espacio',
  'astronauta rover ciencia exploracion equipo',
  'orbita trayectoria estrellas sistema espacio',
  'simbolo emblema mision equipo geometria',
  'naturaleza paisaje montana oceano planeta',
];
const generatedColors = [
  [cream, orange, navy], [teal, cream, navy], [gold, orange, navy],
  ['#8aa9d6', '#e7d5a5', '#374c78'], ['#c77d9a', '#f4d8c6', '#49375f'],
  ['#8fc2a8', '#e2e8c9', '#315b55'], ['#d3a66c', '#f5e1b8', '#654b42'],
];
const generatedAssets = CATEGORIES.flatMap((category, categoryIndex) =>
  Array.from({length: 74}, (_, offset) => {
    const index = offset + 1;
    return {
      id: `orb-${categoryIndex + 1}-${String(index).padStart(3, '0')}`,
      name: `${generatedNames[categoryIndex][offset % generatedNames[categoryIndex].length]} ${String(index).padStart(2, '0')}`,
      category,
      colors: [...generatedColors[(offset + categoryIndex * 2) % generatedColors.length]],
      tags: generatedTags[categoryIndex].split(' '),
      variant: {categoryIndex, index},
    };
  }),
);
export const ASSETS = [
  ...entries.map(([id,name,category,colors,tags]) => ({id,name,category,colors,tags:tags.split(' ')})),
  ...generatedAssets,
];

function generatedAssetMarkup(asset, [a, b, c]) {
  const {categoryIndex, index} = asset.variant;
  const angle = (index * 37 + categoryIndex * 19) % 360;
  const inset = 18 + index % 12;
  const detailCount = 1 + index % 4;
  let art = '';

  if (categoryIndex === 0) {
    switch (index % 5) {
      case 0:
        art = path(`M50 8 Q${62 + index % 8} 28 62 57 L58 74 H42 L38 57 Q${38 - index % 8} 28 50 8Z`, a)
          + path('M39 53 24 68 27 82 44 69M61 53 76 68 73 82 56 69', b)
          + circle(50, 42, 8 + index % 5, c) + rect(43, 62, 14, 5, b, 2)
          + path('M43 74Q40 88 50 94Q60 88 57 74Z', index % 2 ? c : b);
        break;
      case 1: {
        const grid = Array.from({length: 1 + index % 4}, (_, i) => line(`M${13 + i * 7} 30V70`, c, 1.4)).join('');
        art = rect(8, 29, 27, 42, b, 2) + rect(65, 29, 27, 42, b, 2) + grid
          + rect(37, 36, 26, 28, a, 5) + circle(50, 50, 7 + index % 5, c)
          + line('M50 35V20M50 64V80', b, 3) + circle(50, 15, 3 + index % 3, a);
        break;
      }
      case 2:
        art = path('M36 21Q50 9 64 21L78 62 69 77H31L22 62Z', a)
          + path('M36 21Q50 9 64 21L69 36H31Z', b) + rect(39, 42, 22, 18, c, 7)
          + line('M27 67H73M38 81H62', b, 3) + circle(34 + index % 7, 68, 3, c);
        break;
      case 3:
        art = rect(24, 45, 52, 18, a, 5) + rect(38, 34, 24, 15, b, 3)
          + circle(32, 70, 9 + index % 3, c) + circle(68, 70, 9 + index % 3, c)
          + circle(32, 70, 4, b) + circle(68, 70, 4, b)
          + line(`M50 35V${18 + index % 8}M50 ${18 + index % 8} 64 27`, a, 3);
        break;
      default:
        art = ring(50, 50, 28 + index % 8, 13 + index % 5, b, 4, 25 + index % 90)
          + rect(39, 40, 22, 22, a, 4) + circle(50, 51, 7, c)
          + line('M50 40 62 22M50 62 37 81M39 51 18 42M61 51 82 61', b, 3)
          + circle(63, 20, 4, c);
    }
  } else if (categoryIndex === 1) {
    const radius = 30 + index % 12;
    art = index % 3 === 0 ? ring(50, 51, 42, 12 + index % 8, b, 4, index * 7) : '';
    art += circle(50, 50, radius, a);
    for (let i = 0; i < detailCount; i++) {
      const y = 31 + i * 13 + index % 5;
      art += path(`M${50 - radius} ${y} Q50 ${y - (4 + index % 7)} ${50 + radius} ${y + (index % 3)} L${50 + radius} ${y + 6} Q50 ${y + 2} ${50 - radius} ${y + 8}Z`, i % 2 ? c : b);
    }
    for (let i = 0; i < 1 + index % 5; i++) {
      art += circle(28 + (i * 17 + index * 3) % 45, 30 + (i * 11 + index * 5) % 42, 2 + (i + index) % 4, i % 2 ? b : c);
    }
    art += ring(50, 50, radius, radius, c, 1.5);
  } else if (categoryIndex === 2) {
    switch (index % 5) {
      case 0:
        art = circle(50, 29, 19, a) + rect(32, 26, 36, 32, c, 13)
          + rect(31, 54, 38, 28, a, 8) + rect(38, 78, 10, 12, b, 3)
          + rect(52, 78, 10, 12, b, 3) + rect(40, 33, 20, 12, b, 6)
          + rect(41, 60, 18, 12, c, 3);
        break;
      case 1:
        art = rect(22, 47, 56, 19, a, 4) + rect(36, 36, 25, 16, b, 2)
          + circle(31, 72, 10, c) + circle(69, 72, 10, c) + circle(31, 72, 4, b)
          + circle(69, 72, 4, b) + line(`M49 37V${17 + index % 9}L${63 + index % 5} 24`, a, 3);
        break;
      case 2:
        art = path('M28 75 31 43 50 20 69 43 72 75Z', a)
          + path('M31 43 50 20 69 43Z', b) + rect(41, 51, 18, 24, c, 3)
          + line(`M34 57H${20 + index % 10}M66 57H${80 - index % 10}`, b, 3);
        break;
      case 3:
        art = rect(46, 44, 8, 39, a, 2) + ring(50, 38, 22 + index % 9, 9 + index % 4, b, 4, index * 11)
          + circle(50, 38, 8, c) + line('M50 83 39 94M50 83 61 94', a, 3);
        break;
      default:
        art = line('M50 14V82M35 83H65M50 26 31 43M50 26 69 43', a, 5)
          + circle(50, 13, 6 + index % 4, b) + circle(30, 45, 7, c) + circle(70, 45, 7, c)
          + ring(50, 31, 31, 13, b, 2, index * 5);
    }
  } else if (categoryIndex === 3) {
    art = ring(50, 50, 34 + index % 10, 13 + index % 9, b, 3, index * 9)
      + (index % 2 ? ring(50, 50, 25 + index % 8, 41, c, 2, index * 13) : '')
      + poly(star(50, 50, 15 + index % 8, 7 + index % 4, 4 + index % 5), a);
    for (let i = 0; i < detailCount; i++) {
      const x = 18 + (i * 23 + index * 7) % 64;
      const y = 22 + (i * 19 + index * 11) % 56;
      art += circle(x, y, 3 + (index + i) % 4, i % 2 ? c : b);
    }
  } else if (categoryIndex === 4) {
    switch (index % 5) {
      case 0:
        art = poly(star(50, 50, 39, 20 + index % 9, 5 + index % 4), a)
          + poly(star(50, 50, 18, 8, 5 + index % 4), b) + circle(50, 50, 5, c);
        break;
      case 1:
        art = ring(50, 50, 30, 30, a, 4) + ring(50, 50, 16, 16, b, 3)
          + line('M50 5V31M50 69V95M5 50H31M69 50H95', a, 3)
          + poly(star(50, 50, 9, 4, 4), c);
        break;
      case 2:
        art = poly(`50,${8 + index % 9} 82,50 50,${92 - index % 9} 18,50`, a)
          + poly(`50,${22 + index % 5} 68,50 50,${78 - index % 5} 32,50`, b)
          + circle(50, 50, 7, c);
        break;
      case 3:
        art = poly(`50,7 62,35 93,38 70,57 77,88 50,72 23,88 30,57 7,38 38,35`, a)
          + line(`M50 17V${37 + index % 8}M50 63V83M17 50H${37 + index % 8}M63 50H83`, b, 3)
          + circle(50, 50, 6, c);
        break;
      default:
        art = poly(`50,7 89,29 89,71 50,93 11,71 11,29`, a)
          + poly(`50,${20 + index % 8} 76,36 76,64 50,80 24,64 24,36`, c)
          + poly(star(50, 50, 17 + index % 7, 7, 5), b);
    }
  } else {
    switch (index % 5) {
      case 0:
        art = path(`M4 85 ${28 + index % 8} ${35 + index % 7} 50 ${58 + index % 8} ${69 + index % 7} ${18 + index % 8} 96 85Z`, a)
          + path(`M${28 + index % 8} ${35 + index % 7} 50 ${58 + index % 8} 40 55 31 58Z`, b)
          + path(`M69 ${18 + index % 8} 50 ${58 + index % 8} 59 49 69 54Z`, c)
          + line('M5 88H95', b, 3);
        break;
      case 1:
        art = path(`M4 54Q20 ${35 + index % 12} 37 54T70 53Q83 37 96 47V89H4Z`, a)
          + path(`M4 69Q20 54 38 68T72 67Q84 54 96 65V89H4Z`, c)
          + line('M8 80Q23 70 38 80T68 79T92 80', b, 3);
        break;
      case 2:
        art = path(`M18 82Q${5 + index % 8} 27 83 13Q95 85 30 88Z`, a)
          + line(`M14 88 75 25M${30 + index % 8} 72 31 48M44 57 43 35M48 54 68 55M60 42 79 42`, b, 3)
          + path('M14 88Q31 75 48 54Q66 35 83 13', c);
        break;
      case 3:
        art = path('M5 51Q19 11 35 43T62 32Q79 5 95 25V57Q77 42 61 64T34 69Q19 43 5 77Z', a)
          + path('M5 56Q19 22 35 50T62 40Q79 15 95 33V42Q77 27 61 52T34 58Q19 32 5 65Z', b)
          + poly(star(19 + index % 62, 18 + index % 20, 5, 2, 4), c);
        break;
      default:
        art = path(`M22 72Q5 72 6 55Q7 39 25 39Q30 18 49 20Q66 20 70 38Q91 32 95 52Q98 71 78 73Z`, a)
          + path('M7 56Q10 72 25 72H78Q94 71 95 56Q84 67 72 63Q57 77 43 65Q21 72 7 56Z', b)
          + circle(35, 44, 3 + index % 3, c);
    }
  }

  const details = Array.from({length: detailCount}, (_, i) => {
    const x = inset + (i * 23 + index * 5) % (100 - inset * 2);
    const y = 12 + (i * 17 + index * 3) % 76;
    return i % 2 ? circle(x, y, 1.5 + (i + index) % 2, c) : poly(star(x, y, 3 + (i + index) % 2, 1.3, 4), b);
  }).join('');
  return `<g transform="rotate(${angle} 50 50)" stroke-linecap="round" stroke-linejoin="round">${art}${details}</g>`;
}

export function assetMarkup(id, suppliedColors) {
  const asset=ASSETS.find(item=>item.id===id);
  if(!asset)return '';
  const [a,b,c]=asset.colors.map((fallback,i)=> /^#[0-9a-f]{6}$/i.test(suppliedColors?.[i]||'')?suppliedColors[i]:fallback);
  if(asset.variant)return generatedAssetMarkup(asset,[a,b,c]);
  let art='';
  switch(id) {
    case 'rocket': art=path('M40 65 36 82 22 86 25 62 39 42',b)+path('M60 65 64 82 78 86 75 62 61 42',b)+path('M42 77 Q36 91 50 99 Q64 91 58 77',b)+path('M46 78 Q43 88 50 92 Q57 88 54 78',a)+path('M37 72 Q30 30 50 5 Q70 30 63 72Z',a)+path('M39 24 Q43 12 50 5 Q57 12 61 24Z',b)+circle(50,42,11,c)+circle(50,42,7,b)+circle(48,40,2,a)+rect(38,67,24,9,c,2)+line('M44 57H56',c,2);break;
    case 'rocket-round': art=path('M34 55 15 70 15 85 38 76M66 55 85 70 85 85 62 76',c)+path('M44 76 39 93 50 87 61 93 56 76',b)+path('M32 69Q25 29 50 6Q75 29 68 69L60 79H40Z',a)+path('M34 27Q41 12 50 6Q59 12 66 27Z',b)+circle(50,44,13,c)+circle(50,44,9,b)+line('M42 64H58',c,4)+circle(47,41,3,a);break;
    case 'shuttle': art=path('M43 19Q50 3 57 19L61 47 87 74 86 83 62 77 58 87 42 87 38 77 14 83 13 74 39 47Z',a)+path('M44 25H56L58 36H42Z',c)+path('M48 48H52V84H48Z',b)+path('M15 75 38 61 38 70 14 82M85 75 62 61 62 70 86 82',c)+rect(42,85,7,7,c,1)+rect(51,85,7,7,c,1)+line('M41 39H59',b,2);break;
    case 'satellite': art=rect(8,28,26,44,b,2)+rect(66,28,26,44,b,2)+line('M21 29V71M9 42H33M9 57H33M79 29V71M67 42H91M67 57H91',c,2)+rect(30,47,40,6,c)+rect(38,34,24,35,a,4)+rect(43,39,14,9,c,1)+path('M41 27Q50 40 59 27Z',a)+line('M50 28V16M50 69V82M44 82H56',c,3)+circle(50,14,3,b)+rect(43,56,14,6,b,1);break;
    case 'iss': art=rect(15,10,18,29,b)+rect(15,61,18,29,b)+rect(67,10,18,29,b)+rect(67,61,18,29,b)+line('M24 11V38M16 20H32M16 29H32M24 62V89M16 71H32M16 80H32M76 11V38M68 20H84M68 29H84M76 62V89M68 71H84M68 80H84',c,1.5)+line('M24 39V61M76 39V61M9 50H91',c,4)+rect(34,43,33,14,a,3)+rect(44,26,12,48,a,3)+rect(43,40,14,20,c,2)+rect(46,44,8,12,a)+rect(36,46,5,8,b)+rect(59,46,5,8,b)+line('M50 74V86',c,3);break;
    case 'capsule': art=path('M39 18H61L79 62 72 77H28L21 62Z',a)+path('M39 18H61L67 33H33Z',b)+rect(39,39,22,14,c,4)+rect(43,42,14,8,b,2)+path('M21 62H79L75 70H25Z',c)+rect(29,75,42,9,b,3)+line('M50 8V18M32 87H68',c,3)+path('M42 85 36 97 50 91 64 97 58 85',b);break;
    case 'probe': art=path('M23 20Q25 55 60 57Z',a)+path('M23 20 60 57 65 15Z',b)+line('M47 36 70 7M48 50 48 71M48 71 19 91M48 71 83 92M48 71V95',c,3)+circle(71,6,4,a)+rect(38,63,23,14,a,2)+rect(41,67,16,6,c)+rect(4,53,20,8,b)+line('M24 57 39 67M61 69 86 60M86 60V34',c,3)+circle(86,32,3,b);break;
    case 'ufo': art=path('M31 45Q28 14 50 14Q72 14 69 45Z',b)+path('M37 38Q35 21 49 21',a)+path('M8 48Q50 26 92 48L82 62Q50 80 18 62Z',a)+path('M8 48Q50 65 92 48L82 62Q50 80 18 62Z',c)+circle(29,57,4,b)+circle(50,62,4,b)+circle(71,57,4,b)+line('M29 80 24 88M50 84V94M71 80 76 88',a,4);break;
    case 'spaceplane': art=path('M9 57 39 43 50 7 59 43 91 57 89 68 59 62 57 81 66 89 64 94 50 89 36 94 34 89 43 81 41 62 11 68Z',a)+path('M46 31 50 19 54 31 55 46H45Z',c)+path('M10 58 38 51 38 58 11 68M90 58 62 51 62 58 89 68',b)+rect(47,62,6,23,c,2);break;
    case 'booster': art=rect(22,39,13,43,a,5)+rect(65,39,13,43,a,5)+path('M37 77V26L50 5 63 26V77Z',a)+path('M37 26 50 5 63 26Z',b)+rect(38,49,24,7,c)+rect(38,68,24,10,b)+path('M24 82 21 96 29 90 36 96 33 82M67 82 64 96 71 90 79 96 76 82M43 79 39 98 50 91 61 98 57 79',b)+rect(22,66,13,6,c)+rect(65,66,13,6,c)+rect(46,32,8,9,c,2);break;
    case 'earth': art=circle(50,50,39,a)+path('M28 18 43 14 48 24 39 31 42 41 30 42 27 52 17 48 12 39 17 27Z',b)+path('M35 48 49 44 60 52 60 64 52 71 49 86 39 78 40 64 31 59Z',b)+path('M61 15 78 24 86 37 78 42 68 33 59 35 55 24Z',b)+path('M69 58 83 53 88 65 78 78 69 74 65 64Z',b)+ring(50,50,39,39,c,2)+line('M18 60Q48 78 84 58',c,1.5);break;
    case 'mars': art=circle(50,50,38,a)+path('M17 36Q35 23 56 31T85 37L88 49Q65 39 51 45T12 52Z',b)+path('M20 72Q45 62 62 71L73 80Q46 98 20 72',b)+circle(62,28,7,c)+circle(34,56,9,c)+circle(70,61,4,c)+circle(32,54,6,a)+circle(61,27,4,a)+ring(50,50,38,38,c,2);break;
    case 'moon': art=circle(50,50,38,a)+circle(32,37,9,b)+circle(66,61,12,b)+circle(36,68,5,b)+circle(61,29,5,b)+circle(27,52,3,b)+circle(54,79,3,b)+line('M25 37Q26 28 35 30M56 60Q57 51 66 52M57 28Q59 24 63 26',c,2)+ring(50,50,38,38,c,2);break;
    case 'saturn': art=circle(50,48,29,a)+path('M25 34Q48 42 73 31L78 42Q52 54 21 45Z',b)+path('M23 55Q48 65 78 50L75 63Q47 77 27 64Z',b)+ring(50,48,29,29,c,2)+path('M16 51C-10 80 35 86 78 54C116 26 92 20 78 31L80 37C97 30 97 40 72 56C39 78 5 77 21 57Z',c)+path('M17 54C0 75 38 77 74 54C104 34 92 27 81 34',b);break;
    case 'sun': art=poly(star(50,50,47,35,12),b)+circle(50,50,31,a)+ring(50,50,24,24,b,2)+line('M39 41Q50 34 61 41',b,3)+circle(39,52,2,c)+circle(61,52,2,c)+line('M42 61Q50 67 58 61',c,2);break;
    case 'jupiter': art=circle(50,50,39,a)+path('M20 26Q51 36 80 26L86 37Q49 46 14 37Z',b)+path('M11 46Q42 54 89 46V56Q43 65 12 56Z',b)+path('M16 68Q47 77 83 68L76 81Q47 89 26 81Z',b)+`<ellipse cx="65" cy="59" rx="12" ry="6" fill="${c}"/>`+`<ellipse cx="65" cy="59" rx="7" ry="3" fill="${a}"/>`+ring(50,50,39,39,c,2);break;
    case 'neptune': art=circle(50,50,38,a)+path('M18 28Q46 16 79 29L84 39Q48 29 14 41Z',b)+path('M12 51Q46 40 88 52L86 63Q53 50 15 63Z',b)+path('M24 78Q53 67 79 74L70 83Q48 92 24 78',b)+line('M30 45Q48 38 69 43M36 69Q49 64 65 68',c,2)+ring(50,50,38,38,c,2);break;
    case 'eclipse': art=poly(star(50,50,47,35,16),b)+circle(50,50,35,c)+circle(50,50,31,a)+circle(73,25,5,c)+poly(star(78,19,6,2.5,4),c);break;
    case 'crescent': art=path('M64 10A40 40 0 1 0 90 64A34 34 0 0 1 64 10Z',a)+poly(star(70,38,12,4,4),b)+poly(star(87,20,6,2.5,4),a)+circle(24,59,4,b)+circle(36,78,3,b);break;
    case 'planet': art=circle(50,50,35,a)+path('M20 33Q32 22 47 32T81 29L85 43Q68 52 52 42T16 48Z',b)+path('M17 60Q32 50 48 60T83 59L77 75Q59 83 44 72T25 77Z',b)+ring(50,50,44,11,c,3,-35)+circle(85,20,5,c);break;
    case 'astronaut': art=rect(24,36,52,35,c,10)+rect(30,34,40,38,a,10)+rect(32,66,15,26,a,5)+rect(53,66,15,26,a,5)+rect(30,86,18,8,b,3)+rect(52,86,18,8,b,3)+path('M29 39Q24 34 20 42L11 58Q8 66 16 69L32 54M71 39Q76 34 80 42L89 58Q92 66 84 69L68 54',a)+circle(50,24,21,a)+rect(33,13,34,24,c,10)+path('M38 18Q50 11 61 20',b)+rect(39,44,22,15,c,3)+rect(42,47,9,8,b,1)+circle(56,50,2,a)+circle(56,55,2,a)+rect(33,64,34,5,b)+line('M16 59 23 63M77 63 84 59',b,4);break;
    case 'helmet': art=path('M18 45Q18 12 50 10Q82 12 82 45V67L69 85H31L18 67Z',a)+rect(24,28,52,39,c,16)+path('M31 45Q31 25 52 28Q66 28 70 40L63 36Q44 28 37 48Z',b)+rect(15,43,8,20,b,3)+rect(77,43,8,20,b,3)+rect(30,77,40,10,c,3)+rect(38,79,24,5,b,2)+line('M30 72H70',c,2);break;
    case 'glove': art=path('M27 57 14 43Q10 35 18 33L30 41V20Q30 10 38 13L40 36V13Q40 4 48 10L50 35V13Q50 6 58 12L60 38V21Q62 13 68 20L71 54 66 73H35Z',a)+rect(32,69,37,17,b,3)+rect(35,81,31,10,c,2)+line('M40 48 44 57M51 47 53 56M61 46 62 55',c,2);break;
    case 'boot': art=path('M36 12H68L66 58 86 68Q94 73 91 86H17V70L30 60Z',a)+path('M36 12H68L67 28H34Z',b)+path('M17 79H92V90H17Z',c)+line('M39 37H62M37 46H61M35 55H60M42 67 68 74',c,3)+line('M26 84V90M39 84V90M52 84V90M65 84V90M78 84V90',b,2);break;
    case 'flag': art=line('M25 9V88M15 91H44',c,5)+path('M28 14Q45 4 60 15T88 14V56Q75 66 59 55T28 55Z',a)+poly(star(56,33,13,6,5),b)+circle(25,8,5,b)+path('M11 94 28 83 45 94Z',b);break;
    case 'rover': art=line('M27 64 19 78M73 64 81 78M33 68 50 78 67 68',c,5)+circle(18,80,10,c)+circle(50,80,10,c)+circle(82,80,10,c)+circle(18,80,4,a)+circle(50,80,4,a)+circle(82,80,4,a)+path('M24 49H71L82 66H17Z',a)+rect(30,42,38,12,b,2)+line('M48 42V23M48 30 64 21',c,4)+rect(36,13,28,13,a,3)+circle(44,19,4,c)+circle(57,19,3,c)+path('M22 48 9 37 16 24',c)+circle(16,24,4,b)+line('M28 58H68',c,2);break;
    case 'telescope': art=`<g transform="rotate(-30 50 50)">`+rect(10,37,23,29,b)+rect(67,37,23,29,b)+line('M21 38V65M79 38V65M11 47H32M11 56H32M68 47H89M68 56H89',c,1.5)+rect(29,46,42,6,c)+rect(37,20,26,54,a,4)+rect(35,17,30,10,c,2)+rect(40,20,20,5,b,2)+rect(37,61,26,7,c)+path('M43 74H57L60 84H40Z',b)+line('M46 30V49',b,3)+`</g>`;break;
    case 'antenna': art=path('M17 22Q14 69 64 74L79 59Z',a)+path('M17 22Q52 29 79 59Q39 59 17 22Z',b)+line('M46 45 69 22M68 23 75 15M44 71 37 91M55 74 64 91M27 92H73',c,4)+circle(75,15,4,a)+line('M76 28Q87 31 88 42M81 18Q97 23 97 38',b,3);break;
    case 'lander': art=path('M37 16H63L70 38 63 51H37L30 38Z',a)+rect(39,22,22,13,c,2)+rect(44,25,12,7,b,1)+path('M31 51H69L76 66H24Z',b)+line('M32 64 19 87M68 64 81 87M10 89H29M71 89H90M50 16V6',c,4)+rect(43,62,14,11,c,2)+path('M45 76 41 93 50 87 59 93 55 76',a)+line('M32 39H19V25M69 40H81V22',c,2)+circle(18,23,3,a)+circle(81,20,3,a);break;
    case 'observatory': art=rect(16,49,68,34,a,2)+path('M18 48Q20 13 50 13Q80 13 82 48Z',b)+path('M45 14H55V49H45Z',c)+`<g transform="rotate(-30 58 29)">`+rect(49,20,33,12,a,2)+rect(78,18,8,16,c,1)+`</g>`+rect(42,63,16,20,c,2)+rect(24,58,10,10,b,1)+rect(66,58,10,10,b,1)+rect(11,83,78,6,c,2);break;
    case 'orbit': art=ring(50,50,43,20,a,3,-28)+ring(50,50,28,28,b,2)+circle(50,50,15,b)+circle(83,29,7,c)+circle(16,70,4,b);break;
    case 'orbit-cross': art=ring(50,50,43,17,a,3,35)+ring(50,50,43,17,b,3,-35)+circle(50,50,10,c)+circle(83,73,6,c)+circle(18,73,5,a);break;
    case 'comet': art=path('M17 67 88 8 61 65 34 90Z',b)+path('M25 71 76 26 49 73 31 88Z',c)+circle(28,76,18,a)+circle(24,73,5,b)+circle(35,80,3,b)+line('M55 29 70 13M68 50 88 30M46 16 57 5',a,3);break;
    case 'constellation': art=line('M13 65 30 39 49 46 63 18 84 29 78 62 57 84 49 46M13 65 57 84',b,2)+circle(13,65,4,a)+circle(30,39,5,a)+circle(49,46,4,a)+poly(star(63,18,8,3,4),c)+circle(84,29,4,a)+poly(star(78,62,8,3,4),a)+circle(57,84,5,c);break;
    case 'galaxy': art=line('M52 50C71 19 90 38 80 61C69 87 31 85 17 60C0 30 30 3 60 16C88 28 91 56 66 66C47 74 24 58 34 41C42 27 61 34 60 45',a,6)+line('M46 51C27 80 10 62 21 40C33 15 68 16 81 41',b,4)+circle(50,50,10,c)+circle(87,15,3,b)+circle(10,84,3,c);break;
    case 'shooting-star': art=path('M38 55 94 10 66 64 28 91Z',b)+path('M43 61 87 27 60 70 30 91Z',c)+poly(star(28,73,24,10,5),a)+line('M22 39 49 17M48 90 78 70',a,3);break;
    case 'solar-system': art=ring(50,50,22,22,a,1.5)+ring(50,50,34,34,b,1.5)+ring(50,50,46,46,c,1.5)+circle(50,50,12,a)+circle(67,36,5,b)+circle(19,65,6,c)+circle(82,82,7,b)+circle(44,5,4,a);break;
    case 'star-field': art=poly(star(20,23,12,4,4),a)+poly(star(70,31,17,6,4),b)+poly(star(43,69,20,7,4),a)+poly(star(83,81,8,3,4),c)+circle(46,16,2,c)+circle(13,58,3,b)+circle(75,59,2,a)+circle(22,88,2,c)+circle(90,16,2,a);break;
    case 'star': art=poly(star(50,50,44,20,5),a)+path('M50 6 50 50 24 85 31 56 8 36 38 32Z',b)+poly(star(50,50,44,20,5),'none').replace('fill="none"',`fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round"`);break;
    case 'sparkle': art=path('M50 4 61 39 96 50 61 61 50 96 39 61 4 50 39 39Z',a)+path('M50 4V50H4L39 39ZM50 96V50H96L61 61Z',b)+circle(50,50,6,c);break;
    case 'compass': art=ring(50,50,32,32,c,3)+poly(star(50,50,47,12,4),a)+path('M50 3 50 50 62 38ZM97 50 50 50 62 62ZM50 97 50 50 38 62ZM3 50 50 50 38 38Z',b)+circle(50,50,7,c)+circle(50,50,3,a);break;
    case 'diamond': art=poly('50,6 90,50 50,94 10,50',a)+poly('50,6 50,50 10,50',b)+poly('90,50 50,94 50,50',b)+line('M50 6 90 50 50 94 10 50Z',c,2)+poly('50,31 67,50 50,69 33,50',c);break;
    case 'lightning': art=path('M54 5 17 57H43L33 95 85 38H59L72 5Z',a)+path('M54 5 30 48H54L33 95 64 45H46Z',b)+line('M54 5 17 57H43L33 95 85 38H59L72 5Z',c,2);break;
    case 'atom': art=ring(50,50,44,16,a,3,0)+ring(50,50,44,16,b,3,60)+ring(50,50,44,16,a,3,-60)+circle(50,50,9,c)+circle(7,50,5,c)+circle(71,13,5,c)+circle(71,87,5,b);break;
    case 'laurel': art=line('M49 91Q10 69 18 25M51 91Q90 69 82 25',c,2)+path('M21 66Q2 60 9 46Q24 51 21 66M17 48Q3 38 13 26Q25 34 17 48M22 32Q13 17 27 8Q35 23 22 32M30 81Q10 80 12 66Q30 66 30 81M43 90Q25 94 21 81Q38 77 43 90',a)+path('M79 66Q98 60 91 46Q76 51 79 66M83 48Q97 38 87 26Q75 34 83 48M78 32Q87 17 73 8Q65 23 78 32M70 81Q90 80 88 66Q70 66 70 81M57 90Q75 94 79 81Q62 77 57 90',a)+poly(star(50,35,19,8,5),b);break;
    case 'ribbon': art=path('M6 40H25V69H6L14 55ZM75 40H94L86 55 94 69H75Z',b)+path('M18 30Q50 21 82 30V61Q50 52 18 61Z',a)+path('M18 61 25 69V59M82 61 75 69V59',c)+line('M25 35Q50 29 75 35M25 54Q50 48 75 54',c,2)+poly(star(50,43,8,3.5,5),b);break;
    case 'target': art=ring(50,50,32,32,a,3)+ring(50,50,17,17,b,2)+line('M50 4V26M50 74V96M4 50H26M74 50H96',a,3)+circle(50,50,5,c)+circle(50,18,3,c)+circle(82,50,3,c);break;
    case 'hexagon': art=poly('50,5 89,27 89,73 50,95 11,73 11,27',a)+poly('50,15 80,32 80,68 50,85 20,68 20,32',c)+poly('50,22 74,36 74,64 50,78 26,64 26,36',a)+poly(star(50,49,22,10,5),b);break;
    case 'mountain': art=path('M2 86 34 28 49 52 65 15 98 86Z',a)+path('M34 28 20 53 31 49 38 57 43 43ZM65 15 49 52 62 46 70 54 77 41Z',b)+path('M34 28 34 86H2ZM65 15 65 86H43Z',c)+path('M34 28V51L31 49 20 53ZM65 15V47L62 46 49 52Z',b)+line('M4 88H96',b,3);break;
    case 'wave': art=path('M4 57Q17 40 35 54Q46 64 59 42Q74 17 96 35Q75 26 72 48Q70 65 97 67V89H4Z',a)+path('M4 72Q20 57 38 73T71 72Q85 61 97 70V89H4Z',c)+line('M8 68Q24 54 40 68T71 67M60 40Q71 23 88 30',b,4)+line('M10 82Q23 73 35 81M58 82Q72 73 88 80',b,2);break;
    case 'tree': art=rect(45,55,10,37,c,2)+path('M50 4 26 32H36L15 56H31L7 77H93L69 56H85L64 32H74Z',a)+path('M50 4V77H7L31 56H15L36 32H26Z',c)+line('M50 21V76M50 42 62 35M50 58 70 47M50 70 78 62',b,2)+line('M36 92H64',b,3);break;
    case 'leaf': art=path('M15 81Q-4 29 86 10Q99 91 31 87Z',a)+path('M15 81Q-4 29 86 10L15 81Z',c)+line('M10 92 73 28M30 71 28 48M43 57 42 35M44 58 66 58M58 43 76 43',b,3);break;
    case 'desert': art=circle(72,29,14,b)+path('M4 65Q26 36 54 58T96 58V89H4Z',a)+path('M4 78Q25 51 57 74T96 69V90H4Z',b)+path('M4 86Q36 67 66 83T96 79V94H4Z',c)+path('M14 62 20 39 26 41 31 61Z',c)+line('M42 41H55M34 31H48',b,2);break;
    case 'aurora': art=path('M5 45Q20 8 34 37T61 27Q76 1 95 20L95 53Q76 37 61 59T34 64Q19 37 5 71Z',a)+path('M5 48Q20 17 34 43T61 34Q76 9 95 27V35Q76 18 61 44T34 52Q20 27 5 58Z',b)+path('M3 90 26 67 42 82 64 58 97 90Z',c)+poly(star(17,15,5,2,4),b)+circle(75,7,2,b);break;
    case 'cloud': art=path('M23 74Q5 74 5 57Q5 41 23 40Q26 18 47 20Q64 21 68 37Q91 33 95 53Q99 73 79 74Z',a)+path('M5 57Q6 72 23 74H79Q97 73 95 57Q86 68 74 64Q57 76 43 65Q20 72 5 57',b)+line('M29 43Q33 28 47 29M72 44Q85 41 87 53',c,2);break;
    case 'drop': art=path('M50 5Q15 44 15 62A35 35 0 0 0 85 62Q85 44 50 5Z',a)+path('M50 5Q15 44 15 62A35 35 0 0 0 50 97Z',c)+path('M65 48Q78 65 65 77Q61 81 57 78Q54 75 59 69Q65 62 61 53Q59 47 65 48Z',b)+circle(69,40,3,b);break;
  }
  return `<g stroke-linecap="round" stroke-linejoin="round">${art}</g>`;
}
