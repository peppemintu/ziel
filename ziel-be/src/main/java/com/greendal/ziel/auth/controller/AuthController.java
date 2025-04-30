package com.greendal.ziel.auth.controller;

import com.greendal.ziel.auth.dto.AuthRequest;
import com.greendal.ziel.auth.dto.RegisterRequest;
import com.greendal.ziel.auth.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public void login(@RequestBody AuthRequest authRequest,
                      HttpServletResponse response) {
        authService.login(authRequest, response);
    }

    @PreAuthorize("hasAnyRole('STUDENT','TEACHER', 'ADMIN')")
    @PostMapping("/refresh")
    public void refreshAccessToken(HttpServletResponse response,
                                   @CookieValue(value = "refreshToken") String refreshToken) {
        authService.refreshAccessToken(refreshToken, response);
    }

    @PostMapping("/register")
    public void register(@RequestBody RegisterRequest registerRequest,
                         HttpServletResponse response) {
        authService.register(registerRequest, response);
    }
}
