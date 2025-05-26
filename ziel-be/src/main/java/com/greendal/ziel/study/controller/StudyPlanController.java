package com.greendal.ziel.study.controller;

import com.greendal.ziel.study.dto.studyPlan.StudyPlanRequestDto;
import com.greendal.ziel.study.dto.studyPlan.StudyPlanResponseDto;
import com.greendal.ziel.study.service.StudyPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plan")
@RequiredArgsConstructor
public class StudyPlanController {
    private final StudyPlanService service;

    @PostMapping
    public ResponseEntity<StudyPlanResponseDto> create(@RequestBody StudyPlanRequestDto dto) {
        return ResponseEntity.ok(service.createStudyPlan(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudyPlanResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getStudyPlanById(id));
    }

    @GetMapping
    public ResponseEntity<List<StudyPlanResponseDto>> getAll() {
        return ResponseEntity.ok(service.getAllStudyPlans());
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudyPlanResponseDto> update(@PathVariable Long id, @RequestBody StudyPlanRequestDto dto) {
        return ResponseEntity.ok(service.updateStudyPlan(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteStudyPlan(id);
        return ResponseEntity.noContent().build();
    }
}
