package com.greendal.ziel.study.dto.grades;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeSheetResponseDto {
    Long id;
    LocalDateTime dateHeld;
    Long courseId;
}

