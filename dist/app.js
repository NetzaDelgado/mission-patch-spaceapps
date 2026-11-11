import { ASSETS, CATEGORIES, assetMarkup } from './assets.js';
import { createDocument, TEMPLATES, renderPatch, validateDocument } from './model.js';
import { exportPatch, downloadProject } from './export.js';

const $ = (s, root=document) => root.querySelector(s);
const esc = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone = value => structuredClone(value);
const icons = {
 orbit:'<circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(-35 12 12)"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 elements:'<circle cx="7" cy="7" r="4"/><path d="m16 3 6 9H10Z"/><rect x="4" y="15" width="8" height="7" rx="1"/><path d="m18 15 4 4-4 4-4-4Z"/>',
 text:'<path d="M4 6V3h16v3M12 3v18M8 21h8"/>', upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6"/>',
 layers:'<path d="m3 8 9-5 9 5-9 5-9-5Zm0 5 9 5 9-5M3 18l9 5 9-5"/>',
 search:'<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>',
 download:'<path d="M12 3v13m-5-5 5 5 5-5M4 16v5h16v-5"/>',
 undo:'<path d="m8 4-5 5 5 5M3 9h11a6 6 0 0 1 0 12"/>',redo:'<path d="m16 4 5 5-5 5m5-5H10a6 6 0 0 0 0 12"/>',
 chevron:'<path d="m8 4 8 8-8 8"/>', down:'<path d="m6 9 6 6 6-6"/>', up:'<path d="m6 15 6-6 6 6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',
 fit:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
 check:'<path d="m5 12 4 4L19 6"/>', close:'<path d="m6 6 12 12M6 18 18 6"/>',
 copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v13h5"/>',
 trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/>',
 unlock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0"/>',
 star:'<path d="m12 2 3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1Z"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3v1"/>',
 save:'<path d="M4 3h13l4 4v14H3V3Zm3 0v7h9V3M7 21v-7h10v7"/>',
 image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="2"/><path d="m3 17 5-5 4 4 4-7 5 8"/>',
 folder:'<path d="M3 7V4h7l3 3h8v14H3V7Z"/>',
 spark:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3ZM20 2v4m-2-2h4"/>',
 cursor:'<path d="m5 3 15 10-8 1-4 7-3-18Z"/>',
 rotate:'<path d="M20 10a8 8 0 1 0-1 8M20 3v7h-7"/>',
 home:'<path d="m3 11 9-8 9 8M5 9v12h14V9M9 21v-8h6v8"/>'
};
const icon=(name,size=20)=>`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.star}</svg>`;
const uid=()=>crypto.randomUUID();
let doc=createDocument('odyssey');
let restoreError=false;
try { const raw=localStorage.getItem('orbita-current-v1'); if(raw) doc=validateDocument(JSON.parse(raw)); } catch { restoreError=true; }
let selected=null, panel='elements', category='Todos', search='', zoom=100, profile=false;
let history=[], future=[], drag=null, saveTimer, toastTimer;
const palettes=[['#142b3c','#f6dfb1','#ed693b'],['#193c40','#d9e9ce','#e6b652'],['#412d57','#f6d7c1','#c47aa0'],['#263953','#e9e9dc','#76a8bc'],['#552e31','#f2d8aa','#df6d4e'],['#102f47','#e6f3ed','#55b5a6']];

