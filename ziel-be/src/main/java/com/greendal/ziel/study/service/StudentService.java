package com.greendal.ziel.study.service;

import com.greendal.ziel.study.dto.student.StudentRequestDto;
import com.greendal.ziel.study.dto.student.StudentResponseDto;
import com.greendal.ziel.study.mapper.StudentMapper;
import com.greendal.ziel.study.model.Student;
import com.greendal.ziel.study.repository.StudentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;

    public StudentResponseDto createStudent(StudentRequestDto dto) {
        Student student = studentMapper.toEntity(dto);
        return studentMapper.toDto(studentRepository.save(student));
    }

    public StudentResponseDto getStudentById(Long id) {
        return studentMapper.toDto(getStudentEntityById(id));
    }

    public Student getStudentEntityById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id " + id));
    }

    public List<StudentResponseDto> getAllStudents() {
        return studentMapper.toDtoList(studentRepository.findAll());
    }

    public StudentResponseDto updateStudent(Long id, StudentRequestDto dto) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id " + id));
        studentMapper.updateStudentFromDto(dto, existing);
        return studentMapper.toDto(studentRepository.save(existing));
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new EntityNotFoundException("Student not found with id " + id);
        }
        studentRepository.deleteById(id);
    }
}

