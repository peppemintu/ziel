package com.greendal.ziel.study.dto.message;

import com.greendal.ziel.study.model.MessageStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDto {
    private Long id;
    private LocalDateTime sentAt;
    private MessageStatus status;
    private String content;
    private Long userId;
    private Long elementId;
}
