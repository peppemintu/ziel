package com.greendal.ziel.course.service;

import com.greendal.ziel.course.dto.LabworkDto;
import com.greendal.ziel.course.mapper.LabworkMapper;
import com.greendal.ziel.course.model.Course;
import com.greendal.ziel.course.model.map.Labwork;
import com.greendal.ziel.course.repository.CourseRepository;
import com.greendal.ziel.course.repository.map.LabworkRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LabworkService {
    private final LabworkRepository labworkRepository;
    private final CourseRepository courseRepository;
    private final LabworkMapper labworkMapper;

    public Labwork createLabwork(LabworkDto dto) {
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new EntityNotFoundException("Course not found: " + dto.getCourseId()));
        Labwork labwork = labworkMapper.toEntity(dto, course);
        return labworkRepository.save(labwork);
    }

    public Labwork getLabworkById(UUID labworkId) {
        return labworkRepository.findById(labworkId)
                .orElseThrow(() -> new EntityNotFoundException("Labwork not found with id: " + labworkId));
    }

    public List<Labwork> getAllLabworks() {
        return labworkRepository.findAll();
    }

    public Labwork updateLabwork(UUID labworkId, LabworkDto dto) {
        Labwork existing = getLabworkById(labworkId);
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new EntityNotFoundException("Course not found: " + dto.getCourseId()));
        labworkMapper.updateEntityFromDto(dto, course, existing);
        return labworkRepository.save(existing);
    }

    public void deleteLabwork(UUID labworkId) {
        if (!labworkRepository.existsById(labworkId)) {
            throw new EntityNotFoundException("Labwork not found with id: " + labworkId);
        }
        labworkRepository.deleteById(labworkId);
    }
}
