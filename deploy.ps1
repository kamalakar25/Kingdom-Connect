# deploy.ps1
Write-Host "🚀 Starting Reliable Android Deployment..." -ForegroundColor Green

# 1. Build Web Assets
Write-Host "🏗️  Building Web App..." -ForegroundColor Cyan
Set-Location "apps/web"
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Web Build Failed"; exit 1 }

# 2. Sync Web Assets to Android
Write-Host "📦 Syncing Capacitor..." -ForegroundColor Cyan
npx cap sync android
if ($LASTEXITCODE -ne 0) { Write-Error "Capacitor Sync Failed"; exit 1 }

# 2. Build APK using Gradle directly (More stable than CLI)
Write-Host "🛠️  Building Android APK..." -ForegroundColor Cyan
Set-Location "android"
.\gradlew.bat assembleDebug
if ($LASTEXITCODE -ne 0) { Write-Error "Gradle Build Failed"; exit 1 }

# 3. Install APK manually via ADB
Write-Host "📲 Installing to Device/Emulator..." -ForegroundColor Cyan
$AdbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
& $AdbPath install -r "app\build\outputs\apk\debug\app-debug.apk"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment Complete! App should be on your device." -ForegroundColor Green
    
    # Optional: Try to launch app
    Write-Host "🚀 Launching App..." -ForegroundColor Cyan
    & $AdbPath shell monkey -p com.kingdomconnect.mobile -c android.intent.category.LAUNCHER 1
} else {
    Write-Error "Detailed Install Failed - Check if device is connected"
}
