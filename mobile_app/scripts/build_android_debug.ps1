$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$androidRoot = Join-Path $projectRoot "android"
$gradleHome = "D:\gradle_roadsense"
$tmpDir = "D:\roadsense_tmp"
$javaHome = "C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot"
$androidHome = "D:\Android\Sdk"

if (-not (Test-Path -LiteralPath $javaHome)) {
  throw "JAVA_HOME not found: $javaHome"
}

if (-not (Test-Path -LiteralPath $androidHome)) {
  throw "ANDROID_HOME not found: $androidHome"
}

if (-not (Test-Path -LiteralPath (Join-Path $androidRoot "gradlew.bat"))) {
  throw "Android project not found. Run npm run prebuild:android first."
}

New-Item -ItemType Directory -Force -Path $gradleHome | Out-Null
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

$env:JAVA_HOME = $javaHome
$env:ANDROID_HOME = $androidHome
$env:ANDROID_SDK_ROOT = $androidHome
$env:GRADLE_USER_HOME = $gradleHome
$env:TEMP = $tmpDir
$env:TMP = $tmpDir

Set-Location -LiteralPath $androidRoot
.\gradlew.bat assembleDebug --no-daemon --max-workers=1
