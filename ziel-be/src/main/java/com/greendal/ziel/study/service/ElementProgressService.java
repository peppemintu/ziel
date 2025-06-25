package com.greendal.ziel.study.service;

import com.greendal.ziel.study.dto.element.ElementProgressRequestDto;
import com.greendal.ziel.study.dto.element.ElementProgressResponseDto;
import com.greendal.ziel.study.mapper.ElementProgressMapper;
import com.greendal.ziel.study.model.ElementProgress;
import com.greendal.ziel.study.repository.ElementProgressRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ElementProgressService {
    private final ElementProgressRepository planRepository;
    private final ElementProgressMapper planMapper;

    public ElementProgressResponseDto createElementProgress(ElementProgressRequestDto dto) {
        ElementProgress elementProgress = planMapper.toEntity(dto);
        return planMapper.toDto(planRepository.save(elementProgress));
    }

    public ElementProgressResponseDto getElementProgressById(Long id) {
        return planMapper.toDto(getElementProgressEntityById(id));
    }

    public ElementProgress getElementProgressEntityById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ElementProgress not found with id " + id));
    }

    public List<ElementProgressResponseDto> getAllElementProgresss() {
        return planMapper.toDtoList(planRepository.findAll());
    }

    public List<ElementProgressResponseDto> getProgressesByElement(Long elementId) {
        return planMapper.toDtoList(planRepository.findByElementId(elementId));
    }

    public ElementProgressResponseDto updateElementProgress(Long id, ElementProgressRequestDto dto) {
        ElementProgress existing = planRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ElementProgress not found with id " + id));
        planMapper.updateElementProgressFromDto(dto, existing);
        return planMapper.toDto(planRepository.save(existing));
    }

    public void deleteElementProgress(Long id) {
        if (!planRepository.existsById(id)) {
            throw new EntityNotFoundException("ElementProgress not found with id " + id);
        }
        planRepository.deleteById(id);
    }
}
