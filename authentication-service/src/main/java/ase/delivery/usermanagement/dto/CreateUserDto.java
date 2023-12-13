package ase.delivery.usermanagement.dto;

import ase.delivery.usermanagement.model.UserRole;

public class CreateUserDto {
    public CreateUserDto(String email, String password, UserRole userRole, String rfidToken) {
        this.email = email;
        this.password = password;
        this.userRole = userRole;
        this.rfidToken = rfidToken;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UserRole getUserRole() {
        return userRole;
    }

    public void setUserRole(UserRole userRole) {
        this.userRole = userRole;
    }

    public String getRfidToken() {
        return rfidToken;
    }

    public void setRfidToken(String rfidToken) {
        this.rfidToken = rfidToken;
    }

    private String email;

    public CreateUserDto() {
    }

    private String password;
    private UserRole userRole;
    private String rfidToken;
}