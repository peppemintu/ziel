package com.greendal.ziel.study.service.resolver;

import com.greendal.ziel.auth.model.User;
import com.greendal.ziel.auth.repository.UserRepository;
import com.greendal.ziel.study.model.*;
import com.greendal.ziel.study.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Resolver {
    private final StudyPlanRepository studyPlanRepository;
    private final StudentGroupRepository studentGroupRepository;
    private final DisciplineRepository disciplineRepository;
    private final SpecialtyRepository specialtyRepository;
    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Named("resolveStudyPlan")
    public StudyPlan resolveStudyPlan(Long id) {
        return studyPlanRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Study plan not found with id " + id));
    }

    @Named("resolveGroup")
    public StudentGroup resolveGroup(Long id) {
        return studentGroupRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student group not found for id " + id));
    }

    @Named("resolveDiscipline")
    public Discipline resolveDiscipline(Long id) {
        return disciplineRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Discipline not found with id " + id));
    }

    @Named("resolveSpecialty")
    public Specialty resolveSpecialty(Long id) {
        return specialtyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Specialty not found with id " + id));
    }

    @Named("resolveTeacher")
    public Teacher resolveTeacher(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found for id " + id));
    }

    @Named("resolveCourse")
    public Course resolveCourse(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Course not found for id " + id));
    }

    @Named("resolveUser")
    public User resolveUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found for id " + id));
    }
}
