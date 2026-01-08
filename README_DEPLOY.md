TÀI LIỆU QUY TRÌNH TRIỂN KHAI DỰ ÁN (DOCKERIZED)
1. Tổng quan hệ thống
Dự án được xây dựng theo kiến trúc Microservices đơn giản, đóng gói bằng Docker để đảm bảo tính nhất quán giữa môi trường Local và VPS.

Database: MySQL 8.0.

Backend: Java 21 (Spring Boot 3.x), Build tool: Maven.

Frontend: Next.js 16 (React 19), Build mode: Standalone.

2. Cấu trúc thư mục chuẩn
Để hệ thống vận hành, các file phải được sắp xếp theo cấu trúc "phẳng" như sau:

Plaintext

Tutor-Management/
├── docker-compose.yml       # File nhạc trưởng điều khiển toàn bộ hệ thống
├── backend/                 # Thư mục mã nguồn Backend
│   ├── Dockerfile           # Bản thiết kế build Java 21 & Maven
│   ├── pom.xml              # Cấu hình dependencies Java
│   └── src/                 # Mã nguồn Java
└── frontend/                # Thư mục mã nguồn Frontend
    ├── Dockerfile           # Bản thiết kế build Next.js Standalone
    ├── package.json         # Cấu hình dependencies Node.js
    ├── next.config.ts/.js   # Cấu hình Next.js (phải có output: 'standalone')
    └── src/ hoặc app/       # Mã nguồn React
3. Nội dung các file cấu hình quan trọng
A. Dockerfile cho Backend (Java 21)
Sử dụng Multi-stage build để tối ưu dung lượng:

Stage 1: Dùng maven:3.9.6-eclipse-temurin-21 để biên dịch code thành file .jar.

Stage 2: Dùng eclipse-temurin:21-jre-jammy (chỉ có môi trường chạy, không có bộ build) để chạy file .jar giúp image nhẹ và bảo mật.

Lệnh chạy: java -jar app.jar.

B. Dockerfile cho Frontend (Next.js 16)
Sử dụng chế độ Standalone:

Stage 1: Cài đặt dependencies (npm install).

Stage 2: Build production (npm run build).

Stage 3: Copy các file cần thiết từ .next/standalone và chạy bằng node server.js.

C. Docker Compose (Nhạc trưởng)
Quản lý 3 dịch vụ:

db: Mount volume db_data để giữ dữ liệu không bị mất khi tắt container.

backend: Kết nối tới db qua mạng nội bộ Docker. Tắt tính năng tạo data mẫu bằng biến môi trường APP_INIT-DATA_ENABLED: "false".

frontend: Mở port 3000 và kết nối tới Backend qua NEXT_PUBLIC_API_URL.

4. Quy trình vận hành & Bảo trì
Lệnh khởi động (Dùng khi sửa code/thêm thư viện)
PowerShell

docker compose up -d --build
up: Bật hệ thống.

-d: Chạy ngầm (Detached).

--build: Buộc Docker phải đóng gói lại code mới nhất.

Lệnh tạm dừng (Để giải phóng RAM)
PowerShell

docker compose down
(Dữ liệu trong Database vẫn an toàn nhờ cấu hình Volume).

5. Quy trình Go-Live (Lên VPS)
Khi muốn triển khai lên Internet, quy trình gồm 4 bước:

Chuẩn bị: Mua VPS (Ubuntu 22.04, tối thiểu 2GB RAM).

Môi trường: Cài Docker trên VPS bằng lệnh: curl -fsSL https://get.docker.com | sh.

Chuyển Code: Push lên GitHub (Private) -> Trên VPS dùng git clone.

Kích hoạt: Di chuyển vào thư mục dự án trên VPS và chạy docker compose up -d --build.

6. Lưu ý cho AI/Cộng sự sau này
Database: Luôn ưu tiên dùng dữ liệu thực được migrate từ Railway (import qua SQL file hoặc MySQL Workbench).

Cấu hình: Các thông số nhạy cảm (Password, Cloudinary Key) được quản lý trong mục environment của file docker-compose.yml.

Network: Các container liên lạc với nhau bằng tên dịch vụ (ví dụ backend gọi db qua jdbc:mysql://db:3306/...).

2. Các tình huống sử dụng thực tế (Workflows)
Code Backend: docker compose up -d db
Code Frontend: docker compose up -d db backend
Chỉ xem dữ liệu: docker compose up -d db
Test toàn bộ: docker compose up -d --build
Cách tắt một cái duy nhất: docker container stop <container_name>
Cách tắt toàn bộ: docker compose down