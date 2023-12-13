package ase.delivery.usermanagement.controller;


import ase.delivery.usermanagement.dto.LoginDto;
import ase.delivery.usermanagement.service.LoginService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class LoginController {

    final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping
    public ResponseEntity login(@RequestBody LoginDto loginDto) {
        try {
            return ResponseEntity.ok(loginService.login(loginDto.getEmail(), loginDto.getPassword(), loginDto.getUserRole()));
        } catch (Exception e) {
            return new ResponseEntity<String>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
    }
}
