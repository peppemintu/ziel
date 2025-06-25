package com.greendal.ziel.study.service;

import com.greendal.ziel.study.dto.grades.GradeSheetRequestDto;
import com.greendal.ziel.study.dto.grades.GradeSheetResponseDto;
import com.greendal.ziel.study.mapper.GradeSheetMapper;
import com.greendal.ziel.study.model.GradeSheet;
import com.greendal.ziel.study.repository.GradeSheetRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GradeSheetService {
    private final GradeSheetRepository gradeSheetRepository;
    private final GradeSheetMapper gradeSheetMapper;

    public GradeSheetResponseDto createGradeSheet(GradeSheetRequestDto dto) {
        return gradeSheetMapper.toDto(
                gradeSheetRepository.save(
                        gradeSheetMapper.toEntity(dto)
                )
        );
    }

    public GradeSheetResponseDto getGradeSheetById(Long id) {
        return gradeSheetMapper.toDto(getGradeSheetEntityById(id));
    }

    public GradeSheet getGradeSheetEntityById(Long id) {
        return gradeSheetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("GradeSheet not found with id " + id));
    }

    public List<GradeSheetResponseDto> getAllGradeSheets() {
        return gradeSheetMapper.toDtoList(gradeSheetRepository.findAll());
    }

    public GradeSheetResponseDto updateGradeSheet(Long id, GradeSheetRequestDto dto) {
        GradeSheet existing = gradeSheetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("GradeSheet not found with id " + id));
        gradeSheetMapper.updateGradeSheetFromDto(dto, existing);
        return gradeSheetMapper.toDto(gradeSheetRepository.save(existing));
    }

    public void deleteGradeSheet(Long id) {
        if (!gradeSheetRepository.existsById(id)) {
            throw new EntityNotFoundException("GradeSheet not found with id " + id);
        }
        gradeSheetRepository.deleteById(id);
    }
}
