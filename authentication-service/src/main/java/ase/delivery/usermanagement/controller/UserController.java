package ase.delivery.usermanagement.controller;

import ase.delivery.usermanagement.UserManagementApplication;
import ase.delivery.usermanagement.dto.AseUserEmailDto;
import ase.delivery.usermanagement.model.AseUser;
import ase.delivery.usermanagement.model.UserRole;
import ase.delivery.usermanagement.service.UserService;
import com.netflix.discovery.EurekaClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    EurekaClient discoveryClient;


    @GetMapping("/dispatcher")
    public ResponseEntity<?> getAllDispatchers(Authentication token) {
        if(!authenticateUser(token,UserRole.DISPATCHER)) {
            return new ResponseEntity<String>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(userService.getUsersByRole(UserRole.DISPATCHER));
    }

    @GetMapping("/customer")
    public ResponseEntity<?> getAllCustomers(Authentication token) {

        if(!authenticateUser(token,UserRole.DISPATCHER)) {
            return new ResponseEntity<String>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(userService.getUsersByRole(UserRole.CUSTOMER));
    }

    @GetMapping("/deliverer")
    public ResponseEntity<?> getAllDeliverers(Authentication token) {
        if(!authenticateUser(token,UserRole.DISPATCHER)) {
            return new ResponseEntity<String>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(userService.getUsersByRole(UserRole.DELIVERER));
    }

    @GetMapping("/deliverer/emails")
    public ResponseEntity<?> getAllDelivererEmails(Authentication token) {
        if(!authenticateUser(token,UserRole.DISPATCHER)) {
            return new ResponseEntity<String>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        List<AseUser> delivererList = userService.getUsersByRole(UserRole.DELIVERER);
        return ResponseEntity.ok(getAseUserEmailDto(delivererList));
    }

    @GetMapping("/customer/emails")
    public ResponseEntity<?> getAllCustomerEmails(Authentication token) {
        System.out.println(token.toString());
        if(!authenticateUser(token,UserRole.DISPATCHER)) {
            return new ResponseEntity<String>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        List<AseUser> customerList = userService.getUsersByRole(UserRole.CUSTOMER);
        return ResponseEntity.ok(getAseUserEmailDto(customerList));
    }



    @RequestMapping(path = "", method = RequestMethod.POST)
    public ResponseEntity createUser(@RequestBody Map<String, Object> payload,Authentication token) {
        if(!authenticateUser(token,UserRole.DISPATCHER)) {
            return new ResponseEntity<String>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        UserRole role;
        String email = (String) payload.get("email");
        String rfidToken = (String) payload.get("rfidToken");
        String password = (String) payload.get("password");
        String userRole = (String) payload.get("userRole");

        if (email == null || password == null || userRole == null) {
            return ResponseEntity.badRequest().body("All required fields must be filled out!");
        }

        if (checkEmailIsDuplicate(email, null))
            return ResponseEntity.badRequest().body("A user with that email already exists!");
        if (checkRfidTokenIsDuplicate(rfidToken, null))
            return ResponseEntity.badRequest().body("A user with that rfid token already exists!");
        try {
            role = UserRole.valueOf((String) payload.get("userRole"));

            return ResponseEntity.ok(userService.create(email,password,rfidToken,role));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }


    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity updateUser(@PathVariable String id, @RequestBody Map<String, Object> payload,Authentication token) {
        if(!authenticateUser(token,UserRole.DISPATCHER)) {
            return new ResponseEntity<String>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        AseUser user = userService.findUserById(id);
        if (user == null) {
            return ResponseEntity.badRequest().body("No user found with given Id!");
        }
        String email = (String) payload.get("email");
        String rfidToken = (String) payload.get("rfidToken");
        String password = (String) payload.get("password");
        if (email == null) {
            return ResponseEntity.badRequest().body("All required fields must be filled out!");
        }
        if (checkEmailIsDuplicate(email, id))
            return ResponseEntity.badRequest().body("A user with that email already exists!");
        if (checkRfidTokenIsDuplicate(rfidToken, id))
            return ResponseEntity.badRequest().body("A user with that rfid token already exists!");

        try {
            return ResponseEntity.ok(userService.update(email,password,rfidToken,user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }


    }



    @DeleteMapping(value = "/{id}")
    public ResponseEntity deleteUser(@PathVariable String id,Authentication token) {
        if(!authenticateUser(token,UserRole.DISPATCHER)) {
            return new ResponseEntity<String>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        AseUser user = userService.findUserById(id);
        if(user== null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else if (user.getUserRole()==UserRole.DISPATCHER) {
            userService.deleteAseUser(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        Boolean hasActiveDeliveries;
        try {
            hasActiveDeliveries = userHasActiveDeliveries(id);
        } catch (Exception e) {
            return new ResponseEntity<String>("An error occurred with the request to DELIVERY-SERVICE!", HttpStatus.BAD_REQUEST);
        }
        if (hasActiveDeliveries) {
            return new ResponseEntity<String>("User has active deliveries related to them!", HttpStatus.BAD_REQUEST);
        }
        boolean isRemoved = userService.deleteAseUser(id);
        if (!isRemoved) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(id, HttpStatus.OK);
    }



    @GetMapping("/token/{token}")
    public AseUser getUser(@PathVariable("token") String tokenStr) {
        AseUser user;
        try {
             user = userService.findByToken(tokenStr);
        } catch(Exception e) {
            return null;
        }
        return user;
    }
    @GetMapping("/id/{id}")
    public AseUser getUserFromId(@PathVariable("id") String id) {
        return userService.findUserById(id);
    }

    @GetMapping("/rfid/{rfid}")
    public AseUser getUserFromRfidToken(@PathVariable("rfid") String rfid) {
        return userService.findByRfidToken(rfid);
    }


    private Boolean userHasActiveDeliveries(String aseUserId) {
        if (aseUserId.isBlank()) {
            throw new RuntimeException();
        }
        String url = discoveryClient.getNextServerFromEureka("DELIVERY-SERVICE", false).getHomePageUrl();
        ResponseEntity<Boolean> responseEntity= UserManagementApplication.getRestTemplate().getForEntity(url + "api/delivery-service/delivery/active-delivery-check/"+aseUserId , Boolean.class);
        if (responseEntity.getStatusCode()!= HttpStatusCode.valueOf(200) || responseEntity.getBody()==null) {
            throw new RuntimeException();
        }
        return responseEntity.getBody();

    }

    private boolean authenticateUser(Authentication token,UserRole role) {
        try {
            JwtAuthenticationToken tokenObj = (JwtAuthenticationToken) token;
            Map<String, Object> attributes = tokenObj.getTokenAttributes();
            var email = (String) attributes.get("username");
            return userService.findUser(email).getUserRole() == role;
        } catch (Exception e)  {
            return false;
        }
    }

    private boolean checkRfidTokenIsDuplicate(String rfidToken, String id) {
        if (rfidToken == null)
            return false;
        AseUser user = userService.findByRfidToken(rfidToken);
        if (user == null)
            return false;
        else return !user.getId().equals(id);
    }

    private boolean checkEmailIsDuplicate(String email, String id) {
        AseUser user = userService.findUser(email);
        if (user == null)
            return false;
        else return !user.getId().equals(id);
    }

    private List<AseUserEmailDto> getAseUserEmailDto(List<AseUser> aseUserList) {
        List<AseUserEmailDto> AseUserNameList = new ArrayList<AseUserEmailDto>();
        for (int i = 0; i < aseUserList.size(); i++) {
            AseUserNameList.add(new AseUserEmailDto(aseUserList.get(i).getId(), aseUserList.get(i).getEmail()));
        }
        return AseUserNameList;
    }



}
