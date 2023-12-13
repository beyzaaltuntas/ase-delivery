package ase.delivery.usermanagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;


import java.io.InputStream;
import java.security.*;
import java.security.cert.Certificate;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Value("${app.security.jwt.keyPath}")
    private String keyPath;

    @Value("${app.security.jwt.keyPassword}")
    private String keyPassword;

    @Value("${app.security.jwt.alias}")
    private String keyAlias;

    @Value("${app.security.jwt.passphrase}")
    private String passPhrase;

    @Bean
    public KeyStore keyStore() {
        try {
            KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
            InputStream resourceAsStream = Thread.currentThread()
                    .getContextClassLoader()
                    .getResourceAsStream(keyPath);
            keyStore.load(resourceAsStream, keyPassword.toCharArray());
            return keyStore;
        } catch (Exception e) {
        }

        throw new IllegalStateException("Unable to load keyPath!");
    }

    @Bean
    public RSAPrivateKey jwtSigningKey(KeyStore keyStore) {
        try {
            Key key = keyStore.getKey(keyAlias, passPhrase.toCharArray());
            if (key instanceof RSAPrivateKey) {
                return (RSAPrivateKey) key;
            }
        } catch (Exception e) {
        }

        throw new IllegalStateException("Unable to load  RSAPrivateKey!");
    }

    @Bean
    public RSAPublicKey jwtValidationKey(KeyStore keyStore) {
        try {
            Certificate certificate = keyStore.getCertificate(keyAlias);
            PublicKey publicKey = certificate.getPublicKey();

            if (publicKey instanceof RSAPublicKey) {
                return (RSAPublicKey) publicKey;
            }
        } catch (Exception e) {
        }

        throw new IllegalStateException ("Unable to load RSAPublicKey!");
    }

    @Bean
    public JwtDecoder jwtDecoder(RSAPublicKey rsaPublicKey) {
        return NimbusJwtDecoder.withPublicKey(rsaPublicKey).build();
    }




    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.cors().and().csrf().disable()
                    .authorizeHttpRequests((requests) -> requests
                            .requestMatchers("/**").permitAll())
                    .oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt);
            return http.build();

    }
}
