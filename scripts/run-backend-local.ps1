$backendDir = Join-Path $PSScriptRoot "..\backend"
Set-Location $backendDir

# ---------------------------------------------------------------------------
# Tìm JDK 21 HOẠT ĐỘNG thay vì hardcode bản đã bị hỏng trong .jdks
# Ưu tiên: JAVA_HOME (nếu chạy được) -> Temurin Program Files -> các bản trong .jdks
# ---------------------------------------------------------------------------

function Test-JavaHome {
    param([Parameter(Mandatory)][string]$Path)
    if (-not (Test-Path (Join-Path $Path "bin\java.exe") -PathType Leaf)) { return $false }
    $javaExe = Join-Path $Path "bin\java.exe"
    try {
        $out = & $javaExe -version 2>&1
        if ($LASTEXITCODE -ne 0) { return $false }
        # Xác nhận ít nhất là Java 17+ (bản build Spring Boot 3.x yêu cầu)
        if ("$out" -match 'version "(\d+)') {
            $ver = [int]$Matches[1]
            return ($ver -ge 17)
        }
        return $true
    } catch {
        return $false
    }
}

$candidates = @()

# 1) JAVA_HOME hiện có của hệ thống
if ($env:JAVA_HOME) { $candidates += $env:JAVA_HOME }

# 2) Temurin phổ biến trong Program Files / Program Files (x86)
$candidates += Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "jdk-21*" } | Select-Object -ExpandProperty FullName
$candidates += Get-ChildItem "C:\Program Files\Eclipse Adoptium" -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "jdk-17*" } | Select-Object -ExpandProperty FullName
$candidates += Get-ChildItem "C:\Program Files (x86)\Eclipse Adoptium" -Directory -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName

# 3) Các bản Microsoft JDK trong .jdks (theo thứ tự phiên bản cao -> thấp)
$jdksRoot = "C:\Users\$env:USERNAME\.jdks"
if (Test-Path $jdksRoot) {
    $candidates += Get-ChildItem $jdksRoot -Directory -ErrorAction SilentlyContinue `
        | Where-Object { $_.Name -notlike ".*" -and ($_.Name -like "ms-21*" -or $_.Name -like "ms-17*") } `
        | Sort-Object Name -Descending `
        | Select-Object -ExpandProperty FullName
}

$chosen = $null
foreach ($c in ($candidates | Where-Object { $_ })) {
    if (Test-JavaHome -Path $c) {
        $chosen = $c
        break
    }
}

if (-not $chosen) {
    Write-Host "[ERROR] Không tìm thấy JDK 17+ HOẠT ĐỘNG trên máy." -ForegroundColor Red
    Write-Host "  Các đường dẫn đã kiểm tra:" -ForegroundColor DarkRed
    $candidates | Select-Object -Unique | ForEach-Object { Write-Host "   - $_" -ForegroundColor DarkRed }
    Write-Host "  Cài đặt JDK 21 (Temurin) từ https://adoptium.net/  hoặc  chạy  winget install EclipseAdoptium.Temurin.21.JDK" -ForegroundColor Yellow
    exit 1
}

$env:JAVA_HOME = $chosen
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path

Write-Host "[INFO] Using JAVA_HOME = $env:JAVA_HOME" -ForegroundColor Cyan
Write-Host "[INFO] Starting Tutor Pro Backend with Local H2 Database (File-based)..." -ForegroundColor Cyan
Write-Host "[INFO] Database path: backend/data/tutor_pro_db.mv.db" -ForegroundColor Green
Write-Host "[INFO] H2 Console: http://localhost:8080/h2-console" -ForegroundColor Yellow
Write-Host "---------------------------------------------------------"

& .\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
