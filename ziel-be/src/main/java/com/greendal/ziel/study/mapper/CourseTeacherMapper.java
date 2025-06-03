package com.greendal.ziel.study.mapper;

import com.greendal.ziel.study.dto.courseTeacher.CourseTeacherRequestDto;
import com.greendal.ziel.study.dto.courseTeacher.CourseTeacherResponseDto;
import com.greendal.ziel.study.model.CourseTeacher;
import com.greendal.ziel.study.service.resolver.Resolver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring", uses = Resolver.class)
public interface CourseTeacherMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "teacher", source = "teacherId", qualifiedByName = "resolveTeacher")
    @Mapping(target = "course", source = "courseId", qualifiedByName = "resolveCourse")
    CourseTeacher toEntity(CourseTeacherRequestDto dto);

    @Mapping(target = "teacherId", source = "teacher.id")
    @Mapping(target = "courseId", source = "course.id")
    CourseTeacherResponseDto toDto(CourseTeacher course);

    List<CourseTeacherResponseDto> toDtoList(List<CourseTeacher> courseTeachers);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "teacher", source = "teacherId", qualifiedByName = "resolveTeacher")
    @Mapping(target = "course", source = "courseId", qualifiedByName = "resolveCourse")
    void updateCourseTeacherFromDto(CourseTeacherRequestDto dto, @MappingTarget CourseTeacher entity);
}
