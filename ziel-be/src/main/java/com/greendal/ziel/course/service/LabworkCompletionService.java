package com.greendal.ziel.course.service;

import com.greendal.ziel.auth.model.User;
import com.greendal.ziel.auth.repository.UserRepository;
import com.greendal.ziel.course.dto.LabworkCompletionDto;
import com.greendal.ziel.course.mapper.LabworkCompletionMapper;
import com.greendal.ziel.course.model.LabworkCompletion;
import com.greendal.ziel.course.model.LabworkCompletionId;
import com.greendal.ziel.course.model.map.Labwork;
import com.greendal.ziel.course.repository.LabworkCompletionRepository;
import com.greendal.ziel.course.repository.map.LabworkRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LabworkCompletionService {
    private final LabworkCompletionRepository completionRepository;
    private final LabworkRepository labworkRepository;
    private final UserRepository userRepository;
    private final LabworkCompletionMapper mapper;

    public LabworkCompletion createOrUpdate(LabworkCompletionDto dto) {
        Labwork labwork = labworkRepository.findById(dto.getLabworkId())
                .orElseThrow(() -> new EntityNotFoundException("Labwork not found: " + dto.getLabworkId()));

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + dto.getUserId()));

        LabworkCompletion entity = mapper.toEntity(dto, labwork, user);
        return completionRepository.save(entity);
    }

    public LabworkCompletion getCompletion(UUID labworkId, UUID userId) {
        LabworkCompletionId id = new LabworkCompletionId(labworkId, userId);
        return completionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LabworkCompletion not found."));
    }

    public List<LabworkCompletion> getAll() {
        return completionRepository.findAll();
    }

    public void delete(UUID labworkId, UUID userId) {
        LabworkCompletionId id = new LabworkCompletionId(labworkId, userId);
        if (!completionRepository.existsById(id)) {
            throw new EntityNotFoundException("LabworkCompletion not found.");
        }
        completionRepository.deleteById(id);
    }
}
