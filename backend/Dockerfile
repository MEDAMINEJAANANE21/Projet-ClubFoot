# Étape 1 : compilation avec le JDK et Maven
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -B -q dependency:go-offline

COPY src src
RUN ./mvnw -B -q package -DskipTests

# Étape 2 : image d'exécution légère, sans les outils de compilation
FROM eclipse-temurin:25-jre
WORKDIR /app

RUN useradd --system --uid 1001 spring
COPY --from=build /app/target/clubfoot-api-*.jar app.jar
USER spring

EXPOSE 8095
ENTRYPOINT ["java", "-jar", "app.jar"]
