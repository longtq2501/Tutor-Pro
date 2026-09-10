@echo off
setlocal
cd /d "%~dp0\..\backend"

if exist "C:\Users\%USERNAME%\.jdks\ms-21.0.11" (
    set "JAVA_HOME=C:\Users\%USERNAME%\.jdks\ms-21.0.11"
    set "PATH=C:\Users\%USERNAME%\.jdks\ms-21.0.11\bin;%PATH%"
)

echo =========================================================
echo  Starting Tutor Pro Backend with Local H2 (File-based)
echo  Database: backend\data\tutor_pro_db.mv.db
echo  H2 Console: http://localhost:8080/h2-console
echo =========================================================

mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
pause
