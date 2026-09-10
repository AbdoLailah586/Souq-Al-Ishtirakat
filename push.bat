@echo off
setlocal enabledelayedexpansion
title Push to GitHub - Souq Al-Ishtirakat
color 0b

cd /d "%~dp0"

echo ====================================================================
echo             PUSH TO GITHUB - SOUQ AL-ISHTIRAKAT
echo ====================================================================
echo Repository: https://github.com/AbdoLailah586/Souq-Al-Ishtirakat.git
echo.

:: Check Git installation
where git >nul 2>&1
if %errorlevel% neq 0 (
    color 0c
    echo [ERROR] Git is not installed or not in your PATH!
    echo Please install Git from: https://git-scm.com/
    echo.
    pause
    exit /b 1
)

:: Ensure git repository is initialized
if not exist ".git\" (
    echo [*] Initializing Git repository...
    git init
)

:: Set main branch and remote
git branch -M main >nul 2>&1
git remote remove origin >nul 2>&1
git remote add origin https://github.com/AbdoLailah586/Souq-Al-Ishtirakat.git

:: Stage and commit all files
echo [*] Staging all files and committing...
git add .
git commit -m "feat: Launch Souq Al-Ishtirakat - Full marketplace with catalog, wallet & admin" >nul 2>&1

echo.
echo ====================================================================
echo CHOOSE HOW YOU WANT TO PUSH:
echo ====================================================================
echo [1] Standard Push (Opens Browser / Git Credential Manager to sign in)
echo [2] Push using GitHub Personal Access Token (PAT) - (Fastest & Guaranteed)
echo [3] Login with GitHub CLI (gh auth login)
echo ====================================================================
set /p choice="Enter option number (1, 2, or 3) [Default is 1]: "

if "%choice%"=="2" goto USE_TOKEN
if "%choice%"=="3" goto USE_GH_CLI
goto STANDARD_PUSH

:STANDARD_PUSH
echo.
echo [*] Attempting git push to origin main...
echo (If a browser window pops up, click Authorize/Sign in)
echo.
git push -u origin main
if %errorlevel% equ 0 goto SUCCESS

echo.
echo [!] Direct push failed (usually due to GitHub password deprecation).
echo Would you like to push using a Personal Access Token (PAT) now?
set /p retry_token="Enter 'Y' for Token, or any key to exit: "
if /i "%retry_token%"=="Y" goto USE_TOKEN
goto FAILED

:USE_TOKEN
echo.
echo --------------------------------------------------------------------
echo How to get a GitHub Token in 30 seconds:
echo 1. Open: https://github.com/settings/tokens/new
echo 2. Give it any note (e.g., 'Souq'), check 'repo', and click 'Generate token'
echo 3. Copy the token (starts with ghp_...) and paste it below.
echo --------------------------------------------------------------------
set /p TOKEN="Paste your GitHub Token here: "
if "%TOKEN%"=="" (
    echo [ERROR] Token cannot be empty.
    goto FAILED
)

echo.
echo [*] Pushing with your token...
git push https://%TOKEN%@github.com/AbdoLailah586/Souq-Al-Ishtirakat.git main
if %errorlevel% equ 0 goto SUCCESS
goto FAILED

:USE_GH_CLI
echo.
echo [*] Launching GitHub CLI login...
gh auth login --web -h github.com
if %errorlevel% equ 0 (
    echo [*] Authenticated! Now pushing...
    git push -u origin main
    if %errorlevel% equ 0 goto SUCCESS
)
goto FAILED

:SUCCESS
color 0a
echo.
echo ====================================================================
echo   SUCCESS! The project has been pushed to GitHub!
echo   View repository:
echo   https://github.com/AbdoLailah586/Souq-Al-Ishtirakat
echo ====================================================================
echo.
pause
exit /b 0

:FAILED
color 0c
echo.
echo ====================================================================
echo   [FAILED] Push could not be completed.
echo   Check your credentials or repository permissions and try again.
echo ====================================================================
echo.
pause
exit /b 1
