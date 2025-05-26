package com.greendal.ziel.study.repository;

import com.greendal.ziel.study.model.StudyPlan;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentGroupRepository extends ListCrudRepository<StudyPlan, Long> {
}
