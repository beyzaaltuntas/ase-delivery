package ase.delivery.delivery.deliverymanagement.model;

import ase.delivery.delivery.deliverymanagement.util.GenerateRandomString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.util.Assert;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Document(collection = "deliveries")
public class Delivery {



    @Id
    private String id;

    private String pickupBoxId;


    private String delivererId;

    private String customerId;

    private DeliveryStatus status;

    @Indexed(unique = true)
    private String trackingCode;

    private boolean active;

    private Date createdAt;

    protected Date pickedUpAt;
    protected Date depositedAt;

    protected Date collectedAt;



    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public void setPickedUpAt(Date pickedUpAt) {
        this.pickedUpAt = pickedUpAt;
    }

    public void setDepositedAt(Date depositedAt) {
        this.depositedAt = depositedAt;
    }

    public void setCollectedAt(Date collectedAt) {
        this.collectedAt = collectedAt;
    }



    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getPickupBoxId() {
        return pickupBoxId;
    }

    public String getDelivererId() {
        return delivererId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public DeliveryStatus getStatus() {
        return status;
    }

    public String getTrackingCode() {
        return trackingCode;
    }


    public void setStatus(DeliveryStatus status) {
        this.status = status;
    }

    public void setPickupBoxId(String pickupBoxId) {
        this.pickupBoxId = pickupBoxId;
    }


    public void setDelivererId(String delivererId) {
        this.delivererId = delivererId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public void setTrackingCode(String trackingCode) {
        this.trackingCode = trackingCode;
    }


    public Delivery(String pickupBoxId, String delivererId, String customerId) {
        Assert.hasText(pickupBoxId, "Delivery must have a pickup box!");
        Assert.hasText(delivererId, "Delivery must have a deliverer!");
        Assert.hasText(customerId, "Delivery must have a customer!");
        this.pickupBoxId = pickupBoxId;
        this.delivererId = delivererId;
        this.customerId = customerId;
        this.status = DeliveryStatus.IN_WAREHOUSE;
        this.trackingCode = GenerateRandomString.generateTrackingCode();
        this.active = true;
        this.setCreatedAt(new Date());
    }
    public List<Date> listDateDetails() {
        return Arrays.asList(this.pickedUpAt,this.depositedAt,this.collectedAt);
    }

    public Delivery(Delivery delivery) {
        this.setId(delivery.getId());
        this.setPickupBoxId(delivery.getPickupBoxId());
        this.setCustomerId(delivery.getCustomerId());
        this.setDelivererId(delivery.getDelivererId());
        this.setStatus(delivery.getStatus());
        this.setTrackingCode(delivery.getTrackingCode());
        this.setActive(delivery.isActive());
        this.setCreatedAt(delivery.getCreatedAt());
        List<Date> dateList = delivery.listDateDetails();
        this.setPickedUpAt(dateList.get(0));
        this.setDepositedAt(dateList.get(1));
        this.setCollectedAt(dateList.get(2));
    }

    protected Delivery() {

    }




}

