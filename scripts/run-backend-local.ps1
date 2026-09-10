$backendDir = Join-Path $PSScriptRoot "..\backend"
Set-Location $backendDir

if (Test-Path "C:\Users\$env:USERNAME\.jdks\ms-21.0.11") {
    $env:JAVA_HOME = "C:\Users\$env:USERNAME\.jdks\ms-21.0.11"
    $env:Path = "$env:JAVA_HOME\bin;" + $env:Path
}

Write-Host "[INFO] Starting Tutor Pro Backend with Local H2 Database (File-based)..." -ForegroundColor Cyan
Write-Host "[INFO] Database path: backend/data/tutor_pro_db.mv.db" -ForegroundColor Green
Write-Host "[INFO] H2 Console: http://localhost:8080/h2-console" -ForegroundColor Yellow
Write-Host "---------------------------------------------------------"

& .\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
