package ase.delivery.delivery.deliverymanagement.model;

public class AseUserDto {
    public AseUserDto() {
    }

    private String id;
    private String email;



    public AseUserDto(String id, String email, String rfidToken, UserRole userRole) {
        this.id = id;
        this.email = email;
        this.rfidToken = rfidToken;
        this.userRole = userRole;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRfidToken() {
        return rfidToken;
    }

    public void setRfidToken(String rfidToken) {
        this.rfidToken = rfidToken;
    }



    private String rfidToken;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public UserRole getUserRole() {
        return userRole;
    }

    public void setUserRole(UserRole userRole) {
        this.userRole = userRole;
    }

    private UserRole userRole;
}
