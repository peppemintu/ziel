package com.greendal.ziel.study.controller;

import com.greendal.ziel.study.dto.grades.FinalGradeRequestDto;
import com.greendal.ziel.study.dto.grades.FinalGradeResponseDto;
import com.greendal.ziel.study.service.FinalGradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/final-grade")
@RequiredArgsConstructor
public class FinalGradeController {
    private final FinalGradeService finalGradeService;

    @PostMapping
    public ResponseEntity<FinalGradeResponseDto> createFinalGrade(@RequestBody FinalGradeRequestDto dto) {
        return ResponseEntity.ok(finalGradeService.createFinalGrade(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FinalGradeResponseDto> getFinalGradeById(@PathVariable Long id) {
        return ResponseEntity.ok(finalGradeService.getFinalGradeById(id));
    }

    @GetMapping
    public ResponseEntity<List<FinalGradeResponseDto>> getAllFinalGrades() {
        return ResponseEntity.ok(finalGradeService.getAllFinalGrades());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FinalGradeResponseDto> updateFinalGrade(@PathVariable Long id,
                                                                  @RequestBody FinalGradeRequestDto dto) {
        return ResponseEntity.ok(finalGradeService.updateFinalGrade(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFinalGrade(@PathVariable Long id) {
        finalGradeService.deleteFinalGrade(id);
        return ResponseEntity.noContent().build();
    }
}
