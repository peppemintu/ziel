package com.greendal.ziel.course.controller;

import com.greendal.ziel.course.dto.LectureDto;
import com.greendal.ziel.course.model.map.Lecture;
import com.greendal.ziel.course.service.LectureService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/lecture")
@RequiredArgsConstructor
public class LectureController {
    private final LectureService lectureService;

    @PostMapping
    public Lecture createLecture(@RequestBody LectureDto lecture) {
        return lectureService.createLecture(lecture);
    }

    @GetMapping("/{id}")
    public Lecture getLecture(@PathVariable UUID id) {
        return lectureService.getLectureById(id);
    }

    @GetMapping
    public List<Lecture> getAllLectures() {
        return lectureService.getAllLectures();
    }

    @PutMapping("/{id}")
    public Lecture updateLecture(@PathVariable UUID id, @RequestBody Lecture lecture) {
        return lectureService.updateLecture(id, lecture);
    }

    @DeleteMapping("/{id}")
    public void deleteLecture(@PathVariable UUID id) {
        lectureService.deleteLecture(id);
    }
}
