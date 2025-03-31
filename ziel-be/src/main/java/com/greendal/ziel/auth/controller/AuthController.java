package com.greendal.ziel.auth.controller;

import com.greendal.ziel.auth.dto.AuthRequest;
import com.greendal.ziel.auth.dto.RegisterRequest;
import com.greendal.ziel.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody AuthRequest authRequest) {
        return authService.login(authRequest);
    }

    @PreAuthorize("hasAnyRole('STUDENT','TEACHER', 'ADMIN')")
    @PostMapping("/refresh")
    public Map<String, String> refreshAccessToken(@RequestBody Map<String, String> request) {
        return authService.refreshAccessToken(request);
    }

    @PostMapping("/register")
    public void register(@RequestBody RegisterRequest registerRequest) {
        authService.register(registerRequest);
    }
}
