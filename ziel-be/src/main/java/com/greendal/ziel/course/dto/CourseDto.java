package com.greendal.ziel.course.dto;

import com.greendal.ziel.course.model.AttestationForm;
import lombok.Data;

@Data
public class CourseDto {
    private String courseName;
    private String majorCode;
    private String majorName;
    private int year;
    private int semester;
    private int totalHours;
    private int creditUnits;
    private int auditoryHoursTotal;
    private int lectures;
    private Integer labworks;
    private Integer practices;
    private AttestationForm attestationForm;
}
