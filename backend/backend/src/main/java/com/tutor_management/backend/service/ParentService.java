package com.tutor_management.backend.service;

import com.tutor_management.backend.dto.request.ParentRequest;
import com.tutor_management.backend.dto.response.ParentResponse;
import com.tutor_management.backend.entity.Parent;
import com.tutor_management.backend.repository.ParentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParentService {

    private final ParentRepository parentRepository;

    public List<ParentResponse> getAllParents() {
        return parentRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ParentResponse getParentById(Long id) {
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phụ huynh với ID: " + id));
        return convertToResponse(parent);
    }

    @Transactional
    public ParentResponse createParent(ParentRequest request) {
        // Validate email uniqueness
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (parentRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email đã tồn tại: " + request.getEmail());
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

    @Transactional
    public ParentResponse updateParent(Long id, ParentRequest request) {
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phụ huynh với ID: " + id));

        // Validate email uniqueness (exclude current parent)
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (parentRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
                throw new RuntimeException("Email đã tồn tại: " + request.getEmail());
            }
        }

        parent.setName(request.getName());
        parent.setEmail(request.getEmail());
        parent.setPhone(request.getPhone());
        parent.setNotes(request.getNotes());

        parent = parentRepository.save(parent);
        return convertToResponse(parent);
    }

    @Transactional
    public void deleteParent(Long id) {
        Parent parent = parentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phụ huynh với ID: " + id));

        // Check if parent has students
        if (parent.getStudents() != null && !parent.getStudents().isEmpty()) {
            throw new RuntimeException(
                    "Không thể xóa phụ huynh vì còn " + parent.getStudents().size() +
                            " học sinh liên kết. Vui lòng xóa hoặc chuyển học sinh sang phụ huynh khác trước."
            );
        }

        parentRepository.delete(parent);
    }

    public List<ParentResponse> searchParents(String keyword) {
        return parentRepository.searchParents(keyword).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

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