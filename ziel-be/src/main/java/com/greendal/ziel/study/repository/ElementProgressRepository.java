package com.greendal.ziel.study.repository;

import com.greendal.ziel.study.model.ElementProgress;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElementProgressRepository extends ListCrudRepository<ElementProgress, Long> {
}
