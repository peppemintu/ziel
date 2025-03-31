package com.greendal.ziel.auth.dto;

import com.greendal.ziel.auth.model.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String email;
    private String username;
    private String password;
    private Role role;
}
