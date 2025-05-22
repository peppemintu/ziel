package com.greendal.ziel.course.repository.map;

import com.greendal.ziel.course.model.map.Lecture;
import org.springframework.data.repository.ListCrudRepository;
import java.util.UUID;

public interface LectureRepository extends ListCrudRepository<Lecture, UUID> {
}
