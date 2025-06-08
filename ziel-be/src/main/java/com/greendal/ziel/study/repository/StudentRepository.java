package com.greendal.ziel.study.repository;

import com.greendal.ziel.study.model.Student;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends ListCrudRepository<Student, Long> {
    Student findByUserId(Long userId);
}
