package com.greendal.ziel.course.model.map;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "attestation")
@Getter
@Setter
public class Attestation extends Element {
    // no extra fields for now
}
