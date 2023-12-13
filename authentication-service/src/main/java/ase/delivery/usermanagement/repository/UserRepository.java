package ase.delivery.usermanagement.repository;

import ase.delivery.usermanagement.model.AseUser;
import ase.delivery.usermanagement.model.UserRole;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<AseUser,String> {
    AseUser findAseUserByEmail(String email);

    AseUser findAseUserById(String id);

    List<AseUser> findAllBy();

    List<AseUser> findByUserRole(UserRole role);

    int deleteAseUserById(String id);

    AseUser findAseUserByRfidToken(String rfidToken);
}
