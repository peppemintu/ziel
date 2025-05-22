package com.greendal.ziel.course.repository;

import com.greendal.ziel.course.model.LabworkCompletion;
import com.greendal.ziel.course.model.LabworkCompletionId;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabworkCompletionRepository extends ListCrudRepository<LabworkCompletion, LabworkCompletionId> {
}
