package com.greendal.ziel.course.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "course")
@Getter
@Setter
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "course_id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "course_name", nullable = false)
    private String courseName;

    @Column(name = "major_code", nullable = false)
    private String majorCode;

    @Column(name = "major_name", nullable = false)
    private String majorName;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false)
    private int semester;

    @Column(name = "total_hours", nullable = false)
    private int totalHours;

    @Column(name = "credit_units", nullable = false)
    private int creditUnits;

    @Column(name = "auditory_hours_total", nullable = false)
    private int auditoryHoursTotal;

    @Column(nullable = false)
    private int lectures;

    private Integer labworks;

    private Integer practices;

    @Enumerated(EnumType.STRING)
    @Column(name = "attestation_form", nullable = false)
    private AttestationForm attestationForm;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
