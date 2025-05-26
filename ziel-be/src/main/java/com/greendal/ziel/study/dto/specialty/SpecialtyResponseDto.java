package com.greendal.ziel.study.dto.specialty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpecialtyResponseDto {
    private Long id;
    private String code;
    private String name;
    private String abbreviation;
}
