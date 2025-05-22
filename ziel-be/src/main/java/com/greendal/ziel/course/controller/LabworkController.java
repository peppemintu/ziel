package com.greendal.ziel.course.controller;

import com.greendal.ziel.course.dto.LabworkDto;
import com.greendal.ziel.course.model.map.Labwork;
import com.greendal.ziel.course.service.LabworkService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/labwork")
@RequiredArgsConstructor
public class LabworkController {
    private final LabworkService labworkService;

    @PostMapping
    public Labwork createLabwork(@RequestBody LabworkDto dto) {
        return labworkService.createLabwork(dto);
    }

    @GetMapping("/{labworkId}")
    public Labwork getLabworkById(@PathVariable UUID labworkId) {
        return labworkService.getLabworkById(labworkId);
    }

    @GetMapping
    public List<Labwork> getAllLabworks() {
        return labworkService.getAllLabworks();
    }

    @PutMapping("/{labworkId}")
    public Labwork updateLabwork(@PathVariable UUID labworkId, @RequestBody LabworkDto dto) {
        return labworkService.updateLabwork(labworkId, dto);
    }

    @DeleteMapping("/{labworkId}")
    public void deleteLabwork(@PathVariable UUID labworkId) {
        labworkService.deleteLabwork(labworkId);
    }
}
