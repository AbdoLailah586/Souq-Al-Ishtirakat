@echo off
title Pushing to GitHub...
cls
echo ========================================================
echo   Pushing Souq Al-Ishtirakat to GitHub
echo ========================================================
echo Repository: https://github.com/AbdoLailah586/Souq-Al-Ishtirakat.git
echo.

git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in PATH.
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo [1/4] Setting branch to main...
git branch -M main

echo [2/4] Configuring remote origin...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/AbdoLailah586/Souq-Al-Ishtirakat.git

echo [3/4] Staging and committing all project files...
git add .
git commit -m "feat: Launch Souq Al-Ishtirakat digital marketplace" >nul 2>&1

echo [4/4] Pushing to GitHub...
echo If prompted, please sign in or authorize in your browser.
echo.
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [NOTE] Retrying with pull rebase in case repository was initialized with files...
    git pull origin main --rebase --allow-unrelated-histories
    git push -u origin main
)

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! Project successfully pushed to GitHub!
    echo   View repository:
    echo   https://github.com/AbdoLailah586/Souq-Al-Ishtirakat
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   [NOTICE] If GitHub requires login, run this command:
    echo   gh auth login
    echo   or generate a GitHub Personal Access Token.
    echo ========================================================
)

echo.
pause
