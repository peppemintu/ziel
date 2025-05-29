package com.greendal.ziel.study.mapper;

import com.greendal.ziel.study.dto.course.CourseRequestDto;
import com.greendal.ziel.study.dto.course.CourseResponseDto;
import com.greendal.ziel.study.model.Course;
import com.greendal.ziel.study.service.resolver.Resolver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = Resolver.class)
public interface CourseMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "courseTeachers", ignore = true)
    @Mapping(target = "studyPlan", source = "studyPlanId", qualifiedByName = "resolveStudyPlan")
    @Mapping(target = "group", source = "groupId", qualifiedByName = "resolveGroup")
    Course toEntity(CourseRequestDto dto);

    @Mapping(target = "studyPlanId", source = "studyPlan.id")
    @Mapping(target = "groupId", source = "group.id")
    CourseResponseDto toDto(Course course);

    List<CourseResponseDto> toDtoList(List<Course> courses);

    @Mapping(target = "courseTeachers", ignore = true)
    @Mapping(target = "studyPlan", source = "studyPlanId", qualifiedByName = "resolveStudyPlan")
    @Mapping(target = "group", source = "groupId", qualifiedByName = "resolveGroup")
    void updateCourseFromDto(CourseRequestDto dto, @MappingTarget Course entity);
}
