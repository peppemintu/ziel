package com.greendal.ziel.course.mapper;

import com.greendal.ziel.course.dto.LectureDto;
import com.greendal.ziel.course.model.Course;
import com.greendal.ziel.course.model.map.Lecture;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface LectureMapper {
    LectureMapper INSTANCE = Mappers.getMapper(LectureMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "connections", ignore = true)
    @Mapping(target = "course", expression = "java(course)")
    Lecture toEntity(LectureDto dto, @Context Course course);

    @Mapping(target = "courseId", source = "course.id")
    LectureDto toDto(Lecture lecture);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "connections", ignore = true)
    @Mapping(target = "course", expression = "java(course)")
    void updateEntityFromDto(LectureDto dto, @Context Course course, @MappingTarget Lecture lecture);
}
