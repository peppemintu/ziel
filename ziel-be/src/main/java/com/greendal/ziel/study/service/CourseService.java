package com.greendal.ziel.study.service;

import com.greendal.ziel.auth.model.User;
import com.greendal.ziel.auth.repository.UserRepository;
import com.greendal.ziel.study.dto.course.CourseRequestDto;
import com.greendal.ziel.study.dto.course.CourseResponseDto;
import com.greendal.ziel.study.mapper.CourseMapper;
import com.greendal.ziel.study.model.Course;
import com.greendal.ziel.study.model.Student;
import com.greendal.ziel.study.repository.CourseRepository;
import com.greendal.ziel.study.repository.StudentRepository;
import com.greendal.ziel.study.repository.TeacherRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;

    public CourseResponseDto createCourse(CourseRequestDto dto) {
        Course course = courseMapper.toEntity(dto);
        return courseMapper.toDto(courseRepository.save(course));
    }

    public CourseResponseDto getCourseById(Long id) {
        return courseMapper.toDto(getCourseEntityById(id));
    }

    public List<CourseResponseDto> getCoursesByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        List<Course> courses;

        switch (user.getRole()) {
            case STUDENT -> {
                Student student = studentRepository.findByUserId(userId);
                if (student == null)
                    throw new EntityNotFoundException("Student not found for user ID: " + userId);
                Long groupId = student.getGroup().getId();
                courses = courseRepository.findByGroupId(groupId);
            }
            case TEACHER -> {
                courses = courseRepository.findAllByTeacherUserId(userId);
            }
            default -> throw new IllegalArgumentException("Unsupported role: " + user.getRole());
        }

        return courseMapper.toDtoList(courses);
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
