package com.greendal.ziel.course.model;

import com.greendal.ziel.course.model.map.Element;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

// Students leave messages below labworks with files and commentaries.
// Only teacher can look at the messages left on the elements.
@Entity
@Table(name = "element_message")
@Getter
@Setter
public class ElementMessage extends Message {
    @ManyToOne(optional = false)
    @JoinColumn(name = "element_id", nullable = false)
    private Element element;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic = true;
}

