package ase.delivery.usermanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.util.Assert;

@Document(collection = "users")
public class AseUser {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    private String password;

    @Indexed(sparse = true, unique = true)
    private String rfidToken;

    private UserRole userRole;

    public AseUser(String email, String password, String rfidToken, UserRole userRole) {
        Assert.hasText(email, "User e-mail cannot be empty!");
        Assert.hasText(password, "Password cannot be empty!");
        Assert.notNull(userRole, "A user must have a role!");
        if (userRole != UserRole.DISPATCHER) {
            Assert.hasText(rfidToken, "RFID token cannot be empty!");
        }
        this.email = email;
        this.password = password;
        this.rfidToken = rfidToken;
        this.userRole = userRole;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRfidToken(String rfidToken) {
        this.rfidToken = rfidToken;
    }

    public void setUserRole(UserRole userRole) {
        this.userRole = userRole;
    }

    public String getId() {
        return id;
    }

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    public String getRfidToken() {
        return rfidToken;
    }

    public UserRole getUserRole() {
        return userRole;
    }



}
