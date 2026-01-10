package com.tutor_management.backend.modules.parent;

import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.modules.parent.dto.request.ParentRequest;
import com.tutor_management.backend.modules.parent.dto.response.ParentResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for managing {@link Parent} records.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ParentService {

    private final ParentRepository parentRepository;

    /**
     * Retrieves all parent records in the system.
     */
    @Transactional(readOnly = true)
    public List<ParentResponse> getAllParents() {
        return parentRepository.findAllWithStudents().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a specific parent by their unique identifier.
     * 
     * @param id The ID of the parent.
     * @throws ResourceNotFoundException if no parent is found.
     */
    @Transactional(readOnly = true)
    public ParentResponse getParentById(Long id) {
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phụ huynh với ID: " + id));
        return convertToResponse(parent);
    }

    /**
     * Declares a new parent record.
     * 
     * @param request Data for the new parent.
     * @throws IllegalArgumentException if the email is already registered.
     */
    @Transactional
    public ParentResponse createParent(ParentRequest request) {
        log.info("Creating new parent: {}", request.getName());
        
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (parentRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email đã tồn tại: " + request.getEmail());
            }
        }

        Parent parent = Parent.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .notes(request.getNotes())
                .build();

        parent = parentRepository.save(parent);
        return convertToResponse(parent);
    }

    /**
     * Updates an existing parent record.
     */
    @Transactional
    public ParentResponse updateParent(Long id, ParentRequest request) {
        log.info("Updating parent ID: {}", id);
        
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phụ huynh với ID: " + id));

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (parentRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
                throw new IllegalArgumentException("Email đã tồn tại: " + request.getEmail());
            }
        }

        parent.setName(request.getName());
        parent.setEmail(request.getEmail());
        parent.setPhone(request.getPhone());
        parent.setNotes(request.getNotes());

        parent = parentRepository.save(parent);
        return convertToResponse(parent);
    }

    /**
     * Removes a parent record. Prevents deletion if students are still linked.
     * 
     * @throws IllegalStateException if linked students exist.
     */
    @Transactional
    public void deleteParent(Long id) {
        log.warn("Attempting to delete parent ID: {}", id);
        
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phụ huynh với ID: " + id));

        if (parent.getStudents() != null && !parent.getStudents().isEmpty()) {
            throw new IllegalStateException(
                    "Không thể xóa phụ huynh vì còn " + parent.getStudents().size() +
                    " học sinh liên kết. Vui lòng chuyển hoặc xóa học sinh trước."
            );
        }

        parentRepository.delete(parent);
    }

    /**
     * Queries parent records based on a search keyword.
     */
    @Transactional(readOnly = true)
    public List<ParentResponse> searchParents(String keyword) {
        return parentRepository.searchParents(keyword).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Maps a {@link Parent} entity to its response DTO.
     */
    private ParentResponse convertToResponse(Parent parent) {
        return ParentResponse.builder()
                .id(parent.getId())
                .name(parent.getName())
                .email(parent.getEmail())
                .phone(parent.getPhone())
                .notes(parent.getNotes())
                .studentCount(parent.getStudents() != null ? parent.getStudents().size() : 0)
                .createdAt(parent.getCreatedAt())
                .updatedAt(parent.getUpdatedAt())
                .build();
    }
}
