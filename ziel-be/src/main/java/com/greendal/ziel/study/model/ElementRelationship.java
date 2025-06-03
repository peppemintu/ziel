package com.greendal.ziel.study.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "element_relationship")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElementRelationship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "relationship_id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "source_element_id", nullable = false)
    private Element sourceElement;

    @ManyToOne
    @JoinColumn(name = "target_element_id", nullable = false)
    private Element targetElement;
}
