package com.greendal.ziel.study.mapper;

import com.greendal.ziel.study.dto.element.ElementRequestDto;
import com.greendal.ziel.study.dto.element.ElementResponseDto;
import com.greendal.ziel.study.model.Element;
import com.greendal.ziel.study.service.resolver.Resolver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = Resolver.class)
public interface ElementMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", source = "courseId", qualifiedByName = "resolveCourse")
    @Mapping(target = "published", ignore = true)
    @Mapping(target = "studentProgresses", ignore = true)
    @Mapping(target = "childrenRelationships", ignore = true)
    @Mapping(target = "parentRelationships", ignore = true)
    Element toEntity(ElementRequestDto dto);

    @Mapping(target = "courseId", source = "course.id")
    ElementResponseDto toDto(Element element);

    List<ElementResponseDto> toDtoList(List<Element> elements);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", source = "courseId", qualifiedByName = "resolveCourse")
    @Mapping(target = "published", ignore = true)
    @Mapping(target = "studentProgresses", ignore = true)
    @Mapping(target = "childrenRelationships", ignore = true)
    @Mapping(target = "parentRelationships", ignore = true)
    void updateElementFromDto(ElementRequestDto dto, @MappingTarget Element entity);
}
