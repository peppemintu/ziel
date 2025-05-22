package com.greendal.ziel.course.controller;

import com.greendal.ziel.course.dto.ElementMessageDto;
import com.greendal.ziel.course.model.ElementMessage;
import com.greendal.ziel.course.service.ElementMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/element/message")
@RequiredArgsConstructor
public class ElementMessageController {

    private final ElementMessageService messageService;

    @PostMapping
    public ElementMessage createMessage(@RequestBody ElementMessageDto dto) {
        return messageService.create(dto);
    }

    @GetMapping("/{messageId}")
    public ElementMessage getMessage(@PathVariable UUID messageId) {
        return messageService.getById(messageId);
    }

    @GetMapping("/element/{elementId}")
    public List<ElementMessage> getMessagesForElement(@PathVariable UUID elementId) {
        return messageService.getByElementId(elementId);
    }

    @DeleteMapping("/{messageId}")
    public void deleteMessage(@PathVariable UUID messageId) {
        messageService.delete(messageId);
    }
}
