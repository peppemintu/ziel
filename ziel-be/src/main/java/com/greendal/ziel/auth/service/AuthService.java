package com.greendal.ziel.auth.service;

import com.greendal.ziel.auth.dto.AuthRequest;
import com.greendal.ziel.auth.dto.RegisterRequest;
import com.greendal.ziel.auth.model.User;
import com.greendal.ziel.auth.repository.UserRepository;
import com.greendal.ziel.auth.util.JwtTokenUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public void login(AuthRequest authRequest, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
        );

        Map<String, String> tokens =
                generateTokens(authRequest.getEmail());

        setAuthCookies(response, tokens.get("accessToken"), tokens.get("refreshToken"));
    }

    public void logout(HttpServletResponse response) {
        ResponseCookie accessClear = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(false) //set true for https
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        ResponseCookie refreshClear = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader("Set-Cookie", accessClear.toString());
        response.addHeader("Set-Cookie", refreshClear.toString());
    }

    public void refreshAccessToken(String refreshToken, HttpServletResponse response) {
        String email = jwtTokenUtil.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        if (!jwtTokenUtil.validateToken(refreshToken, userDetails)) {
            throw new SecurityException("Invalid refresh token");
        }

        Map<String, String> tokens =
                generateTokens(email);

        setAuthCookies(response, tokens.get("accessToken"), tokens.get("refreshToken"));
    }

    public void register(RegisterRequest registerRequest, HttpServletResponse response) {
        User newUser = new User();
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setName(registerRequest.getName());
        newUser.setSurname(registerRequest.getSurname());
        newUser.setRole(registerRequest.getRole());

        userRepository.save(newUser);

        Map<String, String> tokens =
                generateTokens(newUser.getEmail());

        setAuthCookies(response, tokens.get("accessToken"), tokens.get("refreshToken"));
    }

    private Map<String, String> generateTokens(String email) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String accessToken = jwtTokenUtil.generateAccessToken(userDetails);
        String refreshToken = jwtTokenUtil.generateRefreshToken(userDetails);

        return Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken
        );
    }

    private void setAuthCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(60 * 30)
                .sameSite("Lax")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(60 * 60 * 24 * 7)
                .sameSite("Lax")
                .build();

        response.addHeader("Set-Cookie", accessCookie.toString());
        response.addHeader("Set-Cookie", refreshCookie.toString());
    }
}
