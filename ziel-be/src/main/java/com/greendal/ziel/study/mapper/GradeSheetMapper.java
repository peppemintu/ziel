package com.greendal.ziel.study.mapper;

import com.greendal.ziel.study.dto.grades.GradeSheetRequestDto;
import com.greendal.ziel.study.dto.grades.GradeSheetResponseDto;
import com.greendal.ziel.study.model.GradeSheet;
import com.greendal.ziel.study.service.resolver.Resolver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = Resolver.class)
public interface GradeSheetMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", source = "courseId", qualifiedByName = "resolveCourse")
    GradeSheet toEntity(GradeSheetRequestDto dto);

    @Mapping(target = "courseId", source = "course.id")
    GradeSheetResponseDto toDto(GradeSheet gradeSheet);

    List<GradeSheetResponseDto> toDtoList(List<GradeSheet> gradeSheets);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", source = "courseId", qualifiedByName = "resolveCourse")
    void updateGradeSheetFromDto(GradeSheetRequestDto dto, @MappingTarget GradeSheet entity);
}
