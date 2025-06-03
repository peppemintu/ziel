package com.greendal.ziel.study.dto.element;

import com.greendal.ziel.study.model.AttestationForm;
import com.greendal.ziel.study.model.ElementType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ElementRequestDto {
    private Short hours;
    private ElementType elementType;
    private AttestationForm attestationForm;
    private Long courseId;
}
