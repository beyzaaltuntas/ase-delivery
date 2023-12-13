package ase.delivery.delivery.deliverymanagement.model;

public class DeliveryDetails extends Delivery{
    public PickupBox getPickupBox() {
        return (PickupBox) pickupBox;
    }

    public void setPickupBox(PickupBox pickupBox) {
        this.pickupBox = pickupBox;
    }

    private Object pickupBox;

    private String customerEmail;


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

    private String delivererEmail;
    public DeliveryDetails(Delivery delivery, PickupBox pickupBox, String customerEmail, String delivererEmail) {
        super(delivery);
        this.setPickupBox(pickupBox);
        this.setCustomerEmail(customerEmail);
        this.setDelivererEmail(delivererEmail);

    }

}