$('#app').innerHTML=`
<header class="app-header">
  <a class="brand" href="#" aria-label="Órbita, inicio del editor"><span class="brand-symbol">${icon('orbit',31)}</span><span>ÓRBITA<small>MISSION PATCH STUDIO</small></span></a>
  <nav class="header-nav" aria-label="Navegación principal"><button class="active" data-action="studio">Estudio</button><button data-action="projects">Mis parches</button><button data-action="guide">Guía rápida ${icon('chevron',12)}</button></nav>
  <div class="challenge"><span class="challenge-stars">✦</span><span>PARA LA COMUNIDAD<small>NASA SPACE APPS</small></span><span class="year">2026</span></div>
  <button class="primary export-top" data-action="export">${icon('download',17)}<span>Descargar parche</span></button>
</header>
<div class="project-bar"><div class="project-info"><span class="project-symbol">${icon('orbit',19)}</span><input id="project-name" aria-label="Nombre del proyecto" maxlength="60" value="${esc(doc.name)}"><span class="project-divider"></span><span class="save-status" id="save-status">${icon('check',14)} Guardado en este dispositivo</span></div><div class="project-actions"><button class="icon-button" data-action="undo" title="Deshacer (Ctrl+Z)" aria-label="Deshacer">${icon('undo',18)}</button><button class="icon-button" data-action="redo" title="Rehacer (Ctrl+Shift+Z)" aria-label="Rehacer">${icon('redo',18)}</button><span class="project-divider"></span><button class="text-button" data-action="save-project">${icon('save',16)} Guardar proyecto</button></div></div>
<main class="workspace">
  <nav class="tool-rail" aria-label="Herramientas del editor">${[['elements','elements','Elementos'],['templates','grid','Plantillas'],['text','text','Texto'],['uploads','upload','Subir'],['layers','layers','Capas']].map(([id,ic,label])=>`<button data-panel="${id}" class="rail-button ${panel===id?'active':''}" title="${label}">${icon(ic,23)}<span>${label}</span></button>`).join('')}<button class="rail-button help-button" data-action="guide" title="Ayuda">${icon('help',21)}<span>Ayuda</span></button></nav>
  <aside class="library" id="library" aria-label="Biblioteca de diseño"></aside>
  <section class="canvas-area" aria-label="Área de diseño"><div class="canvas-heading"><div><span class="eyebrow">TU PRÓXIMA GRAN MISIÓN</span><h1>Empieza con una insignia.</h1></div><span class="editable-badge"><span></span> 100% tuyo</span></div>
    <div class="canvas-tools"><span class="canvas-mode">${icon('cursor',14)} Lienzo de edición</span><button data-action="profile" id="profile-button">${icon('eye',15)} Vista de perfil</button></div>
    <div class="stage-viewport" id="stage-viewport"><div class="stage" id="stage" tabindex="0" aria-label="Lienzo del parche. Selecciona y arrastra elementos; usa las flechas para moverlos."><div id="artwork"></div><svg id="selection-overlay" viewBox="0 0 600 600" aria-hidden="true"></svg></div><div class="drop-hint">${icon('plus',26)} Suelta para añadir a tu misión</div></div>
    <div class="canvas-bottom"><span class="canvas-dimensions">600 × 600 <span>PX · VECTOR</span></span><div class="zoom-control"><button data-action="zoom-out" title="Alejar" aria-label="Alejar">${icon('minus',16)}</button><span id="zoom-label">100%</span><button data-action="zoom-in" title="Acercar" aria-label="Acercar">${icon('plus',16)}</button><span></span><button data-action="fit" title="Ajustar al lienzo" aria-label="Ajustar al lienzo">${icon('fit',17)}</button></div><button class="keyboard-help" data-action="guide">Atajos ${icon('help',14)}</button></div>
    <div class="workspace-footer"><span>CREA. EXPLORA. DEJA TU HUELLA.</span><span>Una pequeña insignia. Una gran historia. ${icon('spark',14)}</span></div>
  </section>
  <aside class="inspector" id="inspector" aria-label="Propiedades del diseño"></aside>
</main>
<input id="image-upload" type="file" accept="image/png,image/jpeg,image/webp" hidden>
<input id="project-upload" type="file" accept="application/json,.json" hidden>`;

