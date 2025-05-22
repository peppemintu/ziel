package com.greendal.ziel.course.repository.map;

import com.greendal.ziel.course.model.map.Attestation;
import org.springframework.data.repository.ListCrudRepository;
import java.util.UUID;

public interface AttestationRepository extends ListCrudRepository<Attestation, UUID> {
}
