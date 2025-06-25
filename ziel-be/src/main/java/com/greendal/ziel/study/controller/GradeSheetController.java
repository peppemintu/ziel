package com.greendal.ziel.study.controller;

import com.greendal.ziel.study.dto.grades.GradeSheetRequestDto;
import com.greendal.ziel.study.dto.grades.GradeSheetResponseDto;
import com.greendal.ziel.study.service.GradeSheetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/grade-sheet")
@RequiredArgsConstructor
public class GradeSheetController {
    private final GradeSheetService gradeSheetService;

    @PostMapping
    public ResponseEntity<GradeSheetResponseDto> createGradeSheet(@RequestBody GradeSheetRequestDto dto) {
        return ResponseEntity.ok(gradeSheetService.createGradeSheet(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GradeSheetResponseDto> getGradeSheetById(@PathVariable Long id) {
        return ResponseEntity.ok(gradeSheetService.getGradeSheetById(id));
    }

    @GetMapping
    public ResponseEntity<List<GradeSheetResponseDto>> getAllGradeSheets() {
        return ResponseEntity.ok(gradeSheetService.getAllGradeSheets());
    }

    @PutMapping("/{id}")
    public ResponseEntity<GradeSheetResponseDto> updateGradeSheet(@PathVariable Long id,
                                                                  @RequestBody GradeSheetRequestDto dto) {
        return ResponseEntity.ok(gradeSheetService.updateGradeSheet(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGradeSheet(@PathVariable Long id) {
        gradeSheetService.deleteGradeSheet(id);
        return ResponseEntity.noContent().build();
    }
}
