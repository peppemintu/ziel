package com.greendal.ziel.study.service;

import com.greendal.ziel.study.dto.element.ElementRequestDto;
import com.greendal.ziel.study.dto.element.ElementResponseDto;
import com.greendal.ziel.study.mapper.ElementMapper;
import com.greendal.ziel.study.model.Element;
import com.greendal.ziel.study.repository.ElementRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ElementService {
    private final ElementRepository planRepository;
    private final ElementMapper planMapper;

    public ElementResponseDto createElement(ElementRequestDto dto) {
        Element element = planMapper.toEntity(dto);
        return planMapper.toDto(planRepository.save(element));
    }

    public ElementResponseDto getElementById(Long id) {
        return planMapper.toDto(getElementEntityById(id));
    }

    public Element getElementEntityById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Element not found with id " + id));
    }

    public List<ElementResponseDto> getAllElements() {
        return planMapper.toDtoList(planRepository.findAll());
    }

    public ElementResponseDto updateElement(Long id, ElementRequestDto dto) {
        Element existing = planRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Element not found with id " + id));
        planMapper.updateElementFromDto(dto, existing);
        return planMapper.toDto(planRepository.save(existing));
    }

    public void deleteElement(Long id) {
        if (!planRepository.existsById(id)) {
            throw new EntityNotFoundException("Element not found with id " + id);
        }
        planRepository.deleteById(id);
    }
}
