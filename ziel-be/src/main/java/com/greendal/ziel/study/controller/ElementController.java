package com.greendal.ziel.study.controller;

import com.greendal.ziel.study.dto.element.ElementRequestDto;
import com.greendal.ziel.study.dto.element.ElementResponseDto;
import com.greendal.ziel.study.service.ElementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/element")
@RequiredArgsConstructor
public class ElementController {
    private final ElementService elementService;

    @PostMapping
    public ResponseEntity<ElementResponseDto> createElement(@RequestBody ElementRequestDto dto) {
        return ResponseEntity.ok(elementService.createElement(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ElementResponseDto> getElementById(@PathVariable Long id) {
        return ResponseEntity.ok(elementService.getElementById(id));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ElementResponseDto>> getElementsByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(elementService.getElementsByCourseId(courseId));
    }

    @GetMapping
    public ResponseEntity<List<ElementResponseDto>> getAllElements() {
        return ResponseEntity.ok(elementService.getAllElements());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ElementResponseDto> updateElement(@PathVariable Long id,
                                                                  @RequestBody ElementRequestDto dto) {
        return ResponseEntity.ok(elementService.updateElement(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteElement(@PathVariable Long id) {
        elementService.deleteElement(id);
        return ResponseEntity.noContent().build();
    }
}
