package com.greendal.ziel.course.repository.map;

import com.greendal.ziel.course.model.map.Labwork;
import org.springframework.data.repository.ListCrudRepository;
import java.util.UUID;

public interface LabworkRepository extends ListCrudRepository<Labwork, UUID> {
}
