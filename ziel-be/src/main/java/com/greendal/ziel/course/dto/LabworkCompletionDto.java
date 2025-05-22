package com.greendal.ziel.course.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class LabworkCompletionDto {
    private UUID labworkId;
    private UUID userId;
    private boolean completed;
}
