package com.greendal.ziel.study.mapper;

import com.greendal.ziel.study.dto.teacher.TeacherRequestDto;
import com.greendal.ziel.study.dto.teacher.TeacherResponseDto;
import com.greendal.ziel.study.model.Teacher;
import com.greendal.ziel.study.service.resolver.Resolver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = Resolver.class)
public interface TeacherMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", source = "userId", qualifiedByName = "resolveUser")
    @Mapping(target = "courseTeachers", ignore = true)
    Teacher toEntity(TeacherRequestDto dto);

    @Mapping(target = "userId", source = "user.id")
    TeacherResponseDto toDto(Teacher teacher);

    List<TeacherResponseDto> toDtoList(List<Teacher> teachers);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", source = "userId", qualifiedByName = "resolveUser")
    @Mapping(target = "courseTeachers", ignore = true)
    void updateTeacherFromDto(TeacherRequestDto dto, @MappingTarget Teacher entity);
}
