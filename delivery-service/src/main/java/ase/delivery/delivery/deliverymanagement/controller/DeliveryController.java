package ase.delivery.delivery.deliverymanagement.controller;

import ase.delivery.delivery.deliverymanagement.DeliveryManagementApplication;
import ase.delivery.delivery.deliverymanagement.mail.MailService;
import ase.delivery.delivery.deliverymanagement.mail.StatusChangeMailRequest;
import ase.delivery.delivery.deliverymanagement.model.*;
import ase.delivery.delivery.deliverymanagement.service.DeletedDeliveryService;
import ase.delivery.delivery.deliverymanagement.service.DeliveryService;
import ase.delivery.delivery.deliverymanagement.service.PickupBoxService;
import com.netflix.discovery.EurekaClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/delivery")
public class DeliveryController{

    @Autowired
    DeliveryService deliveryService;

    @Autowired
    PickupBoxService pickupBoxService;

    @Autowired
    DeletedDeliveryService deletedDeliveryService;

    @Autowired
    MailService mailService;

    @Autowired
    private EurekaClient discoveryClient;

    @Bean
    RestTemplate restTemplate() {
        return new RestTemplate();
    }



    @GetMapping("")
    public ResponseEntity<?> getAllDeliveries(@RequestHeader(value = "Authorization", required = false) String bearerToken) {
        try {
            authenticateUser(bearerToken,UserRole.DISPATCHER);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        List<DeliveryDetails> deliveryDetailsList = new ArrayList<>();
        List<Delivery> deliveryList = deliveryService.getAllDeliveries();
        for (int i = 0; i < deliveryList.size(); i++) {
            deliveryDetailsList.add(getDeliveryDetails(deliveryList.get(i)));
        }
        return ResponseEntity.ok(deliveryDetailsList);
    }

    @GetMapping("/deleted-deliveries")
    public ResponseEntity getAllDeletedDeliveries(@RequestHeader(value = "Authorization", required = false) String bearerToken) {
        try {
            authenticateUser(bearerToken,UserRole.DISPATCHER);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(deletedDeliveryService.getAllDeletedDeliveries());
    }



    @GetMapping("/active-deliveries")
    public ResponseEntity getAllActiveDeliveriesOfCustomer(@RequestHeader(value = "Authorization", required = false) String bearerToken) {
        AseUserDto user;
        try {
            user= authenticateUser(bearerToken,UserRole.CUSTOMER);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        String customerId = user.getId();
        List<DeliveryDetails> deliveryDetailsList = new ArrayList<>();
        List<Delivery> deliveryList = deliveryService.getActiveDeliveriesByCustomerId(customerId);
        for (int i = 0; i < deliveryList.size(); i++) {
            deliveryDetailsList.add(getDeliveryDetails(deliveryList.get(i)));
        }
        return ResponseEntity.ok(deliveryDetailsList);
    }

    @GetMapping("/past-deliveries")
    public ResponseEntity getAllPastDeliveriesOfCustomer(@RequestHeader(value = "Authorization", required = false) String bearerToken) {
        AseUserDto user;
        try {
            user= authenticateUser(bearerToken,UserRole.CUSTOMER);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        String customerId = user.getId();
        List<DeliveryDetails> deliveryDetailsList = new ArrayList<>();
        List<Delivery> deliveryList = deliveryService.getPastDeliveriesByCustomerId(customerId);
        for (int i = 0; i < deliveryList.size(); i++) {
            deliveryDetailsList.add(getDeliveryDetails(deliveryList.get(i)));
        }
        return ResponseEntity.ok(deliveryDetailsList);
    }

    @GetMapping("/assigned-deliveries/{pickupBoxId}")
    public ResponseEntity getAllAssignedDeliveriesOfDelivererInPickupBox(@RequestHeader(value = "Authorization", required = false) String bearerToken,@PathVariable String pickupBoxId) {
        AseUserDto user;
        try {
            user= authenticateUser(bearerToken,UserRole.DELIVERER);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        String delivererId = user.getId();
        return ResponseEntity.ok(deliveryService.getActiveDeliveriesByDelivererIdAndPickupBoxId(delivererId,pickupBoxId));
    }

    @PatchMapping("/qr-verification/{deliveryId}")
    public ResponseEntity<?> verifyDeliveryQR(@RequestHeader(value = "Authorization", required = false) String bearerToken,@PathVariable String deliveryId) {
        AseUserDto user;
        try {
            user= authenticateUser(bearerToken,UserRole.DELIVERER);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        String delivererId = user.getId();
        Delivery delivery = deliveryService.findById(deliveryId);
        if (delivery == null) {
            return ResponseEntity.badRequest().body("QR code does not belong to any delivery!");
        }
        if(delivery.getDelivererId().equals(delivererId)) {
            if(delivery.getStatus() == DeliveryStatus.IN_WAREHOUSE) {
                try {
                    delivery.setStatus(DeliveryStatus.IN_DELIVERY);
                    delivery.setPickedUpAt(new Date());
                    StatusChangeMailRequest statusChangeMailRequest = new StatusChangeMailRequest(DeliveryStatus.IN_DELIVERY, delivery.getTrackingCode());
                    mailService.sendEmailTo(user.getEmail(), statusChangeMailRequest);
                    return ResponseEntity.ok(deliveryService.createDelivery(delivery));
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body(e.getMessage());
                }
            } else {
                return ResponseEntity.badRequest().body("Delivery is already picked up!");
            }
        } else {
            return ResponseEntity.badRequest().body("Delivery is not assigned to this deliverer!");
        }
    }
    @GetMapping("/tracking-code/{trackingCode}")
    public ResponseEntity<?> getDeliveryByTrackingCode(@RequestHeader(value = "Authorization", required = false) String bearerToken,@PathVariable String trackingCode) {
        AseUserDto user;
        try {
            user= authenticateUser(bearerToken,UserRole.CUSTOMER);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        String customerId = user.getId();
        Delivery delivery = deliveryService.findByTrackingCode(trackingCode);
        if (delivery == null || !customerId.equals(delivery.getCustomerId())) {
            return ResponseEntity.badRequest().body("No delivery found with the given tracking code!");
        }

        DeliveryDetails deliveryDetails = getDeliveryDetails(delivery);
        DeliveryDetailsWithDates deliveryDetailsWithDates = new DeliveryDetailsWithDates(delivery,deliveryDetails.getPickupBox(),deliveryDetails.getCustomerEmail(),deliveryDetails.getDelivererEmail());
        return ResponseEntity.ok(deliveryDetailsWithDates);
    }

    @RequestMapping(path = "", method = RequestMethod.POST)
    public ResponseEntity<?> createDelivery(@RequestHeader(value = "Authorization", required = false) String bearerToken,@RequestBody Map<String,Object> payload) {
        try {
            authenticateUser(bearerToken,UserRole.DISPATCHER);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        String pickupBoxId = (String) payload.get("pickupBoxId");
        String delivererId = (String) payload.get("delivererId");
        String customerId = (String) payload.get("customerId");
        if (pickupBoxId == null || customerId == null || delivererId == null) {
            return ResponseEntity.badRequest().body("All required fields must be filled out!");
        }
        if (!checkPickupBoxExists(pickupBoxId)) {
            return ResponseEntity.badRequest().body("No pickupbox found with given Id!");
        } else if (!checkCustomerExists(customerId))
            return ResponseEntity.badRequest().body("No customer found with given Id!");
        else if (!checkDelivererExists(delivererId))
            return ResponseEntity.badRequest().body("No deliverer found with given Id!");
        try {

            List<Delivery> pickupBoxDeliveries = deliveryService.getActiveDeliveriesByPickupBoxId(pickupBoxId);
            if (pickupBoxDeliveries == null || pickupBoxDeliveries.isEmpty() || pickupBoxDeliveries.get(0).getCustomerId().equals(customerId)) {
                Delivery delivery = new Delivery(pickupBoxId, delivererId, customerId);
                StatusChangeMailRequest statusChangeMailRequest = new StatusChangeMailRequest(delivery.getStatus(), delivery.getTrackingCode());
                mailService.sendEmailTo(getUserFromId(customerId).getEmail(), statusChangeMailRequest);
                return ResponseEntity.ok(deliveryService.createDelivery(delivery));
            } else {
                return ResponseEntity.badRequest().body("Pickupbox is used by another customer!");
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body("Unknown error!");
        }

    }




    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateDelivery(@RequestHeader(value = "Authorization", required = false) String bearerToken, @RequestBody Map<String,Object> payload, @PathVariable String id) {
        try {
            authenticateUser(bearerToken,UserRole.DISPATCHER);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        Delivery delivery = deliveryService.findById(id);

        if (delivery == null) {
            return ResponseEntity.badRequest().body("No delivery found with given Id!");
        }
        String pickupBoxId = (String) payload.get("pickupBoxId");
        String customerId = (String) payload.get("customerId");
        String delivererId = (String) payload.get("delivererId");
        DeliveryStatus status;
        if (pickupBoxId == null || customerId == null || delivererId == null) {
            return ResponseEntity.badRequest().body("All required fields must be filled out!");
        }

        try {
            status = DeliveryStatus.valueOf((String) payload.get("status"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Status is not valid!");
        }


        if (!checkPickupBoxExists(pickupBoxId))
            return ResponseEntity.badRequest().body("No pickupbox found with given Id!");
        else if (!checkCustomerExists(customerId))
            return ResponseEntity.badRequest().body("No customer found with given Id!");
        else if (!checkDelivererExists(delivererId))
            return ResponseEntity.badRequest().body("No deliverer found with given Id!");


        try {
            List<Delivery> pickupBoxDeliveries = deliveryService.getActiveDeliveriesByPickupBoxId(pickupBoxId);
            if (pickupBoxDeliveries == null || pickupBoxDeliveries.isEmpty() ||
                    pickupBoxDeliveries.get(0).getCustomerId().equals(customerId)) {
                Delivery updatedDelivery = setUpdatedValues(delivery,pickupBoxId,customerId,delivererId,status);
                return ResponseEntity.ok(deliveryService.createDelivery(updatedDelivery));

            } else if(pickupBoxDeliveries.size()==1 && id.equals(pickupBoxDeliveries.get(0).getId())) {
                Delivery updatedDelivery = setUpdatedValues(delivery,pickupBoxId,customerId,delivererId,status);
                return ResponseEntity.ok(deliveryService.createDelivery(updatedDelivery));
            }
            else{
                return ResponseEntity.badRequest().body("Pickupbox is used by another customer!");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> deleteDelivery(@RequestHeader(value = "Authorization", required = false) String bearerToken,@PathVariable String id) {
        try {
            authenticateUser(bearerToken,UserRole.DISPATCHER);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        Delivery delivery = deliveryService.findById(id);
        if (delivery == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        boolean isRemoved = deliveryService.deleteDelivery(id);

        if (isRemoved) {
            DeliveryDetails deliveryDetails = getDeliveryDetails(delivery);
            DeletedDelivery deletedDelivery = new DeletedDelivery(deliveryDetails);
            deletedDeliveryService.createDeletedDelivery(deletedDelivery);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(id, HttpStatus.NOT_FOUND);
    }

    @GetMapping("/active-delivery-check/{id}")
    public ResponseEntity<?> checkActiveDeliveries(@PathVariable("id") String id) {
        List<Delivery> deliveryListDeliverer = deliveryService.getActiveDeliveriesByDelivererId(id);
        List<Delivery> deliveryListCustomer = deliveryService.getActiveDeliveriesByCustomerId(id);
        if (deliveryListDeliverer.isEmpty() && deliveryListCustomer.isEmpty()) {
            return ResponseEntity.ok(Boolean.FALSE);
        } else {
            return ResponseEntity.ok(Boolean.TRUE);
        }
    }

    private AseUserDto authenticateUser(String bearerToken,UserRole role) {
        if (bearerToken==null || bearerToken.strip().length()==6) {
            throw new RuntimeException();
        }
        String token = bearerToken.split(" ")[1];
        AseUserDto userData;
        System.out.println(token);
        String url = discoveryClient.getNextServerFromEureka("AUTHENTICATION-SERVICE", false).getHomePageUrl();
        userData= DeliveryManagementApplication.getRestTemplate().getForEntity(url + "api/authentication-service/user/token/"+token , AseUserDto.class).getBody();
        if (userData==null || !userData.getUserRole().equals(role)) {

            throw new RuntimeException();
        }
        return userData;
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
    private DeliveryDetails getDeliveryDetails(Delivery delivery) {
        PickupBox pickupBox = pickupBoxService.findById(delivery.getPickupBoxId());
        AseUserDto customer = getUserFromId(delivery.getCustomerId());
        AseUserDto deliverer = getUserFromId(delivery.getDelivererId());
        String customerEmail = null;
        String delivererEmail = null;
        if (customer != null) {
            customerEmail = customer.getEmail();
        }
        if (deliverer != null) {
            delivererEmail = deliverer.getEmail();
        }
        return new DeliveryDetails(delivery, pickupBox, customerEmail, delivererEmail);
    }

    public Delivery setUpdatedValues(Delivery delivery, String pickupBoxId, String customerId, String delivererId, DeliveryStatus newStatus) {
        delivery.setPickupBoxId(pickupBoxId);
        delivery.setCustomerId(customerId);
        delivery.setDelivererId(delivererId);
        StatusChangeMailRequest statusChangeMailRequest;
        if (newStatus != delivery.getStatus()) {
            Date date = new Date();
            switch (newStatus) {
                case IN_WAREHOUSE:
                    delivery.setPickedUpAt(null);
                    delivery.setDepositedAt(null);
                    delivery.setCollectedAt(null);
                    delivery.setActive(true);
                    break;
                case IN_DELIVERY:
                    delivery.setPickedUpAt(date);
                    delivery.setDepositedAt(null);
                    delivery.setCollectedAt(null);
                    delivery.setActive(true);
                    statusChangeMailRequest = new StatusChangeMailRequest(newStatus, delivery.getTrackingCode());
                    mailService.sendEmailTo(getUserFromId(customerId).getEmail(), statusChangeMailRequest);
                    break;
                case IN_PICKUPBOX:
                    if(delivery.getStatus() == DeliveryStatus.IN_WAREHOUSE) {
                        delivery.setPickedUpAt(date);
                    }
                    delivery.setDepositedAt(date);
                    delivery.setCollectedAt(null);
                    delivery.setActive(true);
                    statusChangeMailRequest = new StatusChangeMailRequest(newStatus, delivery.getTrackingCode());
                    mailService.sendEmailTo(getUserFromId(customerId).getEmail(), statusChangeMailRequest);
                    break;
                case DELIVERED:
                    if(delivery.getStatus()== DeliveryStatus.IN_WAREHOUSE) {
                        delivery.setPickedUpAt(date);
                        delivery.setDepositedAt(date);
                    } else if (delivery.getStatus()== DeliveryStatus.IN_DELIVERY) {
                        delivery.setDepositedAt(date);
                    }
                    delivery.setCollectedAt(date);
                    delivery.setActive(false);
                    statusChangeMailRequest = new StatusChangeMailRequest(newStatus, delivery.getTrackingCode());
                    mailService.sendEmailTo(getUserFromId(customerId).getEmail(), statusChangeMailRequest);
                    break;


            }
            delivery.setStatus(newStatus);

        }
        return delivery;
    }
    public boolean checkCustomerExists(String customerId) {
        AseUserDto customer = getUserFromId(customerId);
        return customer != null && customer.getUserRole().equals(UserRole.CUSTOMER);
    }

    public boolean checkDelivererExists(String delivererId) {
        AseUserDto deliverer = getUserFromId(delivererId);
        return deliverer != null && deliverer.getUserRole().equals(UserRole.DELIVERER);
    }

    public boolean checkPickupBoxExists(String pickupBoxId) {
        PickupBox pickupBox = pickupBoxService.findById(pickupBoxId);
        return pickupBox != null;
    }
}


