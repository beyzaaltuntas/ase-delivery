package ase.delivery.usermanagement.util;

import ase.delivery.usermanagement.dto.LoginResponseDto;
import ase.delivery.usermanagement.model.UserRole;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.stereotype.Component;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;

@Component
public class JwtCreator {
    private  RSAPrivateKey rsaPrivateKey;
    private  RSAPublicKey rsaPublicKey;

    public JwtCreator(RSAPrivateKey rsaPrivateKey, RSAPublicKey rsaPublicKey) {
        this.rsaPrivateKey = rsaPrivateKey;
        this.rsaPublicKey = rsaPublicKey;
    }

    public LoginResponseDto createJWT(String subject, Map<String, String> claimsMap, UserRole userRole) {
        Calendar expireCalendar = Calendar.getInstance();
        expireCalendar.setTime(new Date());
        expireCalendar.add(Calendar.HOUR, 1);
        Date expireDate =expireCalendar.getTime();
        JWTCreator.Builder jwtBuilder = JWT.create().withSubject(subject);
        claimsMap.forEach(jwtBuilder::withClaim);
        return new LoginResponseDto(jwtBuilder
                .withNotBefore(new Date())
                .withExpiresAt(expireDate)
                .sign(Algorithm.RSA256(rsaPublicKey, rsaPrivateKey)),userRole);
    }
}
