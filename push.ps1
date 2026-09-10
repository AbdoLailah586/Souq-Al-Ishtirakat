# Push to GitHub PowerShell Script
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "          Pushing Souq Al-Ishtirakat to GitHub" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Repository: https://github.com/AbdoLailah586/Souq-Al-Ishtirakat.git`n"

$repoDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoDir

# 1. Check Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Git is not installed or not in your PATH!" -ForegroundColor Red
    Pause
    Exit
}

# 2. Setup branch and remote
git branch -M main
git remote remove origin 2>$null
git remote add origin https://github.com/AbdoLailah586/Souq-Al-Ishtirakat.git

# 3. Add and Commit
git add .
git commit -m "feat: Launch Souq Al-Ishtirakat digital marketplace" 2>$null

Write-Host "Choose authentication method:" -ForegroundColor Green
Write-Host "[1] Standard push (Browser / Credential Manager)"
Write-Host "[2] Personal Access Token (PAT) - Fastest & Most Reliable"
Write-Host "[3] GitHub CLI (gh auth login)"
$choice = Read-Host "Select option (1, 2, or 3) [Default 1]"

if ($choice -eq "2") {
    Write-Host "`nGenerate token here: https://github.com/settings/tokens/new (check 'repo')" -ForegroundColor Yellow
    $token = Read-Host "Paste your GitHub token (ghp_...)"
    if ($token) {
        git push "https://$($token)@github.com/AbdoLailah586/Souq-Al-Ishtirakat.git" main
    }
} elseif ($choice -eq "3") {
    gh auth login --web -h github.com
    git push -u origin main
} else {
    git push -u origin main
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] Project pushed successfully to https://github.com/AbdoLailah586/Souq-Al-Ishtirakat" -ForegroundColor Green
} else {
    Write-Host "`n[NOTICE] If push was rejected, check your GitHub Token or run with option 2." -ForegroundColor Yellow
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
