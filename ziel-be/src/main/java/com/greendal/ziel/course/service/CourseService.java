package com.greendal.ziel.course.service;

import com.greendal.ziel.course.dto.CourseDto;
import com.greendal.ziel.course.mapper.CourseMapper;
import com.greendal.ziel.course.model.Course;
import com.greendal.ziel.course.repository.CourseRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;

    public Course createCourse(CourseDto dto) {
        Course course = CourseMapper.INSTANCE.toEntity(dto);
        return courseRepository.save(course);
    }

    public Course getCourseById(UUID courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Course not found with id: " + courseId));
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course updateCourse(UUID courseId, CourseDto dto) {
        Course existing = getCourseById(courseId);
        CourseMapper.INSTANCE.updateEntityFromDto(dto, existing);
        return courseRepository.save(existing);
    }

    public void deleteCourse(UUID courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new EntityNotFoundException("Course not found with id: " + courseId);
        }
        courseRepository.deleteById(courseId);
    }
}
