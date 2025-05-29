package com.greendal.ziel.study.service;

import com.greendal.ziel.study.dto.course.CourseRequestDto;
import com.greendal.ziel.study.dto.course.CourseResponseDto;
import com.greendal.ziel.study.mapper.CourseMapper;
import com.greendal.ziel.study.model.Course;
import com.greendal.ziel.study.repository.CourseRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;

    public CourseResponseDto createCourse(CourseRequestDto dto) {
        Course course = courseMapper.toEntity(dto);
        return courseMapper.toDto(courseRepository.save(course));
    }

    public CourseResponseDto getCourseById(Long id) {
        return courseMapper.toDto(getCourseEntityById(id));
    }

    public Course getCourseEntityById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Study course not found with id " + id));
    }

    public List<CourseResponseDto> getAllCourses() {
        return courseMapper.toDtoList(courseRepository.findAll());
    }

    public CourseResponseDto updateCourse(Long id, CourseRequestDto dto) {
        Course existing = courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Study course not found with id " + id));
        courseMapper.updateCourseFromDto(dto, existing);
        return courseMapper.toDto(courseRepository.save(existing));
    }

    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new EntityNotFoundException("Study course not found with id " + id);
        }
        courseRepository.deleteById(id);
    }
}
