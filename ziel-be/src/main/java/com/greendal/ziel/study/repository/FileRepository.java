package com.greendal.ziel.study.repository;

import com.greendal.ziel.study.model.File;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends ListCrudRepository<File, Long> {
    List<File> findByCourseElementId(Long elementId);

    List<File> findByUploadedBy_Id(Long userId);

    @Query("""
        SELECT f FROM File f
        JOIN Student s ON s.user = f.uploadedBy
        WHERE f.courseElement.id = :elementId AND s.group.id = :groupId
    """)
    List<File> findByElementIdAndGroupId(@Param("elementId") Long elementId, @Param("groupId") Long groupId);

}

