package com.greendal.ziel.study.repository;

import com.greendal.ziel.study.model.ElementRelationship;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElementRelationshipRepository extends ListCrudRepository<ElementRelationship, Long> {
}
