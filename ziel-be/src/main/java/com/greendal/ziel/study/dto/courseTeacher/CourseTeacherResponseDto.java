package com.greendal.ziel.study.dto.courseTeacher;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseTeacherResponseDto {
    private Long id;
    private Long teacherId;
    private Long courseId;
}
