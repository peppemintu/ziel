package com.greendal.ziel.study.mapper;

import com.greendal.ziel.study.model.Discipline;
import com.greendal.ziel.study.model.Specialty;
import com.greendal.ziel.study.repository.DisciplineRepository;
import com.greendal.ziel.study.repository.SpecialtyRepository;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StudyPlanResolver {
    private final DisciplineRepository disciplineRepository;
    private final SpecialtyRepository specialtyRepository;

    @Named("resolveDiscipline")
    public Discipline resolveDiscipline(Long id) {
        return disciplineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Discipline not found for id " + id));
    }

    @Named("resolveSpecialty")
    public Specialty resolveSpecialty(Long id) {
        return specialtyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Specialty not found for id " + id));
    }
}
