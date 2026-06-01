# Stage 1: Build Backend (Java 21)
FROM maven:3.9.6-eclipse-temurin-21 AS backend-build
WORKDIR /app
COPY dms/pom.xml .
COPY dms/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Build Frontend (Angular + Node 22)
FROM node:22 AS frontend-build
WORKDIR /app
COPY dms-frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY dms-frontend/ ./
RUN npm run build -- --configuration=production

# Stage 3: Final Production Image
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
# We copy the frontend dist into a folder the backend can serve (optional)
COPY --from=frontend-build /app/dist/dms-frontend/browser ./static

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
