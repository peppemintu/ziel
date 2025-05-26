package com.greendal.ziel.study.dto.studyPlan;

import com.greendal.ziel.study.model.AttestationForm;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyPlanResponseDto {
    private Long id;
    private short studyYear;
    private short semester;
    private short totalHours;
    private short creditUnits;
    private short totalAuditoryHours;
    private short lectureHours;
    private short practiceHours;
    private short labHours;
    private AttestationForm attestationForm;
    private Long disciplineId;
    private Long specialtyId;
}
