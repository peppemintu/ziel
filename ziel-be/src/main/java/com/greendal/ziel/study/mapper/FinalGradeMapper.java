package com.greendal.ziel.study.mapper;

import com.greendal.ziel.study.dto.grades.FinalGradeRequestDto;
import com.greendal.ziel.study.dto.grades.FinalGradeResponseDto;
import com.greendal.ziel.study.dto.grades.GradeSheetRequestDto;
import com.greendal.ziel.study.dto.grades.GradeSheetResponseDto;
import com.greendal.ziel.study.model.FinalGrade;
import com.greendal.ziel.study.model.GradeSheet;
import com.greendal.ziel.study.service.resolver.Resolver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = Resolver.class)
public interface FinalGradeMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "gradeSheet", source = "gradeSheetId", qualifiedByName = "resolveGradeSheet")
    @Mapping(target = "student", source = "studentId", qualifiedByName = "resolveStudent")
    FinalGrade toEntity(FinalGradeRequestDto dto);

    @Mapping(target = "gradeSheetId", source = "gradeSheet.id")
    @Mapping(target = "studentId", source = "student.id")
    FinalGradeResponseDto toDto(FinalGrade finalGrade);

    List<FinalGradeResponseDto> toDtoList(List<FinalGrade> finalGrades);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "gradeSheet", source = "gradeSheetId", qualifiedByName = "resolveGradeSheet")
    @Mapping(target = "student", source = "studentId", qualifiedByName = "resolveStudent")
    void updateFinalGradeFromDto(FinalGradeRequestDto dto, @MappingTarget FinalGrade entity);
}
