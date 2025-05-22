package com.greendal.ziel.course.mapper;

import com.greendal.ziel.course.model.Course;
import com.greendal.ziel.course.model.map.Element;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RoadmapContext {
    private Element source;
    private Element target;
    private Course course;
}
