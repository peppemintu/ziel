package com.greendal.ziel.study.repository;

import com.greendal.ziel.study.model.ElementRelationship;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElementRelationshipRepository extends ListCrudRepository<ElementRelationship, Long> {
    List<ElementRelationship> findBySourceElement_Course_Id(Long courseId);
}
