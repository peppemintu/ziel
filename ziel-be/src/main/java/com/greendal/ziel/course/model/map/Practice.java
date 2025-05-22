package com.greendal.ziel.course.model.map;

import com.greendal.ziel.course.model.map.Element;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "practice")
@Getter
@Setter
public class Practice extends Element {
    // no extra fields for now
}
