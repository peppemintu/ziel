package com.greendal.ziel.study.controller;

import com.greendal.ziel.study.dto.courseTeacher.CourseTeacherRequestDto;
import com.greendal.ziel.study.dto.courseTeacher.CourseTeacherResponseDto;
import com.greendal.ziel.study.service.CourseTeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/courseTeacher")
@RequiredArgsConstructor
public class CourseTeacherController {
    private final CourseTeacherService courseTeacherService;

    @PostMapping
    public ResponseEntity<CourseTeacherResponseDto> createCourseTeacher(@RequestBody CourseTeacherRequestDto dto) {
        return ResponseEntity.ok(courseTeacherService.createCourseTeacher(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseTeacherResponseDto> getCourseTeacherById(@PathVariable Long id) {
        return ResponseEntity.ok(courseTeacherService.getCourseTeacherById(id));
    }

    @GetMapping
    public ResponseEntity<List<CourseTeacherResponseDto>> getAllCourseTeachers() {
        return ResponseEntity.ok(courseTeacherService.getAllCourseTeachers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseTeacherResponseDto> updateCourseTeacher(@PathVariable Long id,
                                                                  @RequestBody CourseTeacherRequestDto dto) {
        return ResponseEntity.ok(courseTeacherService.updateCourseTeacher(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourseTeacher(@PathVariable Long id) {
        courseTeacherService.deleteCourseTeacher(id);
        return ResponseEntity.noContent().build();
    }
}
