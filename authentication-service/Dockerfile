FROM openjdk:17-jdk-slim
COPY target/authentication-service-0.0.1-SNAPSHOT.jar authentication-service-0.0.1-SNAPSHOT.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","/authentication-service-0.0.1-SNAPSHOT.jar"]