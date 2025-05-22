// LectureService.java
package com.greendal.ziel.course.service;

import com.greendal.ziel.course.dto.LectureDto;
import com.greendal.ziel.course.mapper.CourseMapper;
import com.greendal.ziel.course.mapper.LectureMapper;
import com.greendal.ziel.course.model.Course;
import com.greendal.ziel.course.model.map.Lecture;
import com.greendal.ziel.course.repository.CourseRepository;
import com.greendal.ziel.course.repository.map.LectureRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LectureService {
    private final LectureRepository lectureRepository;
    private final CourseRepository courseRepository;

    public Lecture createLecture(LectureDto lectureDto) {
        Course course = courseRepository.findById(lectureDto.getCourseId())
                .orElseThrow(() -> new EntityNotFoundException("Course not found"));
        Lecture lecture = LectureMapper.INSTANCE.toEntity(lectureDto, course);
        return lectureRepository.save(lecture);
    }

    public Lecture getLectureById(UUID id) {
        return lectureRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lecture not found: " + id));
    }

    public List<Lecture> getAllLectures() {
        return lectureRepository.findAll();
    }

    public Lecture updateLecture(UUID id, Lecture lectureData) {
        Lecture existing = getLectureById(id);
        existing.setTopic(lectureData.getTopic());
        existing.setDescription(lectureData.getDescription());
        existing.setCourse(lectureData.getCourse());
        return lectureRepository.save(existing);
    }

    public void deleteLecture(UUID id) {
        if (!lectureRepository.existsById(id)) {
            throw new EntityNotFoundException("Lecture not found: " + id);
        }
        lectureRepository.deleteById(id);
    }
}
