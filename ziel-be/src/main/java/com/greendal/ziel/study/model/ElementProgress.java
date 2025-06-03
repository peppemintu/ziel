package com.greendal.ziel.study.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "course_element_progress")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElementProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "progress_id", nullable = false)
    private Long id;

    @Column
    @Enumerated(EnumType.STRING)
    private ProgressStatus status;

    @Column
    private Integer grade;

    @ManyToOne
    @JoinColumn(name = "course_element_id", nullable = false)
    private Element element;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
}
