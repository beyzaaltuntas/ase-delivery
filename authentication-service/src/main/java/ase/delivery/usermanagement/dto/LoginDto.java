package ase.delivery.usermanagement.dto;

import ase.delivery.usermanagement.model.UserRole;

public class LoginDto {
    public LoginDto() {
    }

    public LoginDto(String email, String password, UserRole userRole) {
        this.email = email;
        this.password = password;
        this.userRole = userRole;
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

    String email;
    String password;
    UserRole userRole;
}
