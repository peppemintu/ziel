package com.greendal.ziel.auth.dto;

import com.greendal.ziel.auth.model.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String patronymic;
    private Role role;
}
