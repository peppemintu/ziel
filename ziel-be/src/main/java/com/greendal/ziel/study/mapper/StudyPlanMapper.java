package com.greendal.ziel.study.mapper;

import com.greendal.ziel.study.dto.studyPlan.StudyPlanRequestDto;
import com.greendal.ziel.study.dto.studyPlan.StudyPlanResponseDto;
import com.greendal.ziel.study.model.StudyPlan;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = StudyPlanResolver.class)
public interface StudyPlanMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "discipline", source = "disciplineId", qualifiedByName = "resolveDiscipline")
    @Mapping(target = "specialty", source = "specialtyId", qualifiedByName = "resolveSpecialty")
    @Mapping(target = "courses", ignore = true)
    StudyPlan toEntity(StudyPlanRequestDto dto);

    @Mapping(target = "disciplineId", source = "discipline.id")
    @Mapping(target = "specialtyId", source = "specialty.id")
    StudyPlanResponseDto toDto(StudyPlan plan);

    List<StudyPlanResponseDto> toDtoList(List<StudyPlan> plans);

    @Mapping(target = "discipline", source = "disciplineId", qualifiedByName = "resolveDiscipline")
    @Mapping(target = "specialty", source = "specialtyId", qualifiedByName = "resolveSpecialty")
    @Mapping(target = "courses", ignore = true)
    void updateStudyPlanFromDto(StudyPlanRequestDto dto, @MappingTarget StudyPlan entity);
}

