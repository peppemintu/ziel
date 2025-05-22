package com.greendal.ziel.course.mapper;

import com.greendal.ziel.auth.model.User;
import com.greendal.ziel.course.dto.LabworkCompletionDto;
import com.greendal.ziel.course.model.LabworkCompletion;
import com.greendal.ziel.course.model.LabworkCompletionId;
import com.greendal.ziel.course.model.map.Labwork;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface LabworkCompletionMapper {

    default LabworkCompletion toEntity(LabworkCompletionDto dto, Labwork labwork, User user) {
        LabworkCompletion entity = new LabworkCompletion();
        entity.setLabwork(labwork);
        entity.setUser(user);
        entity.setCompleted(dto.isCompleted());
        entity.setId(new LabworkCompletionId(labwork.getId(), user.getId()));
        return entity;
    }

    @Mapping(target = "labworkId", source = "labwork.id")
    @Mapping(target = "userId", source = "user.id")
    LabworkCompletionDto toDto(LabworkCompletion completion);
}
