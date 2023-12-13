package ase.delivery.delivery.deliverymanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "deletedDeliveries")
public class DeletedDelivery {
    @Id
    private String id;

    public DeliveryStatus getLastDeliveryStatus() {
        return lastDeliveryStatus;
    }

    public void setLastDeliveryStatus(DeliveryStatus lastDeliveryStatus) {
        this.lastDeliveryStatus = lastDeliveryStatus;
    }

    private DeliveryStatus lastDeliveryStatus;

    private Date createdAt;

    private Date deletedAt;



    private Object pickupBox;

    private String customerEmail;

    private String delivererEmail;

    protected DeletedDelivery() {

    }
    public DeletedDelivery (DeliveryDetails deliveryDetails) {
        this.setPickupBox(deliveryDetails.getPickupBox());
        this.setCustomerEmail(deliveryDetails.getCustomerEmail());
        this.setDelivererEmail(deliveryDetails.getDelivererEmail());
        this.setLastDeliveryStatus(deliveryDetails.getStatus());
        this.setCreatedAt(deliveryDetails.getCreatedAt());
        this.setDeletedAt(new Date());
    }
    public String getId() {
        return id;
    }
    public Date getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(Date deletedAt) {
        this.deletedAt = deletedAt;
    }

    public void setId(String id) {
        this.id = id;
    }




    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Object getPickupBox() {
        return pickupBox;
    }

    public void setPickupBox(Object pickupBox) {
        this.pickupBox = pickupBox;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getDelivererEmail() {
        return delivererEmail;
    }

    public void setDelivererEmail(String delivererEmail) {
        this.delivererEmail = delivererEmail;
    }
}
