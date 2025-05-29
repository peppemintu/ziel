package com.greendal.ziel.study.service;

import com.greendal.ziel.study.dto.teacher.TeacherRequestDto;
import com.greendal.ziel.study.dto.teacher.TeacherResponseDto;
import com.greendal.ziel.study.mapper.TeacherMapper;
import com.greendal.ziel.study.model.Teacher;
import com.greendal.ziel.study.repository.TeacherRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherService {
    private final TeacherRepository teacherRepository;
    private final TeacherMapper teacherMapper;

    public TeacherResponseDto createTeacher(TeacherRequestDto dto) {
        Teacher teacher = teacherMapper.toEntity(dto);
        return teacherMapper.toDto(teacherRepository.save(teacher));
    }

    public TeacherResponseDto getTeacherById(Long id) {
        return teacherMapper.toDto(getTeacherEntityById(id));
    }

    public Teacher getTeacherEntityById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id " + id));
    }

    public List<TeacherResponseDto> getAllTeachers() {
        return teacherMapper.toDtoList(teacherRepository.findAll());
    }

    public TeacherResponseDto updateTeacher(Long id, TeacherRequestDto dto) {
        Teacher existing = teacherRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id " + id));
        teacherMapper.updateTeacherFromDto(dto, existing);
        return teacherMapper.toDto(teacherRepository.save(existing));
    }

    public void deleteTeacher(Long id) {
        if (!teacherRepository.existsById(id)) {
            throw new EntityNotFoundException("Teacher not found with id " + id);
        }
        teacherRepository.deleteById(id);
    }
}
