package ase.delivery.usermanagement.service;

import ase.delivery.usermanagement.dto.LoginResponseDto;
import ase.delivery.usermanagement.model.UserRole;
import ase.delivery.usermanagement.util.JwtCreator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class LoginService {
    private final JwtCreator jwtCreator;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public LoginService(JwtCreator jwtCreator,
                        UserService userService,
                        PasswordEncoder passwordEncoder) {

        this.jwtCreator = jwtCreator;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDto login(String email, String password, UserRole role) {
        UserDetails userDetails = userService.loadUserByUsername(email);
        String authorityString = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        UserRole userRole;
        try {
            String userRoleString = authorityString.split("_")[1];
            userRole = UserRole.valueOf(userRoleString);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException();
        }
        System.out.println(userRole);
        System.out.println(role);
        if (!passwordEncoder.matches(password, userDetails.getPassword()) || !userRole.equals(role)) {
            throw new RuntimeException();
        }

        Map<String, String> claims = new HashMap<>();
        claims.put("username", email);

        claims.put("authorities", authorityString);

        return jwtCreator.createJWT(email, claims,userRole);
    }
}
