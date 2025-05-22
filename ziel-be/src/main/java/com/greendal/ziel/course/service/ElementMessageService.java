package com.greendal.ziel.course.service;

import com.greendal.ziel.auth.model.User;
import com.greendal.ziel.auth.repository.UserRepository;
import com.greendal.ziel.course.dto.ElementMessageDto;
import com.greendal.ziel.course.mapper.ElementMessageMapper;
import com.greendal.ziel.course.model.ElementMessage;
import com.greendal.ziel.course.model.map.Element;
import com.greendal.ziel.course.repository.ElementMessageRepository;
import com.greendal.ziel.course.repository.map.ElementRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ElementMessageService {

    private final ElementMessageRepository messageRepository;
    private final ElementRepository elementRepository;
    private final UserRepository userRepository;
    private final ElementMessageMapper mapper;

    public ElementMessage create(ElementMessageDto dto) {
        Element element = elementRepository.findById(dto.getElementId())
                .orElseThrow(() -> new EntityNotFoundException("Element not found: " + dto.getElementId()));

        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + dto.getSenderId()));

        ElementMessage message = mapper.toEntity(dto, sender, element);
        return messageRepository.save(message);
    }

    public List<ElementMessage> getByElementId(UUID elementId) {
        Element element = elementRepository.findById(elementId)
                .orElseThrow(() -> new EntityNotFoundException("Element not found: " + elementId));
        return messageRepository.findByElement(element);
    }

    public ElementMessage getById(UUID messageId) {
        return messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Message not found: " + messageId));
    }

    public void delete(UUID messageId) {
        if (!messageRepository.existsById(messageId)) {
            throw new EntityNotFoundException("Message not found: " + messageId);
        }
        messageRepository.deleteById(messageId);
    }
}
