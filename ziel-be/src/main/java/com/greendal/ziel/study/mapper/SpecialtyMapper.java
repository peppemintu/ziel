package com.greendal.ziel.study.mapper;

import com.greendal.ziel.study.dto.specialty.SpecialtyRequestDto;
import com.greendal.ziel.study.dto.specialty.SpecialtyResponseDto;
import com.greendal.ziel.study.model.Specialty;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SpecialtyMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "studyPlans", ignore = true)
    @Mapping(target = "groups", ignore = true)
    Specialty toEntity(SpecialtyRequestDto dto);

    SpecialtyResponseDto toDto(Specialty specialty);

    List<SpecialtyResponseDto> toDtoList(List<Specialty> specialties);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "studyPlans", ignore = true)
    @Mapping(target = "groups", ignore = true)
    void updateSpecialtyFromDto(SpecialtyRequestDto dto, @MappingTarget Specialty entity);
}
