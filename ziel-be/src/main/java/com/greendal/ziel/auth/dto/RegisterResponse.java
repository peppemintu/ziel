package com.greendal.ziel.auth.dto;

import com.greendal.ziel.auth.model.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String patronymic;
    private Role role;
}
