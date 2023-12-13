

# Ase Delivery: Revolutionizing the Way You Receive Your Desires
Say goodbye to long wait times and unsatisfactory deliveries. Ase Delivery is here to bring you the goods, right to your doorstep.

Visit us at: http://34.173.92.28:3000

To login as a dispatcher please use following credentials:
```
Email: ase-delivery@gmail.com
Password: 12345678
```

The email notifications are sent from the account `noreply.asedelivery@gmail.com` using the app passwords feature of Google accounts. Since 2-Step Verification needs to be enabled to activate the App passwords feature, you **won't** be able to log-in to this Google account during testing even with the password. However, e-mail notification service will work as intended both locally and on the Google Cloud instance of the web application. 

## **IMPORTANT!!!**

Unfortunately, due to the absence of HTTPS support, the camera function (getUserMedia()) cannot be utilized at this time. To use the camera functionality, you will need to modify your browser settings as follows:

    1. Open your Chrome browser and navigate to chrome://flags/#unsafely-treat-insecure-origin-as-secure
    2. Enable the "Insecure origins treated as secure" setting
    3. Add http://34.173.92.28:3000 to your browser's whitelist
By following these steps, you'll be able to access the QR reader and enjoy a seamless experience on our site.

## Unleash the Power of Ase Delivery
### Running Ase Delivery Locally
Bring the convenience of Ase Delivery to your fingertips by running our microservices on your own computer. Simply navigate to the root directory and run the following command **after creating the jars in target folder**:

```
cd ase-delivery
docker-compose up -d
```
In no time, you'll be able to access Ase Delivery at http://localhost:3000 and manage your deliveries like a pro! Keep an eye on the status of our services with the MongoDB UI at http://localhost:7676/dev/mongo/ and the Eureka status at http://localhost:8761/.

### Deploy to the Cloud
Take Ase Delivery to new heights by deploying our code to the cloud. Move each `docker-compose` file, `Dockerfile` file and respective `.jar` file (created with Maven) to your cloud instance. Put `.jar` files to folder named `target`. For `ui-service`, you just need to move `ui-service` to cloud instance. After these steps, run the following command:
```
docker-compose up -d
```
Don't forget to update the IP addresses in the `docker-compose` files if your cloud instance's IP address changes. Get ready to experience the speed and efficiency of Ase Delivery, now at a whole new level!
