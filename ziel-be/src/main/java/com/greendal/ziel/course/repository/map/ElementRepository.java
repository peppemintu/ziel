package com.greendal.ziel.course.repository.map;

import com.greendal.ziel.course.model.map.Element;
import org.springframework.data.repository.ListCrudRepository;
import java.util.UUID;

public interface ElementRepository extends ListCrudRepository<Element, UUID> {
}
