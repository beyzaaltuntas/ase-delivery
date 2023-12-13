package ase.delivery.delivery.deliverymanagement.service;

import ase.delivery.delivery.deliverymanagement.model.DeletedDelivery;
import ase.delivery.delivery.deliverymanagement.repository.DeletedDeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class DeletedDeliveryService {
    @Autowired
    private DeletedDeliveryRepository deletedDeliveryRepository;

    public DeletedDelivery createDeletedDelivery(DeletedDelivery deletedDelivery) {
        return deletedDeliveryRepository.save(deletedDelivery);

    }

    public List<DeletedDelivery> getAllDeletedDeliveries() {
        return deletedDeliveryRepository.findAllBy();
    }

}
