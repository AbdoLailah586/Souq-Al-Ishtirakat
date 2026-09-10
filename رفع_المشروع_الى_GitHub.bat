@echo off
chcp 65001 > nul
title رفع مشروع سوق الاشتراكات إلى GitHub
echo ========================================================
echo   🚀 سكريبت رفع مشروع سوق الاشتراكات إلى GitHub 🚀
echo ========================================================
echo المستودع: https://github.com/AbdoLailah586/Souq-Al-Ishtirakat.git
echo.

cd /d "%~dp0"

:: 1. التحقق من وجود Git
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [خطأ] برنامج Git غير مثبت على جهازك أو غير مضاف للـ PATH!
    echo يرجى تثبيت Git من https://git-scm.com ثم إعادة المحاولة.
    pause
    exit /b 1
)

:: 2. تهيئة مستودع Git إذا لم يكن موجوداً
if not exist ".git\" (
    echo [1/5] جاري تهيئة مستودع Git محلي...
    git init
) else (
    echo [1/5] مستودع Git مهيأ بالفعل.
)

:: 3. ضبط الفرع الرئيسي إلى main
echo [2/5] ضبط الفرع الرئيسي (main)...
git branch -M main

:: 4. ربط الـ Remote Origin
echo [3/5] ضبط رابط مستودع GitHub...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/AbdoLailah586/Souq-Al-Ishtirakat.git

:: 5. إضافة الملفات وكتابة الـ Commit
echo [4/5] إضافة ملفات المشروع وعمل Commit...
git add .
git commit -m "feat: Launch Souq Al-Ishtirakat - Full digital subscription marketplace with wallet engine, catalog & admin portal"

echo.
echo [5/5] جاري الرفع (Push) إلى GitHub...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ⚠️ إذا كان المستودع على GitHub يحتوي على ملفات أولية (مثل README أو LICENSE)،
    echo سيتم محاولة دمجها والمحاولة مرة أخرى...
    echo.
    git pull origin main --rebase --allow-unrelated-histories
    git push -u origin main
)

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   ✅ تم رفع المشروع إلى GitHub بنجاح تام! 🎉
    echo   رابط المستودع:
    echo   https://github.com/AbdoLailah586/Souq-Al-Ishtirakat
    echo ========================================================
) else (
    echo.
    echo ❌ حدث خطأ أثناء الرفع. تأكد من تسجيل دخولك إلى GitHub أو صلاحيات الوصول.
)

echo.
pause
