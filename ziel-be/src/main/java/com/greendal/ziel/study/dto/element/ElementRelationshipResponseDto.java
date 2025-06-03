package com.greendal.ziel.study.dto.element;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ElementRelationshipResponseDto {
    private Long id;
    private Long sourceElementId;
    private Long targetElementId;
}
