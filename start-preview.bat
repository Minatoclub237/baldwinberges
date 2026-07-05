@echo off
REM ============================================================
REM  Baldwin Berges - serveur de preview auto-resilient
REM  Double-clique ce fichier pour lancer l'apercu.
REM  URL stable : http://localhost:4321/
REM  Si le serveur plante, il redemarre tout seul.
REM  Ferme cette fenetre pour arreter le serveur.
REM ============================================================
title Baldwin Berges - Preview (http://localhost:4321)
cd /d "%~dp0"

:loop
REM -- Libere le port 4321 s'il est occupe par un process zombie --
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :4321 ^| findstr LISTENING') do taskkill /f /pid %%p >nul 2>&1

echo.
echo [preview] Demarrage sur http://localhost:4321/  (%date% %time%)
echo.
call npm run dev

echo.
echo [preview] Le serveur s'est arrete (code %errorlevel%). Redemarrage dans 2s...
timeout /t 2 /nobreak >nul
goto loop
