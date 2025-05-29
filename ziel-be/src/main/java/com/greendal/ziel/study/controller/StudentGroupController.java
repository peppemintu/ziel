package com.greendal.ziel.study.controller;

import com.greendal.ziel.study.dto.studentGroup.StudentGroupRequestDto;
import com.greendal.ziel.study.dto.studentGroup.StudentGroupResponseDto;
import com.greendal.ziel.study.service.StudentGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/studentGroup")
@RequiredArgsConstructor
public class StudentGroupController {
    private final StudentGroupService studentGroupService;

    @PostMapping
    public ResponseEntity<StudentGroupResponseDto> createStudentGroup(@RequestBody StudentGroupRequestDto dto) {
        return ResponseEntity.ok(studentGroupService.createStudentGroup(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentGroupResponseDto> getStudentGroupById(@PathVariable Long id) {
        return ResponseEntity.ok(studentGroupService.getStudentGroupById(id));
    }

    @GetMapping
    public ResponseEntity<List<StudentGroupResponseDto>> getAllStudentGroups() {
        return ResponseEntity.ok(studentGroupService.getAllStudentGroups());
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentGroupResponseDto> updateStudentGroup(@PathVariable Long id,
                                                                  @RequestBody StudentGroupRequestDto dto) {
        return ResponseEntity.ok(studentGroupService.updateStudentGroup(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentGroup(@PathVariable Long id) {
        studentGroupService.deleteStudentGroup(id);
        return ResponseEntity.noContent().build();
    }
}
