package ase.delivery.delivery.deliverymanagement.service;

import ase.delivery.delivery.deliverymanagement.model.Delivery;
import ase.delivery.delivery.deliverymanagement.model.DeliveryStatus;
import ase.delivery.delivery.deliverymanagement.repository.DeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeliveryService {
    @Autowired
    private DeliveryRepository deliveryRepository;

    public Delivery createDelivery(Delivery delivery) {
        return deliveryRepository.save(delivery);
    }
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAllBy();
    }

    public List<Delivery> getDeliveriesByCustomerId(String id) {
        return deliveryRepository.findByCustomerId(id);
    }

    public List<Delivery> getDeliveriesByDelivererId(String id) {
        return deliveryRepository.findByDelivererId(id);
    }

    public List<Delivery> getDeliveriesOnDelivererForPickupBox(String delivererId, String pickupBoxId) {
        return deliveryRepository.findByDelivererIdAndPickupBoxIdAndStatus(delivererId,pickupBoxId,DeliveryStatus.IN_DELIVERY);
    }
    public List<Delivery> getDeliveriesInPickupBoxForCustomer(String customerId, String pickupBoxId) {
        return deliveryRepository.findByCustomerIdAndPickupBoxIdAndStatus(customerId,pickupBoxId, DeliveryStatus.IN_PICKUPBOX);
    }


    public List<Delivery> getActiveDeliveriesByPickupBoxId(String id) {
        return deliveryRepository.findByPickupBoxIdAndActiveIsTrue(id);
    }

    public List<Delivery> getActiveDeliveriesByCustomerId(String id) {
        return deliveryRepository.findByCustomerIdAndActiveIsTrue(id);
    }

    public List<Delivery> getActiveDeliveriesByDelivererId(String id) {
        return deliveryRepository.findByDelivererIdAndActiveIsTrue(id);
    }
    public List<Delivery> getActiveDeliveriesByDelivererIdAndPickupBoxId(String delivererId, String pickupBoxId) {
        return deliveryRepository.findByDelivererIdAndPickupBoxIdAndActiveIsTrue(delivererId, pickupBoxId);
    }

    public List<Delivery> getPastDeliveriesByCustomerId(String id) {
        return deliveryRepository.findByCustomerIdAndActiveIsFalse(id);
    }


    public Delivery findById(String id) {
        return deliveryRepository.findDeliveryById(id);
    }

    public Delivery findByTrackingCode(String trackingCode) {
        return deliveryRepository.findDeliveryByTrackingCode(trackingCode);
    }

    public boolean deleteDelivery(String id) {
        return deliveryRepository.deleteDeliveryById(id)>0;}

}
