package com.greendal.ziel.study.service;

import com.greendal.ziel.study.dto.courseTeacher.CourseTeacherRequestDto;
import com.greendal.ziel.study.dto.courseTeacher.CourseTeacherResponseDto;
import com.greendal.ziel.study.mapper.CourseTeacherMapper;
import com.greendal.ziel.study.model.CourseTeacher;
import com.greendal.ziel.study.repository.CourseTeacherRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseTeacherService {
    private final CourseTeacherRepository courseTeacherRepository;
    private final CourseTeacherMapper courseTeacherMapper;

    public CourseTeacherResponseDto createCourseTeacher(CourseTeacherRequestDto dto) {
        CourseTeacher courseTeacher = courseTeacherMapper.toEntity(dto);
        return courseTeacherMapper.toDto(courseTeacherRepository.save(courseTeacher));
    }

    public CourseTeacherResponseDto getCourseTeacherById(Long id) {
        return courseTeacherMapper.toDto(getCourseTeacherEntityById(id));
    }

    public CourseTeacher getCourseTeacherEntityById(Long id) {
        return courseTeacherRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("CourseTeacher not found with id " + id));
    }

    public List<CourseTeacherResponseDto> getAllCourseTeachers() {
        return courseTeacherMapper.toDtoList(courseTeacherRepository.findAll());
    }

    public CourseTeacherResponseDto updateCourseTeacher(Long id, CourseTeacherRequestDto dto) {
        CourseTeacher existing = courseTeacherRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("CourseTeacher not found with id " + id));
        courseTeacherMapper.updateCourseTeacherFromDto(dto, existing);
        return courseTeacherMapper.toDto(courseTeacherRepository.save(existing));
    }

    public void deleteCourseTeacher(Long id) {
        if (!courseTeacherRepository.existsById(id)) {
            throw new EntityNotFoundException("CourseTeacher not found with id " + id);
        }
        courseTeacherRepository.deleteById(id);
    }
}
