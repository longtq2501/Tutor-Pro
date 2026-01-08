# Stage 1: Build với Maven và Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml và tải dependencies trước để cache (tăng tốc build lần sau)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy toàn bộ source và build
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Chạy ứng dụng với Java 21
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Lưu ý: artifactId trong pom.xml là 'backend', nên file sẽ là backend-0.0.1-SNAPSHOT.jar
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]