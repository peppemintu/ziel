package com.greendal.ziel.course.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class RoadmapConnectionDto {
    private UUID sourceId;
    private UUID targetId;
    private UUID courseId;
    private String label;
}
