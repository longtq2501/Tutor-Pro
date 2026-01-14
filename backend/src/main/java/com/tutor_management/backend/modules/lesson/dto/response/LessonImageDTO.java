package com.tutor_management.backend.modules.lesson.dto.response;

import com.tutor_management.backend.modules.lesson.entity.LessonImage;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonImageDTO {
    private Long id;
    private String imageUrl;
    private String caption;
    private Integer displayOrder;

    public static LessonImageDTO fromEntity(LessonImage image) {
        return LessonImageDTO.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .caption(image.getCaption())
                .displayOrder(image.getDisplayOrder())
                .build();
    }
}
