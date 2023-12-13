package ase.delivery.usermanagement.dto;


import ase.delivery.usermanagement.model.UserRole;

public class LoginResponseDto {


    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    String token;

    public LoginResponseDto(String token, UserRole userRole) {
        this.token = token;
        this.userRole = userRole;
    }

    public LoginResponseDto() {
    }

    public UserRole getUserRole() {
        return userRole;
    }

    public void setUserRole(UserRole userRole) {
        this.userRole = userRole;
    }

    UserRole userRole;
}
