package com.greendal.ziel.study.controller;

import com.greendal.ziel.study.dto.element.ElementRelationshipRequestDto;
import com.greendal.ziel.study.dto.element.ElementRelationshipResponseDto;
import com.greendal.ziel.study.service.ElementRelationshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/relationship")
@RequiredArgsConstructor
public class ElementRelationshipController {
    private final ElementRelationshipService elementRelationshipService;

    @PostMapping
    public ResponseEntity<ElementRelationshipResponseDto> createElementRelationship(@RequestBody ElementRelationshipRequestDto dto) {
        return ResponseEntity.ok(elementRelationshipService.createElementRelationship(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ElementRelationshipResponseDto> getElementRelationshipById(@PathVariable Long id) {
        return ResponseEntity.ok(elementRelationshipService.getElementRelationshipById(id));
    }

    @GetMapping
    public ResponseEntity<List<ElementRelationshipResponseDto>> getAllElementRelationships() {
        return ResponseEntity.ok(elementRelationshipService.getAllElementRelationships());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ElementRelationshipResponseDto> updateElementRelationship(@PathVariable Long id,
                                                                  @RequestBody ElementRelationshipRequestDto dto) {
        return ResponseEntity.ok(elementRelationshipService.updateElementRelationship(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteElementRelationship(@PathVariable Long id) {
        elementRelationshipService.deleteElementRelationship(id);
        return ResponseEntity.noContent().build();
    }
}
