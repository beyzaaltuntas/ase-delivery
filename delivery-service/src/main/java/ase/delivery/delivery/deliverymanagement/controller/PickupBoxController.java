package ase.delivery.delivery.deliverymanagement.controller;

import ase.delivery.delivery.deliverymanagement.DeliveryManagementApplication;
import ase.delivery.delivery.deliverymanagement.model.*;
import ase.delivery.delivery.deliverymanagement.service.DeliveryService;
import ase.delivery.delivery.deliverymanagement.service.PickupBoxService;
import com.netflix.discovery.EurekaClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/pickupbox")
public class PickupBoxController {
    @Autowired
    PickupBoxService pickupBoxService;

    @Autowired
    DeliveryService deliveryService;
    @Autowired
    EurekaClient discoveryClient;

    @GetMapping("")
    public ResponseEntity getAllPickupBoxes(@RequestHeader(value = "Authorization", required = false) String bearerToken) {
        try {
            authenticateUser(bearerToken,UserRole.DISPATCHER);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        List<PickupBox> pickupBoxList = pickupBoxService.getAllPickupBoxes();
        List<PickupBoxDetails> pickupBoxDetailsList = new ArrayList<PickupBoxDetails>();
        for (int i=0;i<pickupBoxList.size();i++) {
            pickupBoxDetailsList.add(getPickupBoxDetails(pickupBoxList.get(i    )));
        }
        return ResponseEntity.ok(pickupBoxDetailsList);
    }




    @GetMapping("/assigned-boxes")
    public ResponseEntity getAssignedPickupBoxesOfDeliverer(@RequestHeader(value = "Authorization", required = false) String bearerToken) {
        AseUserDto user;
        try {
            user= authenticateUser(bearerToken,UserRole.DELIVERER);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        String delivererId= user.getId();
        List<Delivery> deliveryList = deliveryService.getActiveDeliveriesByDelivererId(delivererId);
        Set<String> pickupBoxIds = new HashSet<>();
        for (int i=0;i<deliveryList.size();i++) {
            pickupBoxIds.add(deliveryList.get(i).getPickupBoxId());
        }
        List<PickupBox> pickupBoxList = pickupBoxService.getAllPickupBoxesInList(new ArrayList<>(pickupBoxIds));
        return ResponseEntity.ok(pickupBoxList);
    }
    @GetMapping("/names")
    public List<PickupBoxNameTuple> getAllPickupBoxNames() {

        List<PickupBox> pickupBoxList = pickupBoxService.getAllPickupBoxes();
        List<PickupBoxNameTuple> pickupBoxNameList = new ArrayList<PickupBoxNameTuple>();
        for (int i=0;i<pickupBoxList.size();i++) {
            pickupBoxNameList.add(new PickupBoxNameTuple(pickupBoxList.get(i).getId(),pickupBoxList.get(i).getName()));
        }
        return pickupBoxNameList;
    }

    @GetMapping("/{id}")
    public PickupBoxDetails getPickupBoxById(@PathVariable String id) {
        PickupBox pickupBox = pickupBoxService.findById(id);
        if (pickupBox==null) {
            return null;
        }
        PickupBoxDetails pickupBoxDetails = getPickupBoxDetails(pickupBox);
        return pickupBoxDetails;
    }

    @RequestMapping(path = "", method = RequestMethod.POST)
    public ResponseEntity createPickupBox(@RequestHeader(value = "Authorization", required = false) String bearerToken,@RequestBody Map<String,Object> payload) {
        try {
            authenticateUser(bearerToken,UserRole.DISPATCHER);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        String name = (String) payload.get("name");
        String raspberryId = (String) payload.get("raspberryId");
        String street = (String) payload.get("street");
        String city = (String) payload.get("city");
        String zip = (String) payload.get("zip");
        if (name == null || raspberryId == null || street == null || city == null || zip == null) {
            return ResponseEntity.badRequest().body("All required fields must be filled out!");
        }
        if(checkNameIsDuplicate(name,null))
            return ResponseEntity.badRequest().body("A pickupbox with that name already exists!");
        if(checkRaspberryIdIsDuplicate(raspberryId,null))
            return ResponseEntity.badRequest().body("A pickupbox with that raspberryId already exists!");
        try {
            PickupBox pickupBox = new PickupBox(name, raspberryId, street,city,zip);
            pickupBoxService.createPickupBox(pickupBox);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
    @RequestMapping(value="/{id}", method = RequestMethod.PUT)
    public ResponseEntity updatePickupBox(@PathVariable String id, @RequestBody Map<String, Object> payload,@RequestHeader(value = "Authorization", required = false) String bearerToken) {
        try {
            authenticateUser(bearerToken,UserRole.DISPATCHER);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        PickupBox pickupBox = pickupBoxService.findById(id);
        if(pickupBox== null) {
            return ResponseEntity.badRequest().body("No pickupbox found with given Id!");
        }
        String name = (String) payload.get("name");
        String raspberryId = (String) payload.get("raspberryId");
        String street = (String) payload.get("street");
        String city = (String) payload.get("city");
        String zip = (String) payload.get("zip");
        if (name == null || raspberryId == null || street == null || city == null || zip == null) {
            return ResponseEntity.badRequest().body("All required fields must be filled out!");
        }

        if(checkNameIsDuplicate(name,id))
            return ResponseEntity.badRequest().body("A pickupbox with that name already exists!");
        if(checkRaspberryIdIsDuplicate(raspberryId,id))
            return ResponseEntity.badRequest().body("A pickupbox with that raspberryId already exists!");

        try {
            pickupBox.setName(name);
            pickupBox.setRaspberryId(raspberryId);
            pickupBox.setStreet(street);
            pickupBox.setCity(city);
            pickupBox.setZip(zip);
            return ResponseEntity.ok(pickupBoxService.createPickupBox(pickupBox));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }


    }
    @DeleteMapping(value = "/{id}")
    public ResponseEntity deletePickupBox(@PathVariable String id,@RequestHeader(value = "Authorization", required = false) String bearerToken) {
        try {
            authenticateUser(bearerToken,UserRole.DISPATCHER);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        List<Delivery> deliveryList = deliveryService.getActiveDeliveriesByPickupBoxId(id);

        if (!deliveryList.isEmpty()) {
            return ResponseEntity.badRequest().body("The pickupbox is currently assigned to a customer!");
        }
        boolean isRemoved = pickupBoxService.deletePickupBox(id);

        if (!isRemoved) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(id,HttpStatus.OK);
    }

    private AseUserDto authenticateUser(String bearerToken,UserRole role) {
        if (bearerToken==null || bearerToken.strip().length()<=6) {
            throw new RuntimeException();
        }
        String token = bearerToken.split(" ")[1];
        AseUserDto userData;
        System.out.println(token);
        String url = discoveryClient.getNextServerFromEureka("AUTHENTICATION-SERVICE", false).getHomePageUrl();
        System.out.println(url);
        userData= DeliveryManagementApplication.getRestTemplate().getForEntity(url + "api/authentication-service/user/token/"+token , AseUserDto.class).getBody();
        System.out.println(userData.getEmail());
        if (userData==null || !userData.getUserRole().equals(role)) {
            System.out.println(userData.getUserRole());
            System.out.println(role);
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
    private boolean checkNameIsDuplicate(String name,String id) {
        PickupBox pickupBox = pickupBoxService.findByName(name);
        if(pickupBox == null)
            return false;
        else return !pickupBox.getId().equals(id);
    }

    private boolean checkRaspberryIdIsDuplicate(String raspberryId, String id) {
        PickupBox pickupBox = pickupBoxService.findByRaspberryId(raspberryId);
        if(pickupBox == null)
            return false;
        else return !pickupBox.getId().equals(id);
    }
    public  PickupBoxDetails getPickupBoxDetails(PickupBox pickupBox) {
        List<Delivery> deliveryList = deliveryService.getActiveDeliveriesByPickupBoxId(pickupBox.getId());
        Set<String> delivererList = new HashSet<String>();
        List<Object> delivererObjectList = new ArrayList<Object>();
        if (deliveryList == null || deliveryList.isEmpty()) {
            return new PickupBoxDetails(pickupBox,delivererObjectList, null);
        }

        String customerId = deliveryList.get(0).getCustomerId();
        AseUserDto customer = getUserFromId(customerId);
        for (int i=0;i< deliveryList.size();i++) {
            delivererList.add(deliveryList.get(i).getDelivererId());
        }
        for (String delivererId : delivererList) {
            delivererObjectList.add(getUserFromId(delivererId));
        }
        return new PickupBoxDetails(pickupBox,delivererObjectList,customer);
    }


}

