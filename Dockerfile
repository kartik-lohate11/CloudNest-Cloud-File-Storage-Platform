# ==============================================================================
# Stage 1: Build & Package the Spring Boot Application
# ==============================================================================
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Copy Maven descriptor and resolve dependencies for efficient layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy project source code
COPY src ./src

# Package the executable Spring Boot JAR skipping unit tests for speed
RUN mvn clean package -DskipTests -B

# ==============================================================================
# Stage 2: Production Runtime Environment
# ==============================================================================
FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

# Create a non-root system user and group for security
RUN addgroup -S cloudnest && adduser -S cloudnest -G cloudnest

# Copy compiled JAR artifact from builder stage
COPY --from=builder /build/target/CloudNest-*.jar app.jar

# Grant ownership to non-root user
RUN chown -R cloudnest:cloudnest /app

# Switch to non-root user
USER cloudnest:cloudnest

# Expose Spring Boot default web port
EXPOSE 8080

# Configure container-aware JVM memory options
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=50.0 -Djava.security.egd=file:/dev/./urandom"

# Launch the Spring Boot application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
