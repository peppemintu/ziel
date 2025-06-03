package com.greendal.ziel.study.mapper;

import com.greendal.ziel.study.dto.element.ElementProgressRequestDto;
import com.greendal.ziel.study.dto.element.ElementProgressResponseDto;
import com.greendal.ziel.study.model.ElementProgress;
import com.greendal.ziel.study.service.resolver.Resolver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = Resolver.class)
public interface ElementProgressMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "element", source = "elementId", qualifiedByName = "resolveElement")
    @Mapping(target = "student", source = "studentId", qualifiedByName = "resolveStudent")
    ElementProgress toEntity(ElementProgressRequestDto dto);

    @Mapping(target = "elementId", source = "element.id")
    @Mapping(target = "studentId", source = "student.id")
    ElementProgressResponseDto toDto(ElementProgress elementProgress);

    List<ElementProgressResponseDto> toDtoList(List<ElementProgress> elementProgresses);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "element", source = "elementId", qualifiedByName = "resolveElement")
    @Mapping(target = "student", source = "studentId", qualifiedByName = "resolveStudent")
    void updateElementProgressFromDto(ElementProgressRequestDto dto, @MappingTarget ElementProgress entity);
}
