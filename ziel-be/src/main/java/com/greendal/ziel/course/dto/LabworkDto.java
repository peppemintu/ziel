package com.greendal.ziel.course.dto;

import com.greendal.ziel.course.model.map.ElementType;
import lombok.Data;

import java.util.UUID;

@Data
public class LabworkDto {
    private String topic;
    private String description;
    private UUID courseId;
    private ElementType type = ElementType.LABWORK;
}
