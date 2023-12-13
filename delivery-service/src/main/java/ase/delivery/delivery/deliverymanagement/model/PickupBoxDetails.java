package ase.delivery.delivery.deliverymanagement.model;

import java.util.List;

public class PickupBoxDetails extends PickupBox{

    private List<Object> delivererList;



    private Object customer;

    public List<Object> getDelivererList() {
        return delivererList;
    }

    public void setDelivererList(List<Object> delivererList) {
        this.delivererList = delivererList;
    }

    public Object getCustomer() {
        return customer;
    }

    public void setCustomer(Object customer) {
        this.customer = customer;
    }

    public PickupBoxDetails(PickupBox pickupBox, List<Object> delivererList, Object customer) {
        super(pickupBox);
        this.setDelivererList(delivererList);
        this.setCustomer(customer);

    }
}
