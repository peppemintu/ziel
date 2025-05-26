package com.greendal.ziel.study.dto.discipline;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DisciplineResponseDto {
    private Long id;
    private String name;
    private String abbreviation;
}
