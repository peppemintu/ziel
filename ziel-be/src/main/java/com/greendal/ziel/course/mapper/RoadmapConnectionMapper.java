package com.greendal.ziel.course.mapper;

import com.greendal.ziel.course.dto.RoadmapConnectionDto;
import com.greendal.ziel.course.model.map.RoadmapConnection;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoadmapConnectionMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "source", expression = "java(context.getSource())")
    @Mapping(target = "target", expression = "java(context.getTarget())")
    @Mapping(target = "course", expression = "java(context.getCourse())")
    RoadmapConnection toEntity(RoadmapConnectionDto dto,
                               @Context RoadmapContext context);

    @Mapping(target = "sourceId", source = "source.id")
    @Mapping(target = "targetId", source = "target.id")
    @Mapping(target = "courseId", source = "course.id")
    RoadmapConnectionDto toDto(RoadmapConnection connection);
}
