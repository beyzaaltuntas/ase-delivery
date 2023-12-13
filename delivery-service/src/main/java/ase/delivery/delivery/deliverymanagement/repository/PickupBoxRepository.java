package ase.delivery.delivery.deliverymanagement.repository;

import ase.delivery.delivery.deliverymanagement.model.PickupBox;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PickupBoxRepository extends MongoRepository<PickupBox, String> {
    // TODO: Write a function to find the project by Name
    PickupBox findByName(String name);

    PickupBox findByRaspberryId(String raspberryId);

    List<PickupBox> findByIdIn(List<String> idList);

    PickupBox findPickupBoxById(String id);

    List<PickupBox> findAllBy();

    int deletePickupBoxById(String id);
}
