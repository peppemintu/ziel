package com.greendal.ziel.course.controller;

import com.greendal.ziel.course.dto.RoadmapConnectionDto;
import com.greendal.ziel.course.model.map.RoadmapConnection;
import com.greendal.ziel.course.service.RoadmapConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/roadmap/connection")
@RequiredArgsConstructor
public class RoadmapConnectionController {
    private final RoadmapConnectionService connectionService;

    @PostMapping
    public RoadmapConnection createConnection(@RequestBody RoadmapConnectionDto dto) {
        return connectionService.createConnection(dto);
    }

    @GetMapping
    public List<RoadmapConnection> getAllConnections() {
        return connectionService.getAllConnections();
    }

    @GetMapping("/{id}")
    public RoadmapConnection getConnectionById(@PathVariable UUID id) {
        return connectionService.getConnectionById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteConnection(@PathVariable UUID id) {
        connectionService.deleteConnection(id);
    }
}
