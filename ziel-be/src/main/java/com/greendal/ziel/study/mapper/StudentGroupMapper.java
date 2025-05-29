package com.greendal.ziel.study.mapper;

import com.greendal.ziel.study.dto.studentGroup.StudentGroupRequestDto;
import com.greendal.ziel.study.dto.studentGroup.StudentGroupResponseDto;
import com.greendal.ziel.study.model.StudentGroup;
import com.greendal.ziel.study.service.resolver.Resolver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = Resolver.class)
public interface StudentGroupMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "specialty", source = "specialtyId", qualifiedByName = "resolveSpecialty")
    @Mapping(target = "students", ignore = true)
    @Mapping(target = "courses", ignore = true)
    StudentGroup toEntity(StudentGroupRequestDto dto);

    @Mapping(target = "specialtyId", source = "specialty.id")
    StudentGroupResponseDto toDto(StudentGroup studentGroup);

    List<StudentGroupResponseDto> toDtoList(List<StudentGroup> groups);

    @Mapping(target = "specialty", source = "specialtyId", qualifiedByName = "resolveSpecialty")
    @Mapping(target = "students", ignore = true)
    @Mapping(target = "courses", ignore = true)
    void updateStudentGroupFromDto(StudentGroupRequestDto dto, @MappingTarget StudentGroup entity);
}
