package com.greendal.ziel.course.model;

import com.greendal.ziel.auth.model.User;
import com.greendal.ziel.course.model.map.Labwork;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "labwork_completion")
@Getter
@Setter
@NoArgsConstructor
public class LabworkCompletion {
    @EmbeddedId
    private LabworkCompletionId id;

    @ManyToOne
    @MapsId("labworkId")
    @JoinColumn(name = "labwork_id")
    private Labwork labwork;

    /* Currently - this is tightly coupled with auth module.
    * If the app will gain in size, a better option would be to create a "Student"
    * model, that will duplicate User id, contain information about the Student
    * and enter many-to-many relations with Course Elements. */
    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private boolean completed;
}
