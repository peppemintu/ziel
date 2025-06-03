package com.greendal.ziel.study.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "course_element")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Element {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_element_id", nullable = false)
    private Long id;

    @Column
    private short hours;

    @Column(name = "element_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ElementType elementType;

    @Column(name = "assessment_form")
    @Enumerated(EnumType.STRING)
    private AttestationForm attestationForm;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @OneToMany(mappedBy = "element")
    private List<ElementProgress> studentProgresses;

    // this element's children:
    @OneToMany(mappedBy = "sourceElement")
    private List<ElementRelationship> childrenRelationships;

    // this element's parents:
    @OneToMany(mappedBy = "targetElement")
    private List<ElementRelationship> parentRelationships;
}
