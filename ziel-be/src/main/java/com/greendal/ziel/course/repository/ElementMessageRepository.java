package com.greendal.ziel.course.repository;

import com.greendal.ziel.course.model.ElementMessage;
import com.greendal.ziel.course.model.map.Element;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ElementMessageRepository extends ListCrudRepository<ElementMessage, UUID> {
    List<ElementMessage> findByElement(Element element);
}
