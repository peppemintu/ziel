package com.greendal.ziel.study.repository;

import com.greendal.ziel.study.model.Course;
import com.greendal.ziel.study.model.Message;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends ListCrudRepository<Message, Long> {
    List<Message> findAllByElement_Id(Long elementId);
}
