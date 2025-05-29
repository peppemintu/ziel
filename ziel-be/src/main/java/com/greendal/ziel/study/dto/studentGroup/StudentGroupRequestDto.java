package com.greendal.ziel.study.dto.studentGroup;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentGroupRequestDto {
    private Long specialtyId;
    private short groupNumber;
}
