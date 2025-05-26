package com.greendal.ziel.study.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "study_plan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "study_plan_id", nullable = false)
    private Long id;

    @Column(name = "study_year", nullable = false)
    private short studyYear;

    @Column(nullable = false)
    private short semester;

    @Column(name = "total_hours", nullable = false)
    private short totalHours;

    @Column(name = "credit_units", nullable = false)
    private short creditUnits;

    @Column(name = "total_auditory_hours", nullable = false)
    private short totalAuditoryHours;

    @Column(name = "lecture_hours", nullable = false)
    private short lectureHours;

    @Column(name = "practice_hours")
    private short practiceHours;

    @Column(name = "lab_hours")
    private short labHours;

    @Enumerated(EnumType.STRING)
    @Column(name = "attestation_form", nullable = false)
    private AttestationForm attestationForm;

    @ManyToOne
    @JoinColumn(name = "discipline_id", nullable = false)
    private Discipline discipline;

    @ManyToOne
    @JoinColumn(name = "specialty_id", nullable = false)
    private Specialty specialty;

    @OneToMany(mappedBy = "studyPlan")
    private List<Course> courses;
}
