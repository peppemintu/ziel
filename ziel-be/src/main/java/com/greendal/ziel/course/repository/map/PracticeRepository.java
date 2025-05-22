package com.greendal.ziel.course.repository.map;

import com.greendal.ziel.course.model.map.Practice;
import org.springframework.data.repository.ListCrudRepository;
import java.util.UUID;

public interface PracticeRepository extends ListCrudRepository<Practice, UUID> {
}

