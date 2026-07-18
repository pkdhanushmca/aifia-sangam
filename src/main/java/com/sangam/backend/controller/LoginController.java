package com.sangam.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sangam.backend.dto.LoginRequest;
import com.sangam.backend.model.User;
import com.sangam.backend.service.UserService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class LoginController {

	private final UserService service;

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request,
	                               HttpSession session) {

	    User user = service.login(request.getUsername(), request.getPassword());

	    if (user == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body("Invalid username or password");
	    }

	    session.setAttribute("loggedUser", user.getId());

	    Map<String, Object> response = new HashMap<>();
	    response.put("success", true);
	    response.put("message", "Login Success");
	    response.put("username", user.getUsername());

	    return ResponseEntity.ok(response);
	}
	
	@PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {

        session.invalidate();

        return ResponseEntity.ok("Logout Success");
    }

}