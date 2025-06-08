package com.greendal.ziel.study.repository;

import com.greendal.ziel.study.model.Course;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends ListCrudRepository<Course, Long> {
    List<Course> findByGroupId(Long groupId);
    @Query("SELECT ct.course FROM CourseTeacher ct WHERE ct.teacher.user.id = :userId")
    List<Course> findAllByTeacherUserId(@Param("userId") Long userId);

}
