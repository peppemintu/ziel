package com.greendal.ziel.course.controller;

import com.greendal.ziel.course.dto.LabworkCompletionDto;
import com.greendal.ziel.course.model.LabworkCompletion;
import com.greendal.ziel.course.service.LabworkCompletionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/labwork/completion")
@RequiredArgsConstructor
public class LabworkCompletionController {
    private final LabworkCompletionService completionService;

    @PostMapping
    public LabworkCompletion createOrUpdate(@RequestBody LabworkCompletionDto dto) {
        return completionService.createOrUpdate(dto);
    }

    @GetMapping("/{labworkId}/{userId}")
    public LabworkCompletion getCompletion(@PathVariable UUID labworkId, @PathVariable UUID userId) {
        return completionService.getCompletion(labworkId, userId);
    }

    @GetMapping
    public List<LabworkCompletion> getAll() {
        return completionService.getAll();
    }

    @DeleteMapping("/{labworkId}/{userId}")
    public void delete(@PathVariable UUID labworkId, @PathVariable UUID userId) {
        completionService.delete(labworkId, userId);
    }
}
