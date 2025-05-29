package com.greendal.ziel.study.repository;

import com.greendal.ziel.study.model.Teacher;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherRepository extends ListCrudRepository<Teacher, Long> {
}
