package com.greendal.ziel.study.mapper;

import com.greendal.ziel.study.dto.student.StudentRequestDto;
import com.greendal.ziel.study.dto.student.StudentResponseDto;
import com.greendal.ziel.study.model.Student;
import com.greendal.ziel.study.service.resolver.Resolver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = Resolver.class)
public interface StudentMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "group", source = "groupId", qualifiedByName = "resolveGroup")
    @Mapping(target = "user", source = "userId", qualifiedByName = "resolveUser")
    @Mapping(target = "progresses", ignore = true)
    Student toEntity(StudentRequestDto dto);

    @Mapping(target = "groupId", source = "group.id")
    @Mapping(target = "userId", source = "user.id")
    StudentResponseDto toDto(Student student);

    List<StudentResponseDto> toDtoList(List<Student> students);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "group", source = "groupId", qualifiedByName = "resolveGroup")
    @Mapping(target = "user", source = "userId", qualifiedByName = "resolveUser")
    @Mapping(target = "progresses", ignore = true)
    void updateStudentFromDto(StudentRequestDto dto, @MappingTarget Student entity);
}
