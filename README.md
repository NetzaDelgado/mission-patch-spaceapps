# Órbita · Mission Patch Studio

Elaborado por **Netzahualpilli Delgado Figueroa**, **Local Lead NASA SPACE APPS CHALLENGE 2026**.

Editor visual en español para crear parches de misión y usarlos como imágenes de perfil. Incluye ilustraciones espaciales originales, plantillas, arrastrar y soltar, personalización y descargas. Es una herramienta independiente para la comunidad NASA Space Apps Challenge, sin afiliación oficial con NASA.

## Abrir el programa

Necesitas Node.js 18 o posterior. No hay paquetes externos que instalar.

En Windows puedes abrir **INICIAR.cmd** con doble clic. También puedes ejecutar desde esta carpeta:

```powershell
node server.mjs
```

Abre **http://127.0.0.1:4175** en tu navegador. También puedes usar **http://localhost:4175**; conserva siempre la misma dirección para acceder a tus proyectos guardados. El programa funciona sin conexión a internet cuando lo ejecutas con este servidor local. Para detenerlo, presiona `Ctrl+C` en la terminal.

No abras `dist/index.html` directamente con doble clic: los módulos JavaScript necesitan el servidor HTTP.

## Crear tu parche

1. Abre **Plantillas** y elige una de las nueve composiciones prediseñadas o un lienzo en blanco.
2. Personaliza el nombre de la misión, el lema, los colores y la forma del parche: círculo, escudo, hexágono o cuadrado.
3. Arrastra ilustraciones de **Elementos** al lienzo, o pulsa una para añadirla al centro. Busca por nombre o filtra por categoría.
4. Selecciona un elemento para moverlo, cambiar sus tres colores, tamaño, rotación y opacidad. Usa las esquinas de selección para escalar y el control superior para girar.
5. Añade textos desde **Texto** y fotografías o logotipos desde **Subir**. Las imágenes se incorporan al proyecto.
6. Organiza el orden, la visibilidad y el bloqueo de los elementos desde **Capas**. Puedes duplicar, centrar o eliminar la selección.
7. Comprueba la **Vista de perfil**, descarga la imagen y súbela como avatar en tu plataforma preferida.

La biblioteca contiene **500 ilustraciones vectoriales originales** en seis categorías: Naves, Planetas, Exploración, Órbitas, Símbolos y Naturaleza. Explora por categoría, busca por nombre o palabra clave y pulsa **Mostrar más elementos** para recorrer la biblioteca sin cargar los 500 dibujos a la vez. Incluye **12 paletas** (clásica, nocturna, alto contraste, cromo, océano, solar, desierto, bosque, violeta, hielo, neón y monocromática); al aplicar una, también se recolorean las ilustraciones y textos editables. Cada proyecto admite hasta 200 elementos.

## Descargar y continuar después

| Formato | Uso |
| --- | --- |
| PNG | Imagen con transparencia, adecuada para perfiles y composiciones. |
| SVG | Archivo vectorial escalable con formas y textos editables en programas compatibles. Las fotografías permanecen rasterizadas. |
| JPG | Imagen con fondo blanco. |
| WebP | Imagen ligera con transparencia cuando el navegador admite este formato. |
| PDF | Página cuadrada con una imagen rasterizada sobre fondo blanco. No es un PDF vectorial. |
| Proyecto `.mission.json` | Conserva los elementos, propiedades e imágenes para reabrir el diseño en Órbita. |

Las descargas rasterizadas ofrecen 512, 1024, 2048 y 4096 píxeles por lado. El SVG conserva un lienzo vectorial de 600 × 600 unidades y puede escalarse sin perder calidad en sus ilustraciones.

El lienzo actual se guarda automáticamente en el almacenamiento de este navegador. **Guardar proyecto** añade una copia a **Mis parches**; guardar de nuevo con el mismo nombre actualiza esa copia. Usa nombres distintos para conservar variantes.

Para llevar un diseño a otro equipo, descarga el proyecto `.mission.json` y ábrelo desde **Subir → Abrir proyecto** o **Mis parches → Abrir un archivo**. Los datos se almacenan localmente: no se sincronizan entre navegadores o dispositivos. Si borras los datos del navegador, también se borran los proyectos guardados allí.

Se aceptan imágenes PNG, JPEG y WebP de hasta 10 MB. El editor las reduce a un máximo de 1024 píxeles por lado antes de incorporarlas; si el resultado integrado supera el límite de almacenamiento de una imagen, solicita un archivo más pequeño.

## Atajos

| Tecla | Acción |
| --- | --- |
| `Ctrl+Z` | Deshacer |
| `Ctrl+Shift+Z` o `Ctrl+Y` | Rehacer |
| `Ctrl+D` | Duplicar la selección |
| `Ctrl+S` | Guardar en Mis parches |
| `Supr` | Eliminar la selección |
| Flechas | Mover un píxel |
| `Shift` + flechas | Mover diez píxeles |
| `Esc` | Deseleccionar |
| `/` | Buscar en la biblioteca |

En macOS, usa `⌘` en lugar de `Ctrl`. Los atajos del editor no interceptan la escritura dentro de los campos de texto.

## Estructura y verificación

```text
dist/
  index.html     Documento principal
  styles.css     Estilos y adaptación de la interfaz
  app.js         Editor, interacción y almacenamiento local
  assets.js      Biblioteca de 500 ilustraciones SVG originales
  palettes.js    12 paletas de color
  palette.css    Estilos de la selección de paletas
  model.js       Plantillas, validación y renderizado de parches
  export.js      Descargas de imágenes, SVG, PDF y proyectos
  favicon.svg    Icono del programa
tests/           Pruebas del modelo y de exportación
server.mjs       Servidor HTTP local
package.json     Comandos del proyecto, sin dependencias externas
```

```powershell
npm run check
npm test
```

La carpeta `dist` es autónoma y puede servirse desde un alojamiento de archivos estáticos. El procesamiento de imágenes y las descargas ocurren en el navegador; no se necesita un servidor de datos, una cuenta ni servicios de terceros.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube **el contenido de esta carpeta** a la raíz del repositorio (incluida la carpeta `.github`).
2. En **Settings → Pages**, selecciona **GitHub Actions** como origen de publicación.
3. Envía los cambios a la rama `main` o ejecuta manualmente **Actions → Deploy Mission Patch Studio to GitHub Pages → Run workflow**.
4. Cuando termine la acción, abre la URL publicada que aparece en el resumen del despliegue.

El flujo `.github/workflows/pages.yml` ejecuta las pruebas y la verificación de sintaxis antes de publicar directamente la carpeta `dist`; no requiere dependencias externas ni compilación. Las rutas de módulos y estilos son relativas, por lo que también funcionan en la URL de proyecto bajo `https://<usuario>.github.io/<repositorio>/`. Los proyectos guardados siguen siendo locales al navegador y no se sincronizan con GitHub.