function assetThumb(asset,colors=asset.colors){return `<svg viewBox="0 0 100 100" aria-hidden="true">${assetMarkup(asset.id,colors)}</svg>`;}
function renderLibrary(){
  document.querySelectorAll('[data-panel]').forEach(b=>b.classList.toggle('active',b.dataset.panel===panel));
  const titles={elements:['Un universo de ideas','Arrastra un elemento a tu parche.'],templates:['El inicio de tu misión','Elige una base y hazla tuya.'],text:['Palabras que inspiran','Dale voz e identidad a tu misión.'],uploads:['Un toque personal','Añade el emblema de tu equipo.'],layers:['Cada detalle cuenta','Organiza los elementos de tu parche.']};
  let html=`<div class="library-heading"><span class="eyebrow">${panel==='elements'?'BIBLIOTECA ESPACIAL':panel==='templates'?'PUNTO DE PARTIDA':'TU CAJA DE HERRAMIENTAS'}</span><h2>${titles[panel][0]}</h2><p>${titles[panel][1]}</p></div>`;
  if(panel==='elements') {
    const list=ASSETS.filter(a=>(category==='Todos'||a.category===category)&&(!search||[a.name,...(a.tags||[])].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(search.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase())));
    html+=`<label class="search-field">${icon('search',17)}<input id="asset-search" placeholder="Buscar en el universo…" value="${esc(search)}" autocomplete="off" aria-label="Buscar elementos"><kbd>/</kbd></label><div class="category-chips">${['Todos',...CATEGORIES].map(c=>`<button data-category="${esc(c)}" class="${category===c?'active':''}">${esc(c)}</button>`).join('')}</div><div class="section-label"><span>${category==='Todos'?'EXPLORA EL ESPACIO':esc(category.toUpperCase())}</span><span>${list.length} elementos</span></div><div class="asset-grid">${list.map(a=>`<button class="asset-card" draggable="true" data-asset="${a.id}" title="Añadir ${esc(a.name)}">${assetThumb(a)}<span>${esc(a.name)}</span><i>${icon('plus',12)}</i></button>`).join('')}</div>${!list.length?'<div class="empty-state">No encontramos ese elemento.<br>Prueba con planeta, cohete o estrella.</div>':''}<div class="library-tip">${icon('spark',19)}<p>Tu misión, tus colores.<br><span>Todos los elementos son editables.</span></p></div>`;
  } else if(panel==='templates') {
    html+=`<div class="template-grid">${TEMPLATES.map(t=>`<button class="template-card" data-template="${t.id}"><div>${renderPatch(createDocument(t.id))}</div><strong>${esc(t.name)}</strong><span>${esc(t.category||'Misión espacial')}</span></button>`).join('')}</div><button class="secondary full" data-action="blank">${icon('plus',16)} Crear un parche en blanco</button>`;
  } else if(panel==='text'){
    html+=`<button class="add-heading" data-add-text="TU MISIÓN">Añadir un título ${icon('plus',20)}</button><button class="add-subheading" data-add-text="Exploramos juntos">Añadir un subtítulo ${icon('plus',17)}</button><button class="add-body" data-add-text="EQUIPO · 2026">Añadir texto pequeño ${icon('plus',16)}</button><div class="text-samples"><span class="section-label">IDEAS PARA TU PARCHE</span>${['AD ASTRA','EXPLORA LO DESCONOCIDO','MADE OF STARDUST','UN PLANETA. INFINITAS IDEAS.'].map(t=>`<button data-add-text="${t}">${t}${icon('plus',14)}</button>`).join('')}</div><div class="library-tip">${icon('text',20)}<p>Un nombre para tu historia.<br><span>El texto curvo del borde se edita en «Tu parche».</span></p></div>`;
  } else if(panel==='uploads'){
    html+=`<button class="upload-zone" data-action="upload">${icon('upload',32)}<strong>Sube tu imagen</strong><span>PNG, JPG o WebP · hasta 10 MB</span><small>Se incorpora a tu proyecto</small></button><p class="panel-note">Combina las ilustraciones con tu logotipo, una foto o el símbolo de tu equipo.</p><div class="divider"></div><h3>Continúa una misión</h3><p class="panel-note">Abre un proyecto Órbita (.json) para seguir editando todos sus elementos.</p><button class="secondary full" data-action="import">${icon('folder',17)} Abrir proyecto</button>`;
  } else {
    html+=`<div class="layer-list">${[...doc.elements].reverse().map(el=>`<div class="layer-row ${el.id===selected?'selected':''} ${el.hidden?'muted':''}"><button class="layer-select" data-select="${el.id}"><span class="layer-thumb">${el.type==='text'?icon('text',22):el.type==='image'?icon('image',22):assetThumb(ASSETS.find(a=>a.id===el.assetId)||ASSETS[0],el.colors)}</span><span>${esc(elementName(el))}</span></button><button class="tiny-button" data-toggle-hidden="${el.id}" aria-label="${el.hidden?'Mostrar':'Ocultar'} ${esc(elementName(el))}" title="${el.hidden?'Mostrar':'Ocultar'}">${icon('eye',15)}</button><button class="tiny-button ${el.locked?'locked':''}" data-toggle-lock="${el.id}" aria-label="${el.locked?'Desbloquear':'Bloquear'} ${esc(elementName(el))}" title="${el.locked?'Desbloquear':'Bloquear'}">${icon(el.locked?'lock':'unlock',14)}</button></div>`).join('')}</div><p class="panel-note">Las capas superiores aparecen al frente. Selecciona una capa para cambiar su posición.</p>`;
  }
  $('#library').innerHTML=html;
}
function elementName(el){return el.type==='text'?(el.text||'Texto'):el.type==='image'?'Imagen de tu equipo':ASSETS.find(a=>a.id===el.assetId)?.name||'Elemento';}
function currentElement(){return doc.elements.find(e=>e.id===selected);}
function colorField(label,value,data){return `<label class="color-field"><input type="color" value="${value}" ${data}><span>${esc(label)}</span><small>${value.toUpperCase()}</small></label>`;}
function renderInspector(){
 const el=currentElement();
 let html=`<div class="inspector-heading"><div><span class="eyebrow">${el?'DALE TU ESTILO':'EL ADN DE TU MISIÓN'}</span><h2>${el?esc(elementName(el)):'Tu parche'}</h2></div>${el?`<button class="icon-button" data-action="deselect" title="Volver a propiedades del parche" aria-label="Deseleccionar">${icon('close',17)}</button>`:icon('orbit',25)}</div>`;
 if(el){
  html+=`<div class="inspector-section"><div class="selection-status">${icon(el.type==='text'?'text':el.type==='image'?'image':'elements',14)} ${el.locked?'Elemento bloqueado':'Elemento seleccionado'}</div>${el.type==='text'?`<label class="field-label">Contenido<textarea data-element-field="text" maxlength="100" rows="2">${esc(el.text)}</textarea></label><label class="field-label">Tipografía<select data-element-field="fontFamily">${['Arial','Georgia','Courier New','Verdana'].map(f=>`<option ${el.fontFamily===f?'selected':''}>${f}</option>`).join('')}</select></label><label class="toggle-row"><span>Texto en negrita</span><input type="checkbox" data-element-field="bold" ${el.bold?'checked':''}></label>`:''}<label class="field-label">Tamaño <span>${Math.round(el.size)} px</span><input type="range" min="20" max="550" value="${el.size}" data-element-field="size"></label><div class="two-fields"><label class="field-label">Posición X<input type="number" min="0" max="600" value="${Math.round(el.x)}" data-element-field="x"></label><label class="field-label">Posición Y<input type="number" min="0" max="600" value="${Math.round(el.y)}" data-element-field="y"></label></div><label class="field-label">Rotación <span>${Math.round(el.rotation)}°</span><input type="range" min="-180" max="180" value="${el.rotation}" data-element-field="rotation"></label><label class="field-label">Opacidad <span>${Math.round((el.opacity??1)*100)}%</span><input type="range" min="0.1" max="1" step="0.05" value="${el.opacity??1}" data-element-field="opacity"></label></div>`;
  if(el.type!=='image')html+=`<div class="inspector-section"><h3>Colores del elemento</h3>${(el.type==='text'?el.colors.slice(0,1):el.colors).map((c,i)=>colorField(['Principal','Secundario','Detalles'][i],c,`data-element-color="${i}"`)).join('')}</div>`;
  html+=`<div class="inspector-section"><h3>Organizar</h3><div class="two-fields"><button class="secondary" data-action="forward">${icon('up',15)} Adelante</button><button class="secondary" data-action="backward">${icon('down',15)} Atrás</button></div><div class="two-fields action-row"><button class="secondary" data-action="duplicate">${icon('copy',15)} Duplicar</button><button class="secondary danger" data-action="delete">${icon('trash',15)} Eliminar</button></div><button class="text-button full" data-action="center">${icon('fit',16)} Centrar en el parche</button><label class="toggle-row"><span>Bloquear elemento</span><input type="checkbox" data-element-field="locked" ${el.locked?'checked':''}></label></div><button class="back-to-patch" data-action="deselect">${icon('orbit',18)} Personalizar el parche completo</button>`;
 } else {
  html+=`<div class="inspector-section"><h3>Forma del parche</h3><div class="shape-options">${[['circle','Círculo','<circle cx="20" cy="20" r="14"/>'],['shield','Escudo','<path d="M7 5h26v16c0 9-13 15-13 15S7 30 7 21Z"/>'],['hexagon','Hexágono','<path d="m20 4 14 8v16l-14 8-14-8V12Z"/>'],['square','Cuadrado','<rect x="6" y="6" width="28" height="28" rx="7"/>']].map(([s,l,p])=>`<button class="shape-button ${doc.shape===s?'active':''}" data-shape="${s}" title="${l}" aria-label="${l}"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6">${p}</svg></button>`).join('')}</div></div><div class="inspector-section"><h3>Identidad de la misión</h3><label class="field-label">Nombre de la misión<input data-doc-field="title" maxlength="40" value="${esc(doc.title)}" placeholder="NOMBRE DE TU MISIÓN"></label><label class="field-label">Equipo o lema<input data-doc-field="subtitle" maxlength="50" value="${esc(doc.subtitle)}" placeholder="TU EQUIPO · 2026"></label></div><div class="inspector-section"><h3>Paleta de colores <span>A TU MANERA</span></h3><div class="palette-options">${palettes.map((p,i)=>`<button data-palette="${i}" title="Paleta ${i+1}" aria-label="Aplicar paleta ${i+1}">${p.map(c=>`<span style="background:${c}"></span>`).join('')}</button>`).join('')}</div>${colorField('Fondo',doc.background,'data-doc-field="background"')}${colorField('Borde',doc.border,'data-doc-field="border"')}${colorField('Acento',doc.accent,'data-doc-field="accent"')}${colorField('Texto',doc.titleColor,'data-doc-field="titleColor"')}<label class="toggle-row"><span>${icon('star',15)} Campo de estrellas</span><input type="checkbox" data-doc-field="stars" ${doc.stars?'checked':''}></label></div><div class="profile-card"><div class="profile-mini">${renderPatch(doc)}</div><div><strong>Listo para tu perfil</strong><p>Tu misión te acompaña<br>a donde vayas.</p><button data-action="profile">Ver cómo queda ${icon('chevron',12)}</button></div></div><p class="community-note">Creado para exploradores de Space Apps.<br>Herramienta independiente, no oficial de NASA.</p>`;
 }
 $('#inspector').innerHTML=html;
}
function renderCanvas(){
 $('#artwork').innerHTML=renderPatch(doc,{interactive:true});
 $('#stage').classList.toggle('profile-mode',profile);
 $('#profile-button').classList.toggle('active',profile);
 $('#profile-button').innerHTML=`${icon('eye',15)} ${profile?'Volver al lienzo':'Vista de perfil'}`;
 renderSelection();
 updateHistoryButtons();
}
function renderSelection(){
 const el=currentElement(), overlay=$('#selection-overlay');
 if(!el||el.hidden||profile){overlay.innerHTML='';return;}
 const half=el.size/2+7;
 overlay.innerHTML=`<g transform="translate(${el.x} ${el.y}) rotate(${el.rotation})" class="selection"><rect x="${-half}" y="${-half}" width="${half*2}" height="${half*2}" fill="none" stroke="${el.locked?'#7e8a96':'#e85a32'}" stroke-width="1.5" stroke-dasharray="${el.locked?'5 4':'0'}"/>${el.locked?'':`<path d="M0 ${-half}v-25" stroke="#e85a32" stroke-width="1.5"/><circle cx="0" cy="${-half-25}" r="7" data-handle="rotate"/><g>${[[-half,-half],[half,-half],[half,half],[-half,half]].map(([x,y])=>`<rect x="${x-5}" y="${y-5}" width="10" height="10" rx="2" data-handle="resize"/>`).join('')}</g>`}</g>`;
}
function renderAll(){renderLibrary();renderCanvas();renderInspector();$('#project-name').value=doc.name;}
function remember(previous=doc){history.push(clone(previous));if(history.length>60)history.shift();future=[];}
function save(){
 clearTimeout(saveTimer);$('#save-status').innerHTML=`${icon('check',14)} Guardando…`;
 saveTimer=setTimeout(()=>{try{localStorage.setItem('orbita-current-v1',JSON.stringify(doc));$('#save-status').innerHTML=`${icon('check',14)} Guardado en este dispositivo`;}catch{$('#save-status').textContent='Almacenamiento lleno · descarga tu proyecto';}},300);
}
function commit(fn,{full=true}={}){remember();fn();save();full?renderAll():renderCanvas();}
function updateHistoryButtons(){$('[data-action="undo"]').disabled=!history.length;$('[data-action="redo"]').disabled=!future.length;}
function undo(){if(!history.length)return;future.push(clone(doc));doc=history.pop();selected=null;save();renderAll();}
function redo(){if(!future.length)return;history.push(clone(doc));doc=future.pop();selected=null;save();renderAll();}
function notify(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3200);}
function select(id){selected=id;renderCanvas();renderInspector();if(panel==='layers')renderLibrary();}
function addAsset(id,x=300,y=300){if(doc.elements.length>=200)return notify('Este parche ya tiene 200 elementos.');const asset=ASSETS.find(a=>a.id===id);if(!asset)return;commit(()=>{const el={id:uid(),type:'asset',assetId:id,x,y,size:130,rotation:0,colors:[...asset.colors],opacity:1,hidden:false,locked:false};doc.elements.push(el);selected=el.id;});}
function addText(text){if(doc.elements.length>=200)return notify('Este parche ya tiene 200 elementos.');commit(()=>{const el={id:uid(),type:'text',text,x:300,y:300,size:220,fontSize:14,fontFamily:'Arial',bold:true,rotation:0,colors:[doc.border,doc.accent,doc.background],opacity:1,hidden:false,locked:false};doc.elements.push(el);selected=el.id;});}
function removeElement(){const el=currentElement();if(el&&!el.locked)commit(()=>{doc.elements=doc.elements.filter(e=>e.id!==selected);selected=null;});else if(el)notify('Desbloquea el elemento para eliminarlo.');}
function duplicate(){const el=currentElement();if(!el)return;if(doc.elements.length>=200)return notify('Este parche ya tiene 200 elementos.');commit(()=>{const copy={...clone(el),id:uid(),x:Math.min(580,el.x+18),y:Math.min(580,el.y+18),locked:false};doc.elements.push(copy);selected=copy.id;});}
function reorder(delta){const index=doc.elements.findIndex(e=>e.id===selected);if(index<0)return;const target=Math.max(0,Math.min(doc.elements.length-1,index+delta));if(target!==index)commit(()=>{const [el]=doc.elements.splice(index,1);doc.elements.splice(target,0,el);});}
function applyTemplate(id){commit(()=>{doc=createDocument(id);selected=null;});notify('Plantilla lista. Hazla tuya. Puedes deshacer el cambio.');}
function setZoom(value){zoom=Math.max(50,Math.min(180,value));$('#zoom-label').textContent=`${zoom}%`;$('#stage').style.setProperty('--zoom',zoom/100);}

