package com.greendal.ziel.study.controller;

import com.greendal.ziel.study.dto.discipline.DisciplineRequestDto;
import com.greendal.ziel.study.dto.discipline.DisciplineResponseDto;
import com.greendal.ziel.study.service.DisciplineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/discipline")
@RequiredArgsConstructor
public class DisciplineController {
    private final DisciplineService disciplineService;

    @PostMapping
    public ResponseEntity<DisciplineResponseDto> createDiscipline(@RequestBody DisciplineRequestDto dto) {
        return ResponseEntity.ok(disciplineService.createDiscipline(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisciplineResponseDto> getDisciplineById(@PathVariable Long id) {
        return ResponseEntity.ok(disciplineService.getDisciplineById(id));
    }

    @GetMapping
    public ResponseEntity<List<DisciplineResponseDto>> getAllDisciplines() {
        return ResponseEntity.ok(disciplineService.getAllDisciplines());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DisciplineResponseDto> updateDiscipline(@PathVariable Long id,
                                                                  @RequestBody DisciplineRequestDto dto) {
        return ResponseEntity.ok(disciplineService.updateDiscipline(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscipline(@PathVariable Long id) {
        disciplineService.deleteDiscipline(id);
        return ResponseEntity.noContent().build();
    }
}
