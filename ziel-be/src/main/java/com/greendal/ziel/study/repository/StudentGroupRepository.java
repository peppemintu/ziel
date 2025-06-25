package com.greendal.ziel.study.repository;

import com.greendal.ziel.study.model.StudentGroup;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentGroupRepository extends ListCrudRepository<StudentGroup, Long> {
    StudentGroup findBySpecialtyIdAndGroupNumber(Long specialtyId, short groupNumber);
}
