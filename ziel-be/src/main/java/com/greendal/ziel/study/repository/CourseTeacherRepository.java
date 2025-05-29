package com.greendal.ziel.study.repository;

import com.greendal.ziel.study.model.CourseTeacher;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseTeacherRepository extends ListCrudRepository<CourseTeacher, Long> {
}
