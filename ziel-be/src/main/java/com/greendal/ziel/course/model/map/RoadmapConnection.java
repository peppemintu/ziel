package com.greendal.ziel.course.model.map;

import com.greendal.ziel.course.model.Course;
import com.greendal.ziel.course.model.map.Element;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "roadmap_connection",
       uniqueConstraints = @UniqueConstraint(columnNames = {"source_element_id", "target_element_id"}))
@Getter
@Setter
public class RoadmapConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "connection_id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "source_element_id", nullable = false)
    private Element source;

    @ManyToOne(optional = false)
    @JoinColumn(name = "target_element_id", nullable = false)
    private Element target;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "label")
    private String label; // like "Next", "Depends on", etc.

    @PrePersist
    @PreUpdate
    public void normalizeConnection() {
        if (source == null || target == null) {
            throw new IllegalArgumentException("Both elements must be set in a connection.");
        }
        if (source.getId().equals(target.getId())) {
            throw new IllegalArgumentException("Cannot connect an element to itself.");
        }

        // Normalize so that source always has smaller UUID
        if (source.getId().compareTo(target.getId()) > 0) {
            Element temp = source;
            source = target;
            target = temp;
        }
    }

}
