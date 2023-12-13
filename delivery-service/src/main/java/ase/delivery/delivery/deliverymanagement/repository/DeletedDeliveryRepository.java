package ase.delivery.delivery.deliverymanagement.repository;

import ase.delivery.delivery.deliverymanagement.model.DeletedDelivery;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DeletedDeliveryRepository extends MongoRepository<DeletedDelivery,String> {
    List<DeletedDelivery> findAllBy();

}
