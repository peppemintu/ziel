package com.greendal.ziel.study.repository;

import com.greendal.ziel.study.model.Element;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElementRepository extends ListCrudRepository<Element, Long> {
}
