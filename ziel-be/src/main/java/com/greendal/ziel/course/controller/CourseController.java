package com.greendal.ziel.course.controller;

import com.greendal.ziel.course.dto.CourseDto;
import com.greendal.ziel.course.model.Course;
import com.greendal.ziel.course.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/course")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;

    @PostMapping
    public Course createCourse(@RequestBody CourseDto courseDto) {
        return courseService.createCourse(courseDto);
    }

    @GetMapping("/{courseId}")
    public Course getCourseById(@PathVariable UUID courseId) {
        return courseService.getCourseById(courseId);
    }

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @PutMapping("/{courseId}")
    public Course updateCourse(@PathVariable UUID courseId, @RequestBody CourseDto courseDto) {
        return courseService.updateCourse(courseId, courseDto);
    }

    @DeleteMapping("/{courseId}")
    public void deleteCourse(@PathVariable UUID courseId) {
        courseService.deleteCourse(courseId);
    }
}
