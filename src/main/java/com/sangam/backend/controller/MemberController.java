package com.sangam.backend.controller;

import com.sangam.backend.dto.MemberRequest;
import com.sangam.backend.model.Member;
import com.sangam.backend.service.MemberService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // Called by the HTML form on submit
    @PostMapping
    public ResponseEntity<Member> register(@Valid @RequestBody MemberRequest request) {
        Member saved = memberService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<?> getAll(HttpSession session) {
    	
    	if (session.getAttribute("loggedUser") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please Login");
        }
    	
        return ResponseEntity.ok(memberService.getAll());
    }

    // Turns validation failures into a clean {field: message} JSON response
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(
            org.springframework.web.bind.MethodArgumentNotValidException ex) {
        Map<String, String> errors = new java.util.HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }
}
