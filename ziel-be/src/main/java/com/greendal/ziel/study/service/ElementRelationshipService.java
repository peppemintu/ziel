package com.greendal.ziel.study.service;

import com.greendal.ziel.study.dto.element.ElementRelationshipRequestDto;
import com.greendal.ziel.study.dto.element.ElementRelationshipResponseDto;
import com.greendal.ziel.study.mapper.ElementRelationshipMapper;
import com.greendal.ziel.study.model.ElementRelationship;
import com.greendal.ziel.study.repository.ElementRelationshipRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ElementRelationshipService {
    private final ElementRelationshipRepository planRepository;
    private final ElementRelationshipMapper planMapper;

    public ElementRelationshipResponseDto createElementRelationship(ElementRelationshipRequestDto dto) {
        ElementRelationship elementRelationship = planMapper.toEntity(dto);
        return planMapper.toDto(planRepository.save(elementRelationship));
    }

    public ElementRelationshipResponseDto getElementRelationshipById(Long id) {
        return planMapper.toDto(getElementRelationshipEntityById(id));
    }

    public ElementRelationship getElementRelationshipEntityById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ElementRelationship not found with id " + id));
    }

    public List<ElementRelationshipResponseDto> getAllElementRelationships() {
        return planMapper.toDtoList(planRepository.findAll());
    }

    public ElementRelationshipResponseDto updateElementRelationship(Long id, ElementRelationshipRequestDto dto) {
        ElementRelationship existing = planRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ElementRelationship not found with id " + id));
        planMapper.updateElementRelationshipFromDto(dto, existing);
        return planMapper.toDto(planRepository.save(existing));
    }

    public void deleteElementRelationship(Long id) {
        if (!planRepository.existsById(id)) {
            throw new EntityNotFoundException("ElementRelationship not found with id " + id);
        }
        planRepository.deleteById(id);
    }
}
