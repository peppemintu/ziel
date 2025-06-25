package com.greendal.ziel.study.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "final_grade")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinalGrade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "grade_id", nullable = false)
    private Long id;

    @Column(name = "ticket_number")
    private short ticketNumber;

    @Column(name = "numeric_grade")
    private short numericGrade;

    @ManyToOne
    @JoinColumn(name = "grade_sheet_id", nullable = false)
    private GradeSheet gradeSheet;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
}
