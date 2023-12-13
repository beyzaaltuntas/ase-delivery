FROM openjdk:17-jdk-slim
COPY target/api-gateway-0.0.1-SNAPSHOT.jar api-gateway-0.0.1-SNAPSHOT.jar
EXPOSE 10789
ENTRYPOINT ["java","-jar","/api-gateway-0.0.1-SNAPSHOT.jar"]