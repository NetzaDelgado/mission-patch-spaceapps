@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Necesitas Node.js para ejecutar la version local.
  echo Instala Node.js desde https://nodejs.org y abre este archivo de nuevo.
  pause
  exit /b 1
)
echo Abre http://127.0.0.1:4175 en tu navegador.
echo Para detener el editor, cierra esta ventana o pulsa Ctrl+C.
node server.mjs
