$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$RawDir = Join-Path $ProjectRoot "datasets\raw"
$ZipPath = Join-Path $RawDir "RDD2022_China_Drone.zip"
$Url = "https://bigdatacup.s3.ap-northeast-1.amazonaws.com/2022/CRDDC2022/RDD2022/Country_Specific_Data_CRDDC2022/RDD2022_China_Drone.zip"

New-Item -ItemType Directory -Force -Path $RawDir | Out-Null

Write-Host "Downloading/resuming RDD2022 sample to: $ZipPath"
Write-Host "This file is about 153 MB. If the network is slow, rerun this script; curl will resume."

curl.exe -L -C - --retry 10 --retry-delay 10 --connect-timeout 60 -o $ZipPath $Url

Write-Host "Download finished:"
Get-Item -LiteralPath $ZipPath | Select-Object FullName, Length, LastWriteTime
