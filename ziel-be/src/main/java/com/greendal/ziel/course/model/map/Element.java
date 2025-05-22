package com.greendal.ziel.course.model.map;

import com.greendal.ziel.course.model.Course;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "element")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
public abstract class Element {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "element_id", nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false)
    private String topic;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ElementType type;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @OneToMany(mappedBy = "source", cascade = CascadeType.ALL)
    private List<RoadmapConnection> connections = new ArrayList<>();

}
