package com.greendal.ziel.study.service;

import com.greendal.ziel.study.dto.studentGroup.StudentGroupRequestDto;
import com.greendal.ziel.study.dto.studentGroup.StudentGroupResponseDto;
import com.greendal.ziel.study.mapper.StudentGroupMapper;
import com.greendal.ziel.study.model.StudentGroup;
import com.greendal.ziel.study.repository.StudentGroupRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentGroupService {
    private final StudentGroupRepository studentGroupRepository;
    private final StudentGroupMapper studentGroupMapper;

    public StudentGroupResponseDto createStudentGroup(StudentGroupRequestDto dto) {
        StudentGroup studentGroup = studentGroupMapper.toEntity(dto);
        return studentGroupMapper.toDto(studentGroupRepository.save(studentGroup));
    }

    public StudentGroupResponseDto getStudentGroupById(Long id) {
        return studentGroupMapper.toDto(getStudentGroupEntityById(id));
    }

    public StudentGroup getStudentGroupEntityById(Long id) {
        return studentGroupRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StudentGroup not found with id " + id));
    }

    public List<StudentGroupResponseDto> getAllStudentGroups() {
        return studentGroupMapper.toDtoList(studentGroupRepository.findAll());
    }

    public StudentGroupResponseDto updateStudentGroup(Long id, StudentGroupRequestDto dto) {
        StudentGroup existing = studentGroupRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StudentGroup not found with id " + id));
        studentGroupMapper.updateStudentGroupFromDto(dto, existing);
        return studentGroupMapper.toDto(studentGroupRepository.save(existing));
    }

    public void deleteStudentGroup(Long id) {
        if (!studentGroupRepository.existsById(id)) {
            throw new EntityNotFoundException("StudentGroup not found with id " + id);
        }
        studentGroupRepository.deleteById(id);
    }
}

