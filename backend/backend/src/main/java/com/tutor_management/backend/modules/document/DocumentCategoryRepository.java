package com.tutor_management.backend.modules.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentCategoryRepository extends JpaRepository<DocumentCategory, Long> {
    Optional<DocumentCategory> findByCode(String code);
    List<DocumentCategory> findAllByActiveTrueOrderByDisplayOrderAsc();
}
