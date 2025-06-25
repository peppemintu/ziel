package com.greendal.ziel.study.service;

import com.greendal.ziel.study.dto.message.MessageRequestDto;
import com.greendal.ziel.study.dto.message.MessageResponseDto;
import com.greendal.ziel.study.mapper.MessageMapper;
import com.greendal.ziel.study.model.Message;
import com.greendal.ziel.study.repository.MessageRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;

    public MessageResponseDto createMessage(MessageRequestDto requestDto) {
        Message message = messageMapper.toEntity(requestDto);
        Message saved = messageRepository.save(message);
        return messageMapper.toDto(saved);
    }

    public List<MessageResponseDto> getAllMessages() {
        return messageMapper.toDtoList(messageRepository.findAll());
    }

    public MessageResponseDto getMessageById(Long id) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Message not found with id " + id));
        return messageMapper.toDto(message);
    }

    public List<MessageResponseDto> getMessagesByElementId(Long elementId) {
        return messageMapper.toDtoList(messageRepository.findAllByElement_Id(elementId));
    }
}

