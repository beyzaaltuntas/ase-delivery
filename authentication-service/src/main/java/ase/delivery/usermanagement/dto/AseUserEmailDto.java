package ase.delivery.usermanagement.dto;
public class AseUserEmailDto {
    private String email;
    private String id;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getId() {
        return id;
    }

    public AseUserEmailDto(String id, String email) {
        this.email = email;
        this.id = id;
    }

    public void setId(String id) {
        this.id = id;
    }
}