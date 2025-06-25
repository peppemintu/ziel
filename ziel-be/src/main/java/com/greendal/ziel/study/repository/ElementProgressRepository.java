package com.greendal.ziel.study.repository;

import com.greendal.ziel.study.model.ElementProgress;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElementProgressRepository extends ListCrudRepository<ElementProgress, Long> {
    List<ElementProgress> findByElementId(Long elementId);
}
