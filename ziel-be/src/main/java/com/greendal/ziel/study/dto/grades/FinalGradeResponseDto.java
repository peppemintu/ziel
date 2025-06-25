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
public class FinalGradeResponseDto {
    private Long id;
    private short ticketNumber;
    private short numericGrade;
    private Long gradeSheetId;
    private Long studentId;
}
