package com.greendal.ziel.auth.dto;

import com.greendal.ziel.auth.model.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String email;
    private String name;
    private String surname;
    private Role role;
}
