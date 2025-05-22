package com.greendal.ziel.course.model.map;

import com.greendal.ziel.course.model.map.Element;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "labwork")
@Getter
@Setter
public class Labwork extends Element {
    // no extra fields yet, but extendable later
}
