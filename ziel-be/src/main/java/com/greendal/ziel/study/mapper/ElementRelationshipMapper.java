package com.greendal.ziel.study.mapper;

import com.greendal.ziel.study.dto.element.ElementRelationshipRequestDto;
import com.greendal.ziel.study.dto.element.ElementRelationshipResponseDto;
import com.greendal.ziel.study.model.ElementRelationship;
import com.greendal.ziel.study.service.resolver.Resolver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = Resolver.class)
public interface ElementRelationshipMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sourceElement", source = "sourceElementId", qualifiedByName = "resolveElement")
    @Mapping(target = "targetElement", source = "targetElementId", qualifiedByName = "resolveElement")
    ElementRelationship toEntity(ElementRelationshipRequestDto dto);

    @Mapping(target = "sourceElementId", source = "sourceElement.id")
    @Mapping(target = "targetElementId", source = "targetElement.id")
    ElementRelationshipResponseDto toDto(ElementRelationship elementRelationship);

    List<ElementRelationshipResponseDto> toDtoList(List<ElementRelationship> elementRelationships);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sourceElement", source = "sourceElementId", qualifiedByName = "resolveElement")
    @Mapping(target = "targetElement", source = "targetElementId", qualifiedByName = "resolveElement")
    void updateElementRelationshipFromDto(ElementRelationshipRequestDto dto, @MappingTarget ElementRelationship entity);
}
