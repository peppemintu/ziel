package com.greendal.ziel.study.controller;

import com.greendal.ziel.study.dto.message.MessageRequestDto;
import com.greendal.ziel.study.dto.message.MessageResponseDto;
import com.greendal.ziel.study.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/message")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponseDto> createMessage(@RequestBody MessageRequestDto requestDto) {
        return ResponseEntity.ok(messageService.createMessage(requestDto));
    }

    @GetMapping
    public ResponseEntity<List<MessageResponseDto>> getAllMessages() {
        return ResponseEntity.ok(messageService.getAllMessages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MessageResponseDto> getMessageById(@PathVariable Long id) {
        return ResponseEntity.ok(messageService.getMessageById(id));
    }

    @GetMapping("/element/{elementId}")
    public ResponseEntity<List<MessageResponseDto>> getMessagesByElementId(@PathVariable Long elementId) {
        return ResponseEntity.ok(messageService.getMessagesByElementId(elementId));
    }
}