document.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b)return;
 if(b.dataset.panel){panel=b.dataset.panel;renderLibrary();return;}
 if(b.dataset.category){category=b.dataset.category;renderLibrary();return;}
 if(b.dataset.asset){addAsset(b.dataset.asset);return;}
 if(b.dataset.template){applyTemplate(b.dataset.template);return;}
 if(b.dataset.addText){addText(b.dataset.addText);return;}
 if(b.dataset.select){select(b.dataset.select);return;}
 if(b.dataset.toggleHidden){commit(()=>{const e=doc.elements.find(e=>e.id===b.dataset.toggleHidden);e.hidden=!e.hidden;});return;}
 if(b.dataset.toggleLock){commit(()=>{const e=doc.elements.find(e=>e.id===b.dataset.toggleLock);e.locked=!e.locked;});return;}
 if(b.dataset.shape){commit(()=>{doc.shape=b.dataset.shape;});return;}
 if(b.dataset.palette!==undefined){commit(()=>{const p=palettes[+b.dataset.palette];doc.background=p[0];doc.border=p[1];doc.titleColor=p[0];doc.accent=p[2];});return;}
 const actions={undo,redo,duplicate,delete:removeElement,forward:()=>reorder(1),backward:()=>reorder(-1),deselect:()=>select(null),center:()=>{const e=currentElement();if(e&&!e.locked)commit(()=>{e.x=300;e.y=300;});},profile:()=>{profile=!profile;renderCanvas();},'zoom-in':()=>setZoom(zoom+10),'zoom-out':()=>setZoom(zoom-10),fit:()=>setZoom(100),studio:()=>{$('#modal').close();},export:showExport,guide:showGuide,projects:showProjects,'save-project':saveNamed,upload:()=>$('#image-upload').click(),import:()=>$('#project-upload').click(),blank:()=>{commit(()=>{doc=createDocument('odyssey');doc.elements=[];doc.title='NUEVA MISIÓN';doc.subtitle='TU EQUIPO · 2026';doc.name='Mi nueva misión';selected=null;});},'close-modal':()=>$('#modal').close(),'download-project':()=>downloadProject(doc),'do-export':doExport};
 actions[b.dataset.action]?.();
});
document.addEventListener('input',event=>{if(event.target.id==='asset-search'){const start=event.target.selectionStart;search=event.target.value;renderLibrary();$('#asset-search').focus();$('#asset-search').setSelectionRange(start,start);}});
document.addEventListener('change',event=>{
 const t=event.target;
 if(t.id==='project-name'){commit(()=>{doc.name=t.value.trim()||'Mi misión espacial';},{full:false});t.value=doc.name;return;}
 if(t.dataset.docField){commit(()=>{doc[t.dataset.docField]=t.type==='checkbox'?t.checked:t.value;},{full:false});if(t.type==='color')t.parentElement.querySelector('small').textContent=t.value.toUpperCase();const preview=$('.profile-mini');if(preview)preview.innerHTML=renderPatch(doc);return;}
 if(t.dataset.elementColor!==undefined){const e=currentElement();if(e&&!e.locked){commit(()=>{e.colors[+t.dataset.elementColor]=t.value;},{full:false});t.parentElement.querySelector('small').textContent=t.value.toUpperCase();}else if(e){t.value=e.colors[+t.dataset.elementColor];notify('Desbloquea el elemento para editarlo.');}return;}
 if(t.dataset.elementField){const e=currentElement();if(!e)return;if(e.locked&&t.dataset.elementField!=='locked'){renderInspector();notify('Desbloquea el elemento para editarlo.');return;}const field=t.dataset.elementField;let value=t.type==='checkbox'?t.checked:['range','number'].includes(t.type)?Number(t.value):t.value;if(typeof value==='number'){if(!Number.isFinite(value)){renderInspector();return;}value=Math.max(Number(t.min||-Infinity),Math.min(Number(t.max||Infinity),value));}commit(()=>{e[field]=value;},{full:false});if(field==='locked')renderInspector();if(field==='text')$('.inspector-heading h2').textContent=elementName(e);if(t.type==='range'){const label=t.parentElement.querySelector('span');if(label)label.textContent=field==='size'?`${Math.round(value)} px`:field==='rotation'?`${Math.round(value)}°`:`${Math.round(value*100)}%`;}if(panel==='layers')renderLibrary();}
});
$('#library').addEventListener('dragstart',event=>{const card=event.target.closest('[data-asset]');if(!card)return;event.dataTransfer.setData('application/x-orbita-asset',card.dataset.asset);event.dataTransfer.effectAllowed='copy';});
const viewport=$('#stage-viewport');
viewport.addEventListener('dragover',event=>{if([...event.dataTransfer.types].includes('application/x-orbita-asset')){event.preventDefault();event.dataTransfer.dropEffect='copy';viewport.classList.add('drag-over');}});
viewport.addEventListener('dragleave',event=>{if(!viewport.contains(event.relatedTarget))viewport.classList.remove('drag-over');});
viewport.addEventListener('drop',event=>{event.preventDefault();viewport.classList.remove('drag-over');const p=point(event);addAsset(event.dataTransfer.getData('application/x-orbita-asset'),Math.max(0,Math.min(600,p.x)),Math.max(0,Math.min(600,p.y)));});
function point(event){const svg=$('#artwork svg');return new DOMPoint(event.clientX,event.clientY).matrixTransform(svg.getScreenCTM().inverse());}
$('#stage').addEventListener('pointerdown',event=>{
 if(event.button!==0||profile)return;
 const handle=event.target.closest('[data-handle]')?.dataset.handle;
 const target=event.target.closest('[data-element-id]');
 if(!handle){select(target?.dataset.elementId||null);}
 const el=currentElement();if(!el||el.locked)return;
 event.preventDefault();$('#stage').focus({preventScroll:true});
 const p=point(event);drag={type:handle||'move',id:el.id,start:p,x:el.x,y:el.y,size:el.size,rotation:el.rotation,angle:Math.atan2(p.y-el.y,p.x-el.x),distance:Math.hypot(p.x-el.x,p.y-el.y),before:clone(doc),moved:false};
 $('#stage').setPointerCapture(event.pointerId);
});
$('#stage').addEventListener('pointermove',event=>{
 if(!drag)return;const e=doc.elements.find(e=>e.id===drag.id),p=point(event);
 if(Math.hypot(p.x-drag.start.x,p.y-drag.start.y)<1&&!drag.moved)return;drag.moved=true;
 if(drag.type==='move'){e.x=Math.round(Math.max(0,Math.min(600,drag.x+p.x-drag.start.x)));e.y=Math.round(Math.max(0,Math.min(600,drag.y+p.y-drag.start.y)));}
 if(drag.type==='resize')e.size=Math.round(Math.max(20,Math.min(550,drag.size*Math.hypot(p.x-e.x,p.y-e.y)/Math.max(1,drag.distance))));
 if(drag.type==='rotate'){const a=drag.rotation+(Math.atan2(p.y-e.y,p.x-e.x)-drag.angle)*180/Math.PI;e.rotation=Math.round(((a+540)%360)-180);}
 renderCanvas();
});
function finishDrag(){if(!drag)return;if(drag.moved){remember(drag.before);save();renderInspector();updateHistoryButtons();}drag=null;}
$('#stage').addEventListener('pointerup',finishDrag);$('#stage').addEventListener('pointercancel',finishDrag);
document.addEventListener('keydown',event=>{
 if(event.target.matches('input,textarea,select')||$('#modal').open)return;
 const modifier=event.ctrlKey||event.metaKey;
 if(modifier&&event.key.toLowerCase()==='z'){event.preventDefault();event.shiftKey?redo():undo();}
 else if(modifier&&event.key.toLowerCase()==='y'){event.preventDefault();redo();}
 else if(modifier&&event.key.toLowerCase()==='d'){event.preventDefault();duplicate();}
 else if(modifier&&event.key.toLowerCase()==='s'){event.preventDefault();saveNamed();}
 else if(event.key==='Delete'||event.key==='Backspace'){event.preventDefault();removeElement();}
 else if(event.key==='Escape')select(null);
 else if(event.key==='/'){event.preventDefault();panel='elements';renderLibrary();$('#asset-search').focus();}
 else if(event.key.startsWith('Arrow')){const e=currentElement();if(!e||e.locked)return;event.preventDefault();const step=event.shiftKey?10:1;commit(()=>{e.x=Math.max(0,Math.min(600,e.x+({'ArrowLeft':-step,'ArrowRight':step}[event.key]||0)));e.y=Math.max(0,Math.min(600,e.y+({'ArrowUp':-step,'ArrowDown':step}[event.key]||0)));});}
});

