package ase.delivery.delivery.deliverymanagement.service;

import ase.delivery.delivery.deliverymanagement.model.PickupBox;
import ase.delivery.delivery.deliverymanagement.repository.PickupBoxRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PickupBoxService {
    @Autowired
    private PickupBoxRepository pickupBoxRepository;

    public PickupBox createPickupBox(PickupBox pickupBox) {
        return pickupBoxRepository.save(pickupBox);

    }

    public PickupBox findByName(String name) {
        return pickupBoxRepository.findByName(name);

    }

    public List<PickupBox> getAllPickupBoxes() {
        return pickupBoxRepository.findAllBy();
    }

    public List<PickupBox> getAllPickupBoxesInList(List<String> idList) {
        return pickupBoxRepository.findByIdIn(idList);
    }


    public PickupBox findById(String id) {
        return pickupBoxRepository.findPickupBoxById(id);
    }

    public boolean deletePickupBox(String id) {
        return pickupBoxRepository.deletePickupBoxById(id) > 0;
    }

    public PickupBox findByRaspberryId(String raspberryId) {
        return pickupBoxRepository.findByRaspberryId(raspberryId);
    }
}