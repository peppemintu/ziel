package com.greendal.ziel.study.service;

import com.greendal.ziel.study.dto.discipline.DisciplineRequestDto;
import com.greendal.ziel.study.dto.discipline.DisciplineResponseDto;
import com.greendal.ziel.study.mapper.DisciplineMapper;
import com.greendal.ziel.study.model.Discipline;
import com.greendal.ziel.study.repository.DisciplineRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DisciplineService {
    private final DisciplineRepository disciplineRepository;
    private final DisciplineMapper disciplineMapper;

    public DisciplineResponseDto createDiscipline(DisciplineRequestDto dto) {
        return disciplineMapper.toDto(
                disciplineRepository.save(
                        disciplineMapper.toEntity(dto)
                )
        );
    }

    public DisciplineResponseDto getDisciplineById(Long id) {
        return disciplineMapper.toDto(disciplineRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Discipline not found")));
    }

    public List<DisciplineResponseDto> getAllDisciplines() {
        return disciplineMapper.toDtoList(disciplineRepository.findAll());
    }

    public DisciplineResponseDto updateDiscipline(Long id, DisciplineRequestDto dto) {
        Discipline existing = disciplineRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Discipline not found"));
        disciplineMapper.updateDisciplineFromDto(dto, existing);
        return disciplineMapper.toDto(disciplineRepository.save(existing));
    }

    public void deleteDiscipline(Long id) {
        if (!disciplineRepository.existsById(id)) {
            throw new EntityNotFoundException("Discipline not found");
        }
        disciplineRepository.deleteById(id);
    }
}
