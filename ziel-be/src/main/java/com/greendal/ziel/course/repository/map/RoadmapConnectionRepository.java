package com.greendal.ziel.course.repository.map;

import com.greendal.ziel.course.model.map.RoadmapConnection;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RoadmapConnectionRepository extends ListCrudRepository<RoadmapConnection, UUID> {
}

