package com.tutor_management.backend.modules.feedback.service;

import com.tutor_management.backend.exception.ResourceNotFoundException;
import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.feedback.dto.request.FeedbackTemplateRequest;
import com.tutor_management.backend.modules.feedback.dto.response.FeedbackTemplateResponse;
import com.tutor_management.backend.modules.feedback.entity.FeedbackTemplate;
import com.tutor_management.backend.modules.feedback.repository.FeedbackTemplateRepository;
import com.tutor_management.backend.util.SecurityContextUtils;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackTemplateService {

    private final FeedbackTemplateRepository templateRepository;
    private final SecurityContextUtils securityContextUtils;

    @PostConstruct
    public void seedDefaultTemplates() {
        if (templateRepository.countByIsSystemTrue() == 0) {
            log.info("Seeding default feedback templates for tutors...");
            List<FeedbackTemplate> defaults = List.of(
                // ATTITUDE
                FeedbackTemplate.builder()
                        .title("Chăm chỉ & Tích cực")
                        .content("Em rất tập trung, hăng hái tương tác và chủ động giải quyết các bài tập trong suốt buổi học.")
                        .category("ATTITUDE")
                        .isSystem(true)
                        .build(),
                FeedbackTemplate.builder()
                        .title("Cần tập trung hơn")
                        .content("Hôm nay em còn hơi mất tập trung vào đầu buổi học, cần chú ý theo dõi bài giảng hơn.")
                        .category("ATTITUDE")
                        .isSystem(true)
                        .build(),
                FeedbackTemplate.builder()
                        .title("Ngoan ngoãn & Cầu tiến")
                        .content("Em có thái độ học tập nghiêm túc, lễ phép, tiếp thu các góp ý của giáo viên rất tốt.")
                        .category("ATTITUDE")
                        .isSystem(true)
                        .build(),

                // ABSORPTION
                FeedbackTemplate.builder()
                        .title("Tiếp thu xuất sắc")
                        .content("Em nắm bắt kiến thức mới rất nhanh, hiểu bản chất vấn đề và vận dụng linh hoạt vào bài tập thực hành.")
                        .category("ABSORPTION")
                        .isSystem(true)
                        .build(),
                FeedbackTemplate.builder()
                        .title("Hiểu bài khá tốt")
                        .content("Em hiểu được trọng tâm bài học, nắm chắc dạng bài cơ bản nhưng cần rèn luyện thêm bài nâng cao.")
                        .category("ABSORPTION")
                        .isSystem(true)
                        .build(),
                FeedbackTemplate.builder()
                        .title("Cần giải thích kỹ")
                        .content("Em gặp một chút khó khăn với dạng bài mới, giáo viên đã hướng dẫn lại và em đã hiểu được các bước làm cơ bản.")
                        .category("ABSORPTION")
                        .isSystem(true)
                        .build(),

                // GAPS
                FeedbackTemplate.builder()
                        .title("Tính toán vội vàng")
                        .content("Em còn mắc một số lỗi sai cơ bản do tính toán vội vàng, chưa có thói quen kiểm tra lại đáp án.")
                        .category("GAPS")
                        .isSystem(true)
                        .build(),
                FeedbackTemplate.builder()
                        .title("Chưa vững lý thuyết")
                        .content("Chưa nhớ kỹ các định lý và công thức nền tảng của bài học trước.")
                        .category("GAPS")
                        .isSystem(true)
                        .build(),
                FeedbackTemplate.builder()
                        .title("Đọc đề chưa kỹ")
                        .content("Còn đọc lướt đề bài nên dễ bỏ sót các điều kiện bài toán yêu cầu.")
                        .category("GAPS")
                        .isSystem(true)
                        .build(),

                // SOLUTIONS
                FeedbackTemplate.builder()
                        .title("Giao bài tập củng cố")
                        .content("Giao thêm 3-5 bài tập tương tự để em tự luyện ở nhà nhằm củng cố kỹ năng giải bài.")
                        .category("SOLUTIONS")
                        .isSystem(true)
                        .build(),
                FeedbackTemplate.builder()
                        .title("Ôn lại lý thuyết vở ghi")
                        .content("Dặn dò em đọc lại sổ tay ghi chép và làm lại các ví dụ mẫu đã chữa trong buổi học.")
                        .category("SOLUTIONS")
                        .isSystem(true)
                        .build(),
                FeedbackTemplate.builder()
                        .title("Kiểm tra đầu giờ tới")
                        .content("Sẽ tiến hành kiểm tra nhanh 15 phút đầu giờ buổi học sau để đánh giá độ ghi nhớ.")
                        .category("SOLUTIONS")
                        .isSystem(true)
                        .build(),

                // GENERAL
                FeedbackTemplate.builder()
                        .title("Động viên chung")
                        .content("Buổi học diễn ra hiệu quả, em đã có nhiều tiến bộ so với tuần trước. Tiếp tục phát huy nhé!")
                        .category("GENERAL")
                        .isSystem(true)
                        .build()
            );

            templateRepository.saveAll(defaults);
            log.info("Seeded {} default feedback templates successfully.", defaults.size());
        }
    }

    @Transactional(readOnly = true)
    public List<FeedbackTemplateResponse> getAccessibleTemplates(String category) {
        User currentUser = securityContextUtils.getCurrentUser().orElse(null);
        Long userId = (currentUser != null) ? currentUser.getId() : -1L;

        List<FeedbackTemplate> templates = templateRepository.findAccessibleTemplates(userId, category);

        return templates.stream().map(t -> FeedbackTemplateResponse.builder()
                .id(t.getId())
                .title(t.getTitle())
                .content(t.getContent())
                .category(t.getCategory())
                .isSystem(t.isSystem())
                .isOwner(t.getUser() != null && t.getUser().getId().equals(userId))
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build()
        ).toList();
    }

    @Transactional
    public FeedbackTemplateResponse createTemplate(FeedbackTemplateRequest request) {
        User currentUser = securityContextUtils.getCurrentUser()
                .orElseThrow(() -> new AccessDeniedException("Vui lòng đăng nhập để tạo mẫu nhận xét"));

        FeedbackTemplate template = FeedbackTemplate.builder()
                .title(request.getTitle().trim())
                .content(request.getContent().trim())
                .category(request.getCategory().trim().toUpperCase())
                .user(currentUser)
                .isSystem(false)
                .build();

        FeedbackTemplate saved = templateRepository.save(template);
        log.info("User {} created feedback template #{}", currentUser.getEmail(), saved.getId());

        return FeedbackTemplateResponse.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .content(saved.getContent())
                .category(saved.getCategory())
                .isSystem(false)
                .isOwner(true)
                .createdAt(saved.getCreatedAt())
                .updatedAt(saved.getUpdatedAt())
                .build();
    }

    @Transactional
    public FeedbackTemplateResponse updateTemplate(Long id, FeedbackTemplateRequest request) {
        User currentUser = securityContextUtils.getCurrentUser()
                .orElseThrow(() -> new AccessDeniedException("Vui lòng đăng nhập để cập nhật mẫu nhận xét"));

        FeedbackTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mẫu nhận xét #" + id));

        boolean isAdmin = currentUser.getRole() != null && "ADMIN".equals(currentUser.getRole().getName());
        boolean isOwner = template.getUser() != null && template.getUser().getId().equals(currentUser.getId());

        if (template.isSystem() && !isAdmin) {
            throw new AccessDeniedException("Không thể chỉnh sửa mẫu nhận xét mặc định của hệ thống");
        }

        if (!template.isSystem() && !isOwner && !isAdmin) {
            throw new AccessDeniedException("Bạn không có quyền chỉnh sửa mẫu nhận xét này");
        }

        template.setTitle(request.getTitle().trim());
        template.setContent(request.getContent().trim());
        template.setCategory(request.getCategory().trim().toUpperCase());

        FeedbackTemplate updated = templateRepository.save(template);
        log.info("User {} updated feedback template #{}", currentUser.getEmail(), updated.getId());

        return FeedbackTemplateResponse.builder()
                .id(updated.getId())
                .title(updated.getTitle())
                .content(updated.getContent())
                .category(updated.getCategory())
                .isSystem(updated.isSystem())
                .isOwner(isOwner)
                .createdAt(updated.getCreatedAt())
                .updatedAt(updated.getUpdatedAt())
                .build();
    }

    @Transactional
    public void deleteTemplate(Long id) {
        User currentUser = securityContextUtils.getCurrentUser()
                .orElseThrow(() -> new AccessDeniedException("Vui lòng đăng nhập để xóa mẫu nhận xét"));

        FeedbackTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mẫu nhận xét #" + id));

        boolean isAdmin = currentUser.getRole() != null && "ADMIN".equals(currentUser.getRole().getName());
        boolean isOwner = template.getUser() != null && template.getUser().getId().equals(currentUser.getId());

        if (template.isSystem() && !isAdmin) {
            throw new AccessDeniedException("Không thể xóa mẫu nhận xét mặc định của hệ thống");
        }

        if (!template.isSystem() && !isOwner && !isAdmin) {
            throw new AccessDeniedException("Bạn không có quyền xóa mẫu nhận xét này");
        }

        templateRepository.delete(template);
        log.info("User {} deleted feedback template #{}", currentUser.getEmail(), id);
    }
}
