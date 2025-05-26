package com.greendal.ziel.study.repository;

import com.greendal.ziel.study.model.Specialty;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpecialtyRepository extends ListCrudRepository<Specialty, Long> {
}
