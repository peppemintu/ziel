package com.greendal.ziel.study.repository;

import com.greendal.ziel.study.model.Discipline;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisciplineRepository extends ListCrudRepository<Discipline, Long> {
}
