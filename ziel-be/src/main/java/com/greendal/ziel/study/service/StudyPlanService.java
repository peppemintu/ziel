package com.greendal.ziel.study.service;

import com.greendal.ziel.study.dto.studyPlan.StudyPlanRequestDto;
import com.greendal.ziel.study.dto.studyPlan.StudyPlanResponseDto;
import com.greendal.ziel.study.mapper.StudyPlanMapper;
import com.greendal.ziel.study.model.StudyPlan;
import com.greendal.ziel.study.repository.StudyPlanRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudyPlanService {
    private final StudyPlanRepository planRepository;
    private final StudyPlanMapper planMapper;

    public StudyPlanResponseDto createStudyPlan(StudyPlanRequestDto dto) {
        StudyPlan studyPlan = planMapper.toEntity(dto);
        return planMapper.toDto(planRepository.save(studyPlan));
    }

    public StudyPlanResponseDto getStudyPlanById(Long id) {
        return planMapper.toDto(planRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Study plan not found")));
    }

    public List<StudyPlanResponseDto> getAllStudyPlans() {
        return planMapper.toDtoList(planRepository.findAll());
    }

    public StudyPlanResponseDto updateStudyPlan(Long id, StudyPlanRequestDto dto) {
        StudyPlan existing = planRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Study plan not found"));
        planMapper.updateStudyPlanFromDto(dto, existing);
        return planMapper.toDto(planRepository.save(existing));
    }

    public void deleteStudyPlan(Long id) {
        if (!planRepository.existsById(id)) {
            throw new EntityNotFoundException("Study plan not found");
        }
        planRepository.deleteById(id);
    }
}
