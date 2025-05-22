package com.greendal.ziel.course.mapper;

import com.greendal.ziel.auth.model.User;
import com.greendal.ziel.course.dto.ElementMessageDto;
import com.greendal.ziel.course.model.ElementMessage;
import com.greendal.ziel.course.model.map.Element;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ElementMessageMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "sender", expression = "java(sender)")
    @Mapping(target = "element", expression = "java(element)")
    ElementMessage toEntity(ElementMessageDto dto, @Context User sender, @Context Element element);

    @Mapping(source = "sender.id", target = "senderId")
    @Mapping(source = "element.id", target = "elementId")
    ElementMessageDto toDto(ElementMessage entity);
}
