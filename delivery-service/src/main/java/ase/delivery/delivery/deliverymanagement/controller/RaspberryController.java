package ase.delivery.delivery.deliverymanagement.controller;

import ase.delivery.delivery.deliverymanagement.DeliveryManagementApplication;
import ase.delivery.delivery.deliverymanagement.mail.MailService;
import ase.delivery.delivery.deliverymanagement.mail.StatusChangeMailRequest;
import ase.delivery.delivery.deliverymanagement.model.*;
import ase.delivery.delivery.deliverymanagement.service.DeliveryService;
import ase.delivery.delivery.deliverymanagement.service.PickupBoxService;
import com.netflix.discovery.EurekaClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/raspberry")
public class RaspberryController {
    @Autowired
    PickupBoxService pickupBoxService;

    @Autowired
    DeliveryService deliveryService;
    @Autowired
    EurekaClient discoveryClient;

    @Autowired
    MailService mailService;

    @PatchMapping("/{raspberryId}/rfid/{rfidToken}")
    public ResponseEntity<?> rfidVerification(@PathVariable String raspberryId, @PathVariable String rfidToken) {
        PickupBox pickupBox = pickupBoxService.findByRaspberryId(raspberryId);
        AseUserDto user = getUserFromRfidToken(rfidToken);
        if(pickupBox==null || user == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        List<Delivery> deliveryList = null;
        String email = null;
        if (user.getUserRole() == UserRole.DELIVERER) {
            deliveryList = deliveryService.getDeliveriesOnDelivererForPickupBox(user.getId(), pickupBox.getId());
        } else if(user.getUserRole() == UserRole.CUSTOMER) {
            deliveryList = deliveryService.getDeliveriesInPickupBoxForCustomer(user.getId(), pickupBox.getId());
        }
        if (deliveryList == null || deliveryList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if(user.getUserRole()== UserRole.DELIVERER) {
            email = getUserFromId(deliveryList.get(0).getCustomerId()).getEmail();
        } else if (user.getUserRole()== UserRole.CUSTOMER){
            email = user.getEmail();
        }
            pickupBox.setStatus(PickupBox.PickupBoxStatus.OPEN);
            updateDeliveryListStatus(deliveryList,email);
            pickupBoxService.createPickupBox(pickupBox);
            return new ResponseEntity<>(HttpStatus.OK);

    }
    @PatchMapping("/{raspberryId}/closed-verification")
    public ResponseEntity<?> verifyPickupBoxClosed(@PathVariable String raspberryId) {
        PickupBox pickupBox = pickupBoxService.findByRaspberryId(raspberryId);
        if(pickupBox == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        pickupBox.setStatus(PickupBox.PickupBoxStatus.CLOSED);
        pickupBoxService.createPickupBox(pickupBox);
        return new ResponseEntity<>(HttpStatus.OK);
    }


        private void updateDeliveryListStatus (List<Delivery> deliveryList, String email) {
            StatusChangeMailRequest statusChangeMailRequest;
            Date date = new Date();
        for (Delivery delivery : deliveryList) {
            if(delivery.getStatus()== DeliveryStatus.IN_DELIVERY) {
                statusChangeMailRequest = new StatusChangeMailRequest(DeliveryStatus.IN_PICKUPBOX,delivery.getTrackingCode());
                mailService.sendEmailTo(email, statusChangeMailRequest);
                delivery.setStatus(DeliveryStatus.IN_PICKUPBOX);
                delivery.setDepositedAt(date);
            } else if (delivery.getStatus()==DeliveryStatus.IN_PICKUPBOX) {
                statusChangeMailRequest = new StatusChangeMailRequest(DeliveryStatus.DELIVERED,delivery.getTrackingCode());
                mailService.sendEmailTo(email, statusChangeMailRequest);
                delivery.setStatus(DeliveryStatus.DELIVERED);
                delivery.setActive(false);
                delivery.setCollectedAt(date);

            }
            deliveryService.createDelivery(delivery);
        }
    }
    private AseUserDto getUserFromRfidToken (String rfidToken) {
        if(rfidToken==null) {
            return null;
        }
        AseUserDto userData;
        try {
            String url = discoveryClient.getNextServerFromEureka("AUTHENTICATION-SERVICE", false).getHomePageUrl();
            System.out.println(url);
            userData = DeliveryManagementApplication.getRestTemplate().getForEntity(url + "api/authentication-service/user/rfid/" + rfidToken, AseUserDto.class).getBody();
            return userData;
        } catch (Exception e) {
            return null;
        }

    }
    private AseUserDto getUserFromId (String id) {
        if(id==null) {
            return null;
        }
        AseUserDto userData;
        try {
            String url = discoveryClient.getNextServerFromEureka("AUTHENTICATION-SERVICE", false).getHomePageUrl();
            System.out.println(url);
            userData = DeliveryManagementApplication.getRestTemplate().getForEntity(url + "api/authentication-service/user/id/" + id, AseUserDto.class).getBody();
            return userData;
        } catch (Exception e) {
            return null;
        }

    }

}
