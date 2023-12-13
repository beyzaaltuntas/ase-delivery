FROM openjdk:17-jdk-slim
COPY target/delivery-service-0.0.1-SNAPSHOT.jar delivery-service-0.0.1-SNAPSHOT.jar
EXPOSE 8080
EXPOSE 587
ENTRYPOINT ["java","-jar","/delivery-service-0.0.1-SNAPSHOT.jar"]