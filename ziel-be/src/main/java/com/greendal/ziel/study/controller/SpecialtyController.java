package com.greendal.ziel.study.controller;

import com.greendal.ziel.study.dto.specialty.SpecialtyRequestDto;
import com.greendal.ziel.study.dto.specialty.SpecialtyResponseDto;
import com.greendal.ziel.study.service.SpecialtyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specialty")
@RequiredArgsConstructor
public class SpecialtyController {
    private final SpecialtyService specialtyService;

    @PostMapping
    public ResponseEntity<SpecialtyResponseDto> createSpecialty(@RequestBody SpecialtyRequestDto dto) {
        return ResponseEntity.ok(specialtyService.createSpecialty(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpecialtyResponseDto> getSpecialtyById(@PathVariable Long id) {
        return ResponseEntity.ok(specialtyService.getSpecialtyById(id));
    }

    @GetMapping
    public ResponseEntity<List<SpecialtyResponseDto>> getAllSpecialties() {
        return ResponseEntity.ok(specialtyService.getAllSpecialties());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpecialtyResponseDto> updateSpecialty(@PathVariable Long id,
                                                                @RequestBody SpecialtyRequestDto dto) {
        return ResponseEntity.ok(specialtyService.updateSpecialty(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpecialty(@PathVariable Long id) {
        specialtyService.deleteSpecialty(id);
        return ResponseEntity.noContent().build();
    }
}
