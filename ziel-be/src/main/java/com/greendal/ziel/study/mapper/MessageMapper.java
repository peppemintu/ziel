package com.greendal.ziel.study.mapper;

import com.greendal.ziel.study.dto.message.MessageRequestDto;
import com.greendal.ziel.study.dto.message.MessageResponseDto;
import com.greendal.ziel.study.model.Message;
import com.greendal.ziel.study.service.resolver.Resolver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = Resolver.class)
public interface MessageMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sentAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "user", source = "userId", qualifiedByName = "resolveUser")
    @Mapping(target = "element", source = "elementId", qualifiedByName = "resolveElement")
    Message toEntity(MessageRequestDto dto);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "elementId", source = "element.id")
    MessageResponseDto toDto(Message message);

    List<MessageResponseDto> toDtoList(List<Message> messages);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sentAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "user", source = "userId", qualifiedByName = "resolveUser")
    @Mapping(target = "element", source = "elementId", qualifiedByName = "resolveElement")
    void updateEntityFromDto(MessageRequestDto dto, @MappingTarget Message message);
}

