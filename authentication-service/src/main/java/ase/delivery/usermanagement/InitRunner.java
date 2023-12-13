package ase.delivery.usermanagement;

import ase.delivery.usermanagement.model.AseUser;
import ase.delivery.usermanagement.model.UserRole;
import ase.delivery.usermanagement.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;


@Component
public class InitRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public InitRunner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        AseUser admin = userRepository.findAseUserByEmail("ase-delivery@gmail.com");
        if (admin == null) {
            String encodedPassword = passwordEncoder.encode("12345678");
            userRepository.save(new AseUser("ase-delivery@gmail.com", encodedPassword, null, UserRole.DISPATCHER));
        }
    }
}

