package com.greendal.ziel.study.service;

import com.greendal.ziel.study.dto.specialty.SpecialtyRequestDto;
import com.greendal.ziel.study.dto.specialty.SpecialtyResponseDto;
import com.greendal.ziel.study.mapper.SpecialtyMapper;
import com.greendal.ziel.study.model.Specialty;
import com.greendal.ziel.study.repository.SpecialtyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpecialtyService {
    private final SpecialtyRepository specialtyRepository;
    private final SpecialtyMapper specialtyMapper;

    public SpecialtyResponseDto createSpecialty(SpecialtyRequestDto dto) {
        return specialtyMapper.toDto(
                specialtyRepository.save(
                        specialtyMapper.toEntity(dto)
                )
        );
    }

    public SpecialtyResponseDto getSpecialtyById(Long id) {
        return specialtyMapper.toDto(specialtyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Specialty not found")));
    }

    public List<SpecialtyResponseDto> getAllSpecialties() {
        return specialtyMapper.toDtoList(specialtyRepository.findAll());
    }

    public SpecialtyResponseDto updateSpecialty(Long id, SpecialtyRequestDto dto) {
        Specialty existing = specialtyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Specialty not found"));
        specialtyMapper.updateSpecialtyFromDto(dto, existing);
        return specialtyMapper.toDto(specialtyRepository.save(existing));
    }

    public void deleteSpecialty(Long id) {
        if (!specialtyRepository.existsById(id)) {
            throw new EntityNotFoundException("Specialty not found");
        }
        specialtyRepository.deleteById(id);
    }
}
