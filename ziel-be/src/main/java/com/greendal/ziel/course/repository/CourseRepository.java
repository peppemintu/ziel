package com.greendal.ziel.course.repository;

import com.greendal.ziel.course.model.Course;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CourseRepository extends ListCrudRepository<Course, UUID> {
}
