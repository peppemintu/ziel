package com.greendal.ziel.study.controller;

import com.greendal.ziel.study.dto.element.ElementProgressRequestDto;
import com.greendal.ziel.study.dto.element.ElementProgressResponseDto;
import com.greendal.ziel.study.service.ElementProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/progress")
@RequiredArgsConstructor
public class ElementProgressController {
    private final ElementProgressService elementProgressService;

    @PostMapping
    public ResponseEntity<ElementProgressResponseDto> createElementProgress(@RequestBody ElementProgressRequestDto dto) {
        return ResponseEntity.ok(elementProgressService.createElementProgress(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ElementProgressResponseDto> getElementProgressById(@PathVariable Long id) {
        return ResponseEntity.ok(elementProgressService.getElementProgressById(id));
    }

    @GetMapping
    public ResponseEntity<List<ElementProgressResponseDto>> getAllElementProgresss() {
        return ResponseEntity.ok(elementProgressService.getAllElementProgresss());
    }

    @GetMapping("/element/{elementId}")
    public ResponseEntity<List<ElementProgressResponseDto>> getProgressesByElementId(@PathVariable Long elementId) {
        return ResponseEntity.ok(elementProgressService.getProgressesByElement(elementId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ElementProgressResponseDto> updateElementProgress(@PathVariable Long id,
                                                                  @RequestBody ElementProgressRequestDto dto) {
        return ResponseEntity.ok(elementProgressService.updateElementProgress(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteElementProgress(@PathVariable Long id) {
        elementProgressService.deleteElementProgress(id);
        return ResponseEntity.noContent().build();
    }
}