function modal(content,wide=false){const m=$('#modal');m.className=wide?'wide-modal':'';m.innerHTML=`<button class="modal-close icon-button" data-action="close-modal" aria-label="Cerrar">${icon('close',21)}</button>${content}`;if(!m.open)m.showModal();}
$('#modal').addEventListener('click',event=>{if(event.target===$('#modal')){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close();}});
function showExport(){
 modal(`<div class="export-preview"><div class="export-preview-art">${renderPatch(doc)}</div><span>LA PRÓXIMA MISIÓN LLEVA TU NOMBRE.</span></div><div class="export-settings"><span class="eyebrow">PREPARADO PARA EL DESPEGUE</span><h2>Tu parche, al mundo.</h2><p>Para tu perfil, tu equipo o tu próxima gran idea.</p><label class="field-label">Formato<select id="export-format"><option value="png">PNG · imagen con transparencia</option><option value="svg">SVG · vector editable, máxima calidad</option><option value="jpg">JPG · imagen de fondo blanco</option><option value="webp">WebP · imagen ligera</option><option value="pdf">PDF · listo para imprimir</option></select></label><label class="field-label">Resolución<select id="export-size"><option value="512">512 × 512 px · perfil</option><option value="1024" selected>1024 × 1024 px · recomendado</option><option value="2048">2048 × 2048 px · alta resolución</option><option value="4096">4096 × 4096 px · máxima resolución</option></select></label><label class="toggle-row export-transparency"><span>Fondo transparente</span><input type="checkbox" id="export-transparent" checked></label><small id="export-note">Conserva el recorte y los colores de tu parche.</small><button class="primary full" id="do-export" data-action="do-export">${icon('download',18)} Descargar PNG</button><button class="text-button full" data-action="download-project">${icon('save',16)} Guardar proyecto editable (.json)</button><span class="export-local">${icon('lock',13)} Tus diseños se procesan en este dispositivo.</span></div>`,true);
 $('#export-format').addEventListener('change',()=>{const f=$('#export-format').value;$('#do-export').innerHTML=`${icon('download',18)} Descargar ${f.toUpperCase()}`;const opaque=['jpg','pdf'].includes(f);$('#export-transparent').disabled=opaque;$('#export-size').disabled=f==='svg';$('#export-note').textContent=f==='svg'?'Vector escalable: no depende de la resolución.':f==='pdf'?'PDF cuadrado con imagen rasterizada sobre blanco.':f==='jpg'?'JPG usa fondo blanco porque no admite transparencia.':'Conserva el recorte y los colores de tu parche.';});
}
async function doExport(){const b=$('#do-export');b.disabled=true;b.textContent='Preparando tu parche…';try{const format=$('#export-format').value;await exportPatch(doc,{format,size:Number($('#export-size').value),transparent:$('#export-transparent').checked});notify(`Tu parche ${format.toUpperCase()} está listo.`);$('#modal').close();}catch(error){notify('No se pudo exportar: '+error.message);b.disabled=false;b.textContent='Intentar de nuevo';}}
function readProjects(){try{return JSON.parse(localStorage.getItem('orbita-projects-v1')||'[]').filter(p=>p&&p.id&&p.doc);}catch{return [];}}
function saveNamed(){try{const projects=readProjects();const existing=projects.find(p=>p.doc.name===doc.name);if(existing){existing.doc=clone(doc);existing.updated=Date.now();}else projects.unshift({id:uid(),doc:clone(doc),updated:Date.now()});localStorage.setItem('orbita-projects-v1',JSON.stringify(projects));save();notify('Proyecto guardado en Mis parches.');}catch{notify('No hay espacio local. Descarga una copia editable.');downloadProject(doc);}}
function showProjects(){const projects=readProjects();modal(`<span class="eyebrow">TU BITÁCORA CREATIVA</span><h2>Mis parches</h2><p>Guardados en este navegador. Descarga el proyecto para llevarlo a otro dispositivo.</p><div class="saved-projects">${projects.length?projects.map(p=>{let d;try{d=validateDocument(p.doc);}catch{return '';}return `<article><button data-open-project="${esc(p.id)}"><div>${renderPatch(d)}</div><strong>${esc(d.name)}</strong><small>${new Date(p.updated).toLocaleDateString('es-MX')}</small></button><button class="tiny-button danger" data-remove-project="${esc(p.id)}" aria-label="Eliminar proyecto ${esc(d.name)}">${icon('trash',16)}</button></article>`;}).join(''):`<div class="empty-state">${icon('orbit',42)}<h3>Aquí comienza tu colección.</h3><p>Usa «Guardar proyecto» para conservar distintas misiones.</p></div>`}</div><div class="modal-actions"><button class="secondary" data-action="import">${icon('folder',17)} Abrir un archivo</button><button class="primary" data-action="save-project">${icon('save',16)} Guardar parche actual</button></div>`,true);
 $('#modal').querySelectorAll('[data-open-project]').forEach(b=>b.addEventListener('click',()=>{const p=readProjects().find(p=>p.id===b.dataset.openProject);try{const next=validateDocument(p.doc);commit(()=>{doc=next;selected=null;});$('#modal').close();}catch{notify('El archivo guardado no es válido.');}}));
 $('#modal').querySelectorAll('[data-remove-project]').forEach(b=>b.addEventListener('click',()=>{const old=readProjects(),p=old.find(p=>p.id===b.dataset.removeProject);try{localStorage.setItem('orbita-projects-v1',JSON.stringify(old.filter(x=>x.id!==p.id)));showProjects();notify('Eliminado de la colección. El lienzo actual se conserva.');}catch{notify('No se pudo actualizar la colección.');}}));
}
function showGuide(){modal(`<span class="eyebrow">PEQUEÑOS PASOS. GRANDES MISIONES.</span><h2>Tu primera insignia, en minutos.</h2><div class="guide-steps">${[['01','Elige tu punto de partida','Abre Plantillas o empieza con tu parche en blanco. Cambia la forma y escribe el nombre de la misión.'],['02','Construye tu universo','Arrastra ilustraciones al lienzo o pulsa para añadirlas. Muévelas, usa las esquinas para escalar y el punto superior para girar.'],['03','Hazlo único','Selecciona un elemento para cambiar sus colores, tamaño y posición. Organiza tu diseño desde Capas.'],['04','Lleva tu misión contigo','Comprueba la vista de perfil, descarga la imagen y úsala en tu red favorita. Guarda el proyecto .json para seguir editando.']].map(([n,t,p])=>`<div><span>${n}</span><section><h3>${t}</h3><p>${p}</p></section></div>`).join('')}</div><div class="shortcuts"><span><kbd>Ctrl Z</kbd> Deshacer</span><span><kbd>Ctrl ⇧ Z</kbd> Rehacer</span><span><kbd>Ctrl D</kbd> Duplicar</span><span><kbd>Supr</kbd> Eliminar</span><span><kbd>↑ ↓ ← →</kbd> Mover</span><span><kbd>⇧ + flechas</kbd> Mover 10 px</span></div><p class="panel-note">En Mac, usa ⌘ en lugar de Ctrl. Los diseños se guardan localmente en este navegador. Herramienta independiente para la comunidad NASA Space Apps Challenge.</p>`);}
$('#project-upload').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>20*1024*1024)throw new Error('El proyecto supera los 20 MB.');const next=validateDocument(JSON.parse(await file.text()));commit(()=>{doc=next;selected=null;});$('#modal').close();notify('Proyecto abierto. Continúa tu misión.');}catch(error){notify('No se pudo abrir: '+error.message);}event.target.value='';});
$('#image-upload').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>10*1024*1024)throw new Error('Usa PNG, JPG o WebP de hasta 10 MB.');if(doc.elements.length>=200)throw new Error('El parche ya tiene 200 elementos.');const image=await createImageBitmap(file);const c=document.createElement('canvas');const scale=Math.min(1,1024/Math.max(image.width,image.height));c.width=Math.round(image.width*scale);c.height=Math.round(image.height*scale);c.getContext('2d').drawImage(image,0,0,c.width,c.height);image.close();const src=c.toDataURL('image/png');if(src.length>4*1024*1024)throw new Error('La imagen es demasiado compleja. Prueba una más pequeña.');commit(()=>{const el={id:uid(),type:'image',src,x:300,y:300,size:180,rotation:0,colors:['#ffffff','#142b3c','#ed693b'],opacity:1,hidden:false,locked:false};doc.elements.push(el);selected=el.id;});notify('Imagen añadida a tu parche.');}catch(error){notify(error.message);}event.target.value='';});
renderAll();if(restoreError)notify('No se pudo recuperar la última sesión. Puedes abrir un proyecto guardado.');
