package com.greendal.ziel.study.dto.element;

import com.greendal.ziel.study.model.ProgressStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ElementProgressRequestDto {
    private ProgressStatus status;
    private Integer grade;
    private Long elementId;
    private Long studentId;
}
