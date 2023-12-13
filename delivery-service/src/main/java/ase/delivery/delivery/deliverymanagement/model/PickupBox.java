package ase.delivery.delivery.deliverymanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import com.mongodb.lang.NonNull;
import org.springframework.util.Assert;


@Document(collection = "pickupboxes")
public class PickupBox {
public enum PickupBoxStatus {
    CLOSED,
    OPEN
}
    @Id
    private String id;



    @Indexed(unique = true)
    private String name;

    @Indexed(unique = true)
    private String raspberryId;

    private PickupBoxStatus status;

    private String street;

    private String country;

    private String city;

    private String zip;


    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }



    public PickupBox(@NonNull String name, String raspberryId, String street, String city, String zip) {
        Assert.hasText(name, "Pickup box must have a name!");
        Assert.hasText(raspberryId, "Pickup box must have a Raspberry ID!");
        Assert.hasText(street, "Address is not valid!");
        Assert.hasText(city, "Address is not valid!");
        Assert.hasText(zip, "Address is not valid!");
        this.name = name;
        this.raspberryId = raspberryId;
        this.street = street;
        this.country = "Germany";
        this.city = city;
        this.zip = zip;
        this.status = PickupBoxStatus.CLOSED;

    }

    protected PickupBox() {}







    public String getRaspberryId() {
        return raspberryId;
    }

    public void setRaspberryId(String raspberryId) {
        this.raspberryId = raspberryId;
    }

    public PickupBoxStatus getStatus() {
        return status;
    }

    public void setStatus(PickupBoxStatus status) {
        this.status = status;
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public PickupBox(PickupBox pickupBox) {
        this.setId(pickupBox.getId());
        this.setName(pickupBox.getName());
        this.setCountry(pickupBox.getCountry());
        this.setStreet(pickupBox.getStreet());
        this.setRaspberryId(pickupBox.getRaspberryId());
        this.setCity(pickupBox.getCity());
        this.setZip(pickupBox.getZip());
        this.setStatus(pickupBox.getStatus());
    }

}
