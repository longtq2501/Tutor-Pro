package com.tutor_management.backend.modules.feedback.service;

import com.tutor_management.backend.modules.auth.RoleEntity;
import com.tutor_management.backend.modules.auth.User;
import com.tutor_management.backend.modules.feedback.dto.request.FeedbackTemplateRequest;
import com.tutor_management.backend.modules.feedback.dto.response.FeedbackTemplateResponse;
import com.tutor_management.backend.modules.feedback.entity.FeedbackTemplate;
import com.tutor_management.backend.modules.feedback.repository.FeedbackTemplateRepository;
import com.tutor_management.backend.util.SecurityContextUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeedbackTemplateServiceTest {

    @Mock
    private FeedbackTemplateRepository templateRepository;

    @Mock
    private SecurityContextUtils securityContextUtils;

    @InjectMocks
    private FeedbackTemplateService templateService;

    private User testUser;

    @BeforeEach
    void setUp() {
        RoleEntity tutorRole = RoleEntity.builder().name("TUTOR").build();
        testUser = User.builder()
                .id(1L)
                .email("tutor@test.com")
                .fullName("Gia sư Test")
                .role(tutorRole)
                .build();
    }

    @Test
    void testGetAccessibleTemplates() {
        when(securityContextUtils.getCurrentUser()).thenReturn(Optional.of(testUser));

        FeedbackTemplate t1 = FeedbackTemplate.builder()
                .id(10L)
                .title("Mẫu 1")
                .content("Nội dung 1")
                .category("ATTITUDE")
                .user(testUser)
                .isSystem(false)
                .build();

        when(templateRepository.findAccessibleTemplates(1L, "ATTITUDE"))
                .thenReturn(List.of(t1));

        List<FeedbackTemplateResponse> responses = templateService.getAccessibleTemplates("ATTITUDE");

        assertEquals(1, responses.size());
        assertEquals("Mẫu 1", responses.get(0).getTitle());
        assertTrue(responses.get(0).isOwner());
        assertFalse(responses.get(0).isSystem());
    }

    @Test
    void testCreateTemplate() {
        when(securityContextUtils.getCurrentUser()).thenReturn(Optional.of(testUser));

        FeedbackTemplateRequest req = FeedbackTemplateRequest.builder()
                .title("Mẫu mới")
                .content("Em tiếp thu rất tốt")
                .category("ABSORPTION")
                .build();

        FeedbackTemplate saved = FeedbackTemplate.builder()
                .id(20L)
                .title("Mẫu mới")
                .content("Em tiếp thu rất tốt")
                .category("ABSORPTION")
                .user(testUser)
                .isSystem(false)
                .build();

        when(templateRepository.save(any(FeedbackTemplate.class))).thenReturn(saved);

        FeedbackTemplateResponse res = templateService.createTemplate(req);

        assertNotNull(res);
        assertEquals(20L, res.getId());
        assertEquals("Mẫu mới", res.getTitle());
        assertTrue(res.isOwner());
        verify(templateRepository, times(1)).save(any(FeedbackTemplate.class));
    }

    @Test
    void testDeleteTemplate_Success() {
        when(securityContextUtils.getCurrentUser()).thenReturn(Optional.of(testUser));

        FeedbackTemplate template = FeedbackTemplate.builder()
                .id(30L)
                .title("Mẫu cần xóa")
                .user(testUser)
                .isSystem(false)
                .build();

        when(templateRepository.findById(30L)).thenReturn(Optional.of(template));

        templateService.deleteTemplate(30L);

        verify(templateRepository, times(1)).delete(template);
    }
}
