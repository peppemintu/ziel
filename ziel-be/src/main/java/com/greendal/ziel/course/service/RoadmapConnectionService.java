package com.greendal.ziel.course.service;

import com.greendal.ziel.course.dto.RoadmapConnectionDto;
import com.greendal.ziel.course.mapper.RoadmapConnectionMapper;
import com.greendal.ziel.course.mapper.RoadmapContext;
import com.greendal.ziel.course.model.Course;
import com.greendal.ziel.course.model.map.Element;
import com.greendal.ziel.course.model.map.RoadmapConnection;
import com.greendal.ziel.course.repository.CourseRepository;
import com.greendal.ziel.course.repository.map.ElementRepository;
import com.greendal.ziel.course.repository.map.RoadmapConnectionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoadmapConnectionService {
    private final RoadmapConnectionRepository connectionRepository;
    private final ElementRepository elementRepository;
    private final CourseRepository courseRepository;
    private final RoadmapConnectionMapper mapper;

    public RoadmapConnection createConnection(RoadmapConnectionDto dto) {
        Element source = elementRepository.findById(dto.getSourceId())
                .orElseThrow(() -> new EntityNotFoundException("Source element not found: " + dto.getSourceId()));
        Element target = elementRepository.findById(dto.getTargetId())
                .orElseThrow(() -> new EntityNotFoundException("Target element not found: " + dto.getTargetId()));
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new EntityNotFoundException("Course not found: " + dto.getCourseId()));

        RoadmapConnection connection = mapper.toEntity(dto, new RoadmapContext(source, target, course));
        return connectionRepository.save(connection);
    }

    public List<RoadmapConnection> getAllConnections() {
        return connectionRepository.findAll();
    }

    public RoadmapConnection getConnectionById(UUID id) {
        return connectionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Connection not found with id: " + id));
    }

    public void deleteConnection(UUID id) {
        if (!connectionRepository.existsById(id)) {
            throw new EntityNotFoundException("Connection not found with id: " + id);
        }
        connectionRepository.deleteById(id);
    }
}
