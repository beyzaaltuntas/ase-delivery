package ase.delivery.delivery.deliverymanagement.model;

import java.util.Date;

public class DeliveryDetailsWithDates extends DeliveryDetails{

    public DeliveryDetailsWithDates(Delivery delivery, PickupBox pickupBox, String customerEmail, String delivererEmail) {
        super(delivery, pickupBox, customerEmail, delivererEmail);
    }
    public Date getPickedUpAt() {
        return this.pickedUpAt;
    }
    public Date getDepositedAt() {
        return this.depositedAt;
    }
    public Date getCollectedAt() {
        return this.collectedAt;
    }
}
