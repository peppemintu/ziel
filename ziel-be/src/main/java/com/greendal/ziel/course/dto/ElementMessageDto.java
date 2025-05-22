package com.greendal.ziel.course.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ElementMessageDto {
    private UUID senderId;
    private UUID elementId;
    private String content;
    private boolean isPublic;
}
