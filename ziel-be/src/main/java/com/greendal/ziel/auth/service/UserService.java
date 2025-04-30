package com.greendal.ziel.auth.service;

import com.greendal.ziel.auth.dto.UserResponse;
import com.greendal.ziel.auth.model.User;
import com.greendal.ziel.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email);

        if (user == null)
            throw new UsernameNotFoundException("User not found with email: " + email);

        UserResponse userResponse = new UserResponse();
        userResponse.setEmail(user.getEmail());
        userResponse.setName(user.getName());
        userResponse.setSurname(user.getSurname());
        userResponse.setRole(user.getRole());

        return userResponse;
    }
}
