package com.greendal.ziel.study.dto.file;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileResponseDto {
    private Long id;
    private String path;
    private String name;
    private LocalDateTime uploadedAt;
    private Long uploadedById;
    private String uploadedByEmail;
    private String uploadedByRole;
    private Long courseElement;
}
