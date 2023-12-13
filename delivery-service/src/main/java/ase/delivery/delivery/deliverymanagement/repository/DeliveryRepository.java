package ase.delivery.delivery.deliverymanagement.repository;

import ase.delivery.delivery.deliverymanagement.model.Delivery;
import ase.delivery.delivery.deliverymanagement.model.DeliveryStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DeliveryRepository extends MongoRepository<Delivery,String> {
    Delivery findDeliveryById(String id);
    Delivery findDeliveryByTrackingCode(String trackingCode);


    List<Delivery> findByPickupBoxId(String pickupBoxId);

    List<Delivery> findByPickupBoxIdAndActiveIsTrue(String pickupBoxId);



    List<Delivery> findByDelivererId(String delivererId);



    List<Delivery> findByCustomerId(String customerId);


    List<Delivery> findByDelivererIdAndStatus(String delivererId, DeliveryStatus status);

    List<Delivery> findByCustomerIdAndActiveIsTrue(String customerId);

    List<Delivery> findByCustomerIdAndActiveIsFalse(String customerId);

    List<Delivery> findByDelivererIdAndActiveIsTrue(String delivererId);
    List<Delivery> findByDelivererIdAndPickupBoxIdAndActiveIsTrue(String delivererId, String pickupBoxId);

    List<Delivery> findByDelivererIdAndPickupBoxIdAndStatus(String delivererId, String pickupBoxId, DeliveryStatus status);
    List<Delivery> findByCustomerIdAndPickupBoxIdAndStatus(String customerId, String pickupBoxId, DeliveryStatus status);

    List<Delivery> findAllBy();

    int deleteDeliveryById(String id);
}
