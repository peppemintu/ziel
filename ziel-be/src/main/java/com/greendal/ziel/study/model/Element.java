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
    private Short hours;

    @Column(name = "is_published", nullable = false)
    private boolean published;

    @Column(name = "element_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ElementType elementType;

    @Column(name = "assessment_form")
    @Enumerated(EnumType.STRING)
    private AttestationForm attestationForm;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @OneToMany(mappedBy = "element", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ElementProgress> studentProgresses;

    // this element's children:
    @OneToMany(mappedBy = "sourceElement", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ElementRelationship> childrenRelationships;

    // this element's parents:
    @OneToMany(mappedBy = "targetElement", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ElementRelationship> parentRelationships;
}
