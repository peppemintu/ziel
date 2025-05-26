package com.greendal.ziel.study.mapper;

import com.greendal.ziel.study.dto.discipline.DisciplineRequestDto;
import com.greendal.ziel.study.dto.discipline.DisciplineResponseDto;
import com.greendal.ziel.study.model.Discipline;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DisciplineMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "studyPlans", ignore = true)
    Discipline toEntity(DisciplineRequestDto dto);

    DisciplineResponseDto toDto(Discipline discipline);

    List<DisciplineResponseDto> toDtoList(List<Discipline> disciplines);

    @Mapping(target = "studyPlans", ignore = true)
    void updateDisciplineFromDto(DisciplineRequestDto dto, @MappingTarget Discipline entity);
}
