package com.greendal.ziel.study.service;

import com.greendal.ziel.study.dto.grades.FinalGradeRequestDto;
import com.greendal.ziel.study.dto.grades.FinalGradeResponseDto;
import com.greendal.ziel.study.mapper.FinalGradeMapper;
import com.greendal.ziel.study.model.FinalGrade;
import com.greendal.ziel.study.repository.FinalGradeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FinalGradeService {
    private final FinalGradeRepository finalGradeRepository;
    private final FinalGradeMapper finalGradeMapper;

    public FinalGradeResponseDto createFinalGrade(FinalGradeRequestDto dto) {
        return finalGradeMapper.toDto(
                finalGradeRepository.save(
                        finalGradeMapper.toEntity(dto)
                )
        );
    }

    public FinalGradeResponseDto getFinalGradeById(Long id) {
        return finalGradeMapper.toDto(getFinalGradeEntityById(id));
    }

    public FinalGrade getFinalGradeEntityById(Long id) {
        return finalGradeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("FinalGrade not found with id " + id));
    }

    public List<FinalGradeResponseDto> getAllFinalGrades() {
        return finalGradeMapper.toDtoList(finalGradeRepository.findAll());
    }

    public FinalGradeResponseDto updateFinalGrade(Long id, FinalGradeRequestDto dto) {
        FinalGrade existing = finalGradeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("FinalGrade not found with id " + id));
        finalGradeMapper.updateFinalGradeFromDto(dto, existing);
        return finalGradeMapper.toDto(finalGradeRepository.save(existing));
    }

    public void deleteFinalGrade(Long id) {
        if (!finalGradeRepository.existsById(id)) {
            throw new EntityNotFoundException("FinalGrade not found with id " + id);
        }
        finalGradeRepository.deleteById(id);
    }
}
