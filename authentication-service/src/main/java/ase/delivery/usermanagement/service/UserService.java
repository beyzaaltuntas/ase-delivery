package ase.delivery.usermanagement.service;

import ase.delivery.usermanagement.model.AseUser;
import ase.delivery.usermanagement.model.UserRole;
import ase.delivery.usermanagement.repository.UserRepository;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class UserService implements UserDetailsService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public UserService(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AseUser user = userRepository.findAseUserByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("No user found with the given email!");
        }
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), getAuthority(user));
    }

    public List<AseUser> getAll() {
        return userRepository.findAllBy();
    }

    public AseUser findUser(String email) {
        return userRepository.findAseUserByEmail(email);
    }

    public AseUser findUserById(String id) {
        return userRepository.findAseUserById(id);
    }

    private Set<SimpleGrantedAuthority> getAuthority(AseUser user) {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getUserRole()));
    }

    public List<AseUser> getUsersByRole(UserRole role) {
        return userRepository.findByUserRole(role);
    }

    ;


    public AseUser create(String email, String password, String rfidToken, UserRole role) {
        var user = new AseUser(email, password, rfidToken, role);
        user.setPassword(passwordEncoder.encode(password));
        return userRepository.save(user);
    }

    public AseUser update(String email, String password, String rfidToken, AseUser user) {
        user.setEmail(email);
        if (password != null) {
            user.setPassword(passwordEncoder.encode(password));
        }
        user.setRfidToken(rfidToken);
        return userRepository.save(user);
    }

    public AseUser findByRfidToken(String rfidToken) {
        return userRepository.findAseUserByRfidToken(rfidToken);
    }

    public AseUser findByToken(String tokenStr) {
        DecodedJWT decodedToken = JWT.decode(tokenStr);
        Map<String, Claim> claimMap = decodedToken.getClaims();
        String email = claimMap.get("username").asString();
        return userRepository.findAseUserByEmail(email);
    }

    public boolean deleteAseUser(String id) {
        return userRepository.deleteAseUserById(id) > 0;
    }


}
