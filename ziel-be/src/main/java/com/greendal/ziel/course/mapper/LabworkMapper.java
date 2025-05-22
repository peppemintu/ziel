package com.greendal.ziel.course.mapper;

import com.greendal.ziel.course.dto.LabworkDto;
import com.greendal.ziel.course.model.Course;
import com.greendal.ziel.course.model.map.Labwork;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface LabworkMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "type", constant = "LABWORK")
    @Mapping(target = "connections", ignore = true)
    @Mapping(target = "course", expression = "java(course)")
    Labwork toEntity(LabworkDto dto, @Context Course course);

    @Mapping(target = "courseId", source = "course.id")
    LabworkDto toDto(Labwork labwork);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "type", ignore = true)
    @Mapping(target = "connections", ignore = true)
    @Mapping(target = "course", expression = "java(course)")
    void updateEntityFromDto(LabworkDto dto, @Context Course course, @MappingTarget Labwork labwork);
}
