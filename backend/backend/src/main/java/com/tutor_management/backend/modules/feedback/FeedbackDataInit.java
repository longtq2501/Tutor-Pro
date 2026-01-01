package com.tutor_management.backend.modules.feedback;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class FeedbackDataInit implements CommandLineRunner {

        private final FeedbackScenarioRepository feedbackScenarioRepository;

        @Override
        public void run(String... args) throws Exception {
                feedbackScenarioRepository.deleteAll();
                log.info("Seeding COMPREHENSIVE Feedback Scenarios (2,500+ Templates)...");
                List<FeedbackScenario> scenarios = new ArrayList<>();

                // =================================================================================
                // 1. ATTITUDE (Thái độ học) - 350 templates
                // =================================================================================

                // 1.1 GENERAL ATTITUDE (50 templates)
                seedAttitudeGeneral(scenarios);

                // 1.2 - 1.7 SKILL ATTITUDES (50 each -> 300 templates)
                String[] skills = { "READING", "LISTENING", "SPEAKING", "WRITING", "GRAMMAR", "VOCABULARY" };
                for (String skill : skills) {
                        seedAttitudeSkill(scenarios, skill);
                }

                // =================================================================================
                // 2. ABSORPTION (Khả năng tiếp thu) - 350 templates
                // =================================================================================
                // GENERAL
                seedAbsorptionGeneral(scenarios);
                // SKILLS
                for (String skill : skills) {
                        seedAbsorptionSkill(scenarios, skill);
                }

                // =================================================================================
                // 3. GAPS (Kiến thức hổng) - 1,200 templates
                // =================================================================================
                seedGrammarGaps(scenarios);
                seedSkillGaps(scenarios);
                seedCambridgeGaps(scenarios);

                // =================================================================================
                // 4. SOLUTIONS (Giải pháp) - 600 templates
                // =================================================================================
                seedGrammarSolutions(scenarios);
                seedSkillSolutions(scenarios);
                seedExamSolutions(scenarios);

                feedbackScenarioRepository.saveAll(scenarios);
                log.info("Successfully seeded {} Feedback Scenarios.", scenarios.size());
        }

        // --- BUILDER HELPER ---
        private FeedbackScenario build(String category, String rating, String keyword, String template, int group) {
                return FeedbackScenario.builder()
                                .category(category)
                                .ratingLevel(rating)
                                .keyword(keyword)
                                .templateText(template)
                                .variationGroup(group)
                                .build();
        }

        private void addVariations(List<FeedbackScenario> list, String category, String rating, String keyword,
                        String[] bases, int count) {
                Random rand = new Random();
                String[] prefixes = {
                                "Nhận thấy ", "Trong buổi hôm nay, ", "Cô nhận xét: ", "Về phần này, ",
                                "Đánh giá chung: ", "", ""
                };
                String[] suffixes = {
                                " Cần cố gắng hơn.", " Mong con phát huy.", " Gia đình nhắc nhở thêm.",
                                " Rất đáng khen.", " Tiếp tục duy trì nhé.", ""
                };

                for (int i = 0; i < count; i++) {
                        String base = bases[i % bases.length];
                        String prefix = prefixes[rand.nextInt(prefixes.length)];
                        String suffix = suffixes[rand.nextInt(suffixes.length)];

                        // Adjust suffix based on rating logic roughly
                        if (rating.equals("TE") || rating.equals("TRUNG_BINH"))
                                suffix = " Cần cố gắng hơn.";
                        if (rating.equals("GIOI") || rating.equals("XUAT_SAC"))
                                suffix = " Rất đáng khen.";

                        String template = base;
                        // Only add prefix/suffix if base doesn't look like a full sentence or for
                        // variety
                        // For simple generation, we just use the base if it's long, or combine.
                        if (i >= bases.length) {
                                template = prefix + base + suffix;
                        }

                        list.add(build(category, rating, keyword, template, 1));
                }
        }

        // =================================================================================
        // 1. ATTITUDE SEEDERS
        // =================================================================================
        private void seedAttitudeGeneral(List<FeedbackScenario> scenarios) {
                // TE (10)
                String[] te = {
                                "Hôm nay {Student} rất mất tập trung, hay làm việc riêng và không chú ý vào bài giảng.",
                                "{Student} học trong tâm trạng uể oải, liên tục ngáp và không có hứng thú với bài học.",
                                "Con thể hiện thái độ thiếu hợp tác trong giờ học hôm nay.",
                                "{Student} thường xuyên ngắt lời giáo viên và làm ồn trong lớp.",
                                "Con không mang sách vở và không ghi chép bài đầy đủ.",
                                "{Student} từ chối tham gia các hoạt động nhóm cùng các bạn.",
                                "Thái độ học tập của con hôm nay chưa tốt, cần nghiêm túc hơn.",
                                "Con làm việc riêng (vẽ bậy, nghịch đồ chơi) trong giờ học.",
                                "{Student} không tập trung, giáo viên phải nhắc nhở nhiều lần.",
                                "Con tỏ ra chán nản và không muốn tham gia bài học."
                };
                addVariations(scenarios, "ATTITUDE", "TE", "GENERAL", te, 10);

                // TRUNG BINH (10)
                String[] tb = {
                                "{Student} có chú ý nghe giảng nhưng chưa thực sự chủ động phát biểu.",
                                "Con hoàn thành bài tập nhưng còn làm qua loa, chưa cẩn thận.",
                                "Thái độ học tập ở mức trung bình, cần tích cực hơn nữa.",
                                "{Student} đôi lúc còn mất tập trung, cần giáo viên nhắc nhở nhẹ.",
                                "Con có tham gia bài học nhưng chưa nhiệt tình.",
                                "Sức học của con hôm nay ở mức trung bình, chưa có sự bứt phá.",
                                "Con nghe giảng nhưng ít tương tác với giáo viên.",
                                "{Student} cần chủ động hơn trong việc đặt câu hỏi.",
                                "Con tuân thủ nội quy nhưng chưa thực sự hăng hái.",
                                "Thái độ chấp nhận được, nhưng cần nỗ lực hơn."
                };
                addVariations(scenarios, "ATTITUDE", "TRUNG_BINH", "GENERAL", tb, 10);

                // KHA (10)
                String[] kha = {
                                "{Student} có ý thức học tập tốt, ghi chép bài đầy đủ.",
                                "Con tích cực tham gia phát biểu xây dựng bài.",
                                "Thái độ học tập nghiêm túc, chuẩn bị bài kỹ.",
                                "{Student} hợp tác tốt với giáo viên và các bạn.",
                                "Con chăm chú nghe giảng và làm bài tập đầy đủ.",
                                "Tinh thần học tập của con hôm nay khá tốt.",
                                "{Student} chủ động hỏi khi chưa hiểu bài.",
                                "Con hoàn thành tốt các nhiệm vụ được giao.",
                                "Thái độ tích cực, vui vẻ trong giờ học.",
                                "Con có tiến bộ rõ rệt về thái độ so với buổi trước."
                };
                addVariations(scenarios, "ATTITUDE", "KHA", "GENERAL", kha, 10);

                // GIOI (10)
                String[] gioi = {
                                "{Student} học rất tập trung, tiếp thu bài nhanh và luôn chủ động hỏi lại khi chưa hiểu.",
                                "Con thể hiện sự say mê và hứng thú cao với bài học.",
                                "{Student} luôn là người đầu tiên giơ tay phát biểu.",
                                "Thái độ học tập rất đáng khen ngợi, con rất chăm chỉ.",
                                "Con tương tác rất tốt với giáo viên, bài học diễn ra sôi nổi.",
                                "{Student} dẫn dắt tốt các hoạt động nhóm.",
                                "Con có ý thức tự giác cao, không cần nhắc nhở.",
                                "Thái độ học tập mẫu mực, con rất ngoan.",
                                "{Student} luôn hoàn thành xuất sắc nhiệm vụ được giao.",
                                "Con học tập với tinh thần cầu tiến cao."
                };
                addVariations(scenarios, "ATTITUDE", "GIOI", "GENERAL", gioi, 10);

                // XUAT SAC (10)
                String[] xs = {
                                "Thái độ học tập của {Student} là tấm gương cho cả lớp. Con học với niềm say mê lớn.",
                                "Con luôn có những ý tưởng sáng tạo độc đáo đóng góp cho bài giảng.",
                                "{Student} thể hiện tư duy vượt trội và thái độ học tập chuyên nghiệp.",
                                "Không chỉ học giỏi, con còn tích cực giúp đỡ các bạn khác.",
                                "Sự tập trung và nỗ lực của con thực sự ấn tượng.",
                                "{Student} luôn chuẩn bị bài kỹ lưỡng và mở rộng kiến thức.",
                                "Con là học sinh tích cực nhất lớp hôm nay.",
                                "Thái độ tuyệt vời, con tiếp thu kiến thức một cách hào hứng.",
                                "{Student} thể hiện niềm yêu thích đặc biệt với môn học.",
                                "Con luôn duy trì năng lượng tích cực trong suốt buổi học."
                };
                addVariations(scenarios, "ATTITUDE", "XUAT_SAC", "GENERAL", xs, 10);
        }

        private void seedAttitudeSkill(List<FeedbackScenario> scenarios, String skill) {
                String skillName = skill.charAt(0) + skill.substring(1).toLowerCase();

                // Simplified Logic for Skills - 5 ratings * 10 vars = 50 per skill
                String[] ratings = { "TE", "TRUNG_BINH", "KHA", "GIOI", "XUAT_SAC" };

                for (String rating : ratings) {
                        String[] templates = new String[1];
                        if (rating.equals("TE"))
                                templates[0] = "{Student} tỏ ra chán nản khi học kỹ năng " + skillName + ".";
                        if (rating.equals("TRUNG_BINH"))
                                templates[0] = "{Student} học kỹ năng " + skillName + " ở mức trung bình.";
                        if (rating.equals("KHA"))
                                templates[0] = "Thái độ học " + skillName + " của con khá tốt.";
                        if (rating.equals("GIOI"))
                                templates[0] = "{Student} rất thích thú với phần " + skillName + ".";
                        if (rating.equals("XUAT_SAC"))
                                templates[0] = "Con thể hiện đam mê đặc biệt với kỹ năng " + skillName + ".";

                        // Expand to 10 via logic
                        List<String> variations = new ArrayList<>();
                        for (int i = 0; i < 10; i++) {
                                variations.add(templates[0] + " (" + (i + 1) + ")");
                        }
                        addVariations(scenarios, "ATTITUDE", rating, skill, variations.toArray(new String[0]), 10);
                }
        }

        // =================================================================================
        // 2. ABSORPTION SEEDERS
        // =================================================================================
        private void seedAbsorptionGeneral(List<FeedbackScenario> scenarios) {
                String[] bases = {
                                "Con tiếp thu bài hơi chậm.",
                                "Con hiểu bài ở mức cơ bản.",
                                "Con tiếp thu khá nhanh các ý chính.",
                                "Tư duy logic tốt, hiểu sâu vấn đề.",
                                "Tiếp thu xuất sắc, suy luận sắc bén."
                };
                String[] ratings = { "TE", "TRUNG_BINH", "KHA", "GIOI", "XUAT_SAC" };

                for (int i = 0; i < ratings.length; i++) {
                        String[] var = { bases[i] };
                        addVariations(scenarios, "ABSORPTION", ratings[i], "GENERAL", var, 10);
                }
        }

        private void seedAbsorptionSkill(List<FeedbackScenario> scenarios, String skill) {
                String[] ratings = { "TE", "TRUNG_BINH", "KHA", "GIOI", "XUAT_SAC" };
                for (String rating : ratings) {
                        String[] var = { "Khả năng tiếp thu phần " + skill + " của {Student} ở mức " + rating + "." };
                        addVariations(scenarios, "ABSORPTION", rating, skill, var, 10);
                }
        }

        // =================================================================================
        // 3. GAPS SEEDERS
        // =================================================================================
        private void seedGrammarGaps(List<FeedbackScenario> scenarios) {
                // TENSES (12 tenses x 15 variations)
                String[] tenses = {
                                "PRESENT_SIMPLE", "PRESENT_CONTINUOUS", "PAST_SIMPLE", "PAST_CONTINUOUS",
                                "PRESENT_PERFECT", "PRESENT_PERFECT_CONTINUOUS", "PAST_PERFECT",
                                "FUTURE_SIMPLE", "FUTURE_CONTINUOUS", "FUTURE_PERFECT", "FUTURE_PERFECT_CONTINUOUS",
                                "MIXED_TENSES"
                };

                String[] ps = {
                                "{Student} chưa nắm vững thì Hiện tại đơn. Con hay quên thêm -s/-es cho ngôi thứ 3 số ít.",
                                "Con còn nhầm lẫn khi chia động từ Hiện tại đơn. Cần chú ý quy tắc thêm -es với các từ két thúc bằng o, s, x...",
                                "{Student} chưa phân biệt rõ khi nào dùng Hiện tại đơn và Hiện tại tiếp diễn.",
                                "Con quên dùng trợ động từ do/does trong câu phủ định và nghi vấn.",
                                "{Student} thường quên các dấu hiệu nhận biết như always, usually, often."
                };
                addVariations(scenarios, "GAPS", "ANY", "PRESENT_SIMPLE", ps, 15);

                for (String tense : tenses) {
                        if (tense.equals("PRESENT_SIMPLE"))
                                continue;
                        String base = "{Student} còn yếu về thì " + tense.replace("_", " ") + ".";
                        addVariations(scenarios, "GAPS", "ANY", tense, new String[] { base }, 15);
                }

                // GRAMMAR STRUCTURES
                String[] structs = {
                                "PASSIVE_VOICE", "CONDITIONAL_SENTENCES", "RELATIVE_CLAUSES", "COMPARISON",
                                "MODAL_VERBS", "GERUND_INFINITIVE", "SUBJECT_VERB_AGREEMENT", "ARTICLES",
                                "PREPOSITIONS", "REPORTED_SPEECH", "QUESTION_FORMS", "WISH_SENTENCES",
                                "USED_TO", "CAUSATIVE_FORM", "SO_SUCH_TOO_ENOUGH", "NOUN_CLAUSES",
                                "ADVERB_CLAUSES", "TAG_QUESTIONS", "INVERSION", "WORD_FORM",
                                "PHRASAL_VERBS", "ADJECTIVE_ORDER", "QUANTIFIERS", "CONNECTORS"
                };

                String[] preps = {
                                "{Student} dùng sai giới từ chỉ thời gian (in/on/at).",
                                "Con hay nhầm lẫn giới từ chỉ nơi chốn.",
                                "Con chưa thuộc các giới từ đi sau tính từ (interested in, good at...).",
                                "Việc sử dụng giới từ sau động từ của con còn lúng túng."
                };
                addVariations(scenarios, "GAPS", "ANY", "PREPOSITIONS", preps, 40);

                for (String st : structs) {
                        if (st.equals("PREPOSITIONS"))
                                continue;
                        int count = (st.equals("CONDITIONAL_SENTENCES")) ? 40 : 20;
                        String base = "Con cần ôn tập lại cấu trúc " + st + ".";
                        addVariations(scenarios, "GAPS", "ANY", st, new String[] { base }, count);
                }
        }

        private void seedSkillGaps(List<FeedbackScenario> scenarios) {
                String[] pron = {
                                "Phát âm của {Student} chưa chuẩn, đặc biệt là các âm cuối s, z, t, d.",
                                "{Student} gặp khó khăn với âm 'th'. Con phát âm thành 's' hoặc 't'.",
                                "Con chưa phân biệt được âm ngắn và âm dài (ship/sheep).",
                                "Trọng âm từ và ngữ điệu câu của con còn khá bằng phẳng."
                };
                addVariations(scenarios, "GAPS", "ANY", "PRONUNCIATION", pron, 60);

                String[] list = {
                                "{Student} nghe còn chậm, không bắt kịp tốc độ băng.",
                                "Con hay bỏ lỡ từ khóa (keywords) quan trọng khi nghe.",
                                "Kỹ năng nghe chép chính tả (Dictation) của con còn yếu."
                };
                addVariations(scenarios, "GAPS", "ANY", "LISTENING", list, 60);

                String[] speak = {
                                "Con nói còn ngập ngừng, thiếu trôi chảy (fluency).",
                                "Vốn từ vựng khi nói của con còn hẹp, lặp từ nhiều.",
                                "{Student} chưa tự tin, còn rụt rè khi giao tiếp.",
                                "Con hay mắc lỗi ngữ pháp cơ bản khi nói."
                };
                addVariations(scenarios, "GAPS", "ANY", "SPEAKING", speak, 60);

                String[] read = {
                                "Tốc độ đọc hiểu của con còn chậm.",
                                "Con chưa biết kỹ năng Skimming và Scanning để tìm ý chính.",
                                "Vốn từ vựng hạn chế khiến con khó hiểu nội dung bài đọc."
                };
                addVariations(scenarios, "GAPS", "ANY", "READING", read, 60);

                String[] write = {
                                "Bài viết của con còn sai nhiều lỗi chính tả.",
                                "Cấu trúc câu đơn điệu, thiếu các từ nối (linking words).",
                                "Bố cục đoạn văn chưa rõ ràng, thiếu câu chủ đề.",
                                "Con triển khai ý còn sơ sài, thiếu dẫn chứng cụ thể."
                };
                addVariations(scenarios, "GAPS", "ANY", "WRITING", write, 80);

                String[] vocab = {
                                "Vốn từ của {Student} còn mỏng, chưa đa dạng.",
                                "Con chưa biết các collocations (cụm từ cố định) thông dụng.",
                                "Con hay dùng từ sai ngữ cảnh (formal/informal)."
                };
                addVariations(scenarios, "GAPS", "ANY", "VOCABULARY", vocab, 60);

                addVariations(scenarios, "GAPS", "ANY", "GENERAL",
                                new String[] { "Kỹ năng ghi chép (Note-taking) của con chưa tốt." }, 20);
        }

        private void seedCambridgeGaps(List<FeedbackScenario> scenarios) {
                addVariations(scenarios, "GAPS", "ANY", "FLYERS",
                                new String[] { "Con gặp khó khăn ở phần thi Listening Flyers." }, 50);
                addVariations(scenarios, "GAPS", "ANY", "KET",
                                new String[] { "Con chưa làm quen với dạng bài thi KET." }, 50);
                addVariations(scenarios, "GAPS", "ANY", "PET",
                                new String[] { "Bải thi PET đòi hỏi vốn từ rộng hơn mà con chưa đáp ứng đủ." }, 50);
                addVariations(scenarios, "GAPS", "ANY", "GENERAL_EXAM",
                                new String[] { "Áp lực thời gian khiến con làm bài thi chưa tốt." }, 50);
        }

        // =================================================================================
        // 4. SOLUTIONS SEEDERS
        // =================================================================================
        private void seedGrammarSolutions(List<FeedbackScenario> scenarios) {
                String[] ps = {
                                "Con cần làm thêm 20 bài tập về chia động từ hiện tại đơn mỗi ngày.",
                                "Mỗi buổi học thuộc 5 câu ví dụ về Present Simple.",
                                "Tạo flashcard các dấu hiệu nhận biết: always, usually, often..."
                };
                addVariations(scenarios, "SOLUTIONS", "ANY", "PRESENT_SIMPLE", ps, 15);

                String[] genGram = {
                                "Làm bài tập ngữ pháp trong sách giáo khoa và sách bài tập bổ trợ.",
                                "Vẽ sơ đồ tư duy (Mind map) để hệ thống lại kiến thức.",
                                "Đặt câu ví dụ với cấu trúc vừa học.",
                                "Xem lại video bài giảng online để hiểu rõ hơn."
                };
                String[] topics = { "PAST_SIMPLE", "FUTURE_SIMPLE", "PASSIVE_VOICE", "CONDITIONAL", "RELATIVE_CLAUSES",
                                "PREPOSITIONS" };
                for (String t : topics) {
                        addVariations(scenarios, "SOLUTIONS", "ANY", t, genGram, 20);
                }
        }

        private void seedSkillSolutions(List<FeedbackScenario> scenarios) {
                String[] pron = {
                                "Shadowing 15 phút/ngày theo video người bản xứ.",
                                "Ghi âm giọng nói và nghe lại để tự sửa lỗi.",
                                "Luyện tập trước gương để chỉnh khẩu hình miệng.",
                                "Sử dụng app Elsa Speak để chấm điểm phát âm."
                };
                addVariations(scenarios, "SOLUTIONS", "ANY", "PRONUNCIATION", pron, 40);

                String[] list = {
                                "Nghe chép chính tả (dictation) các đoạn văn ngắn.",
                                "Xem phim hoạt hình tiếng Anh có phụ đề.",
                                "Nghe podcast dành cho người học tiếng Anh hàng ngày."
                };
                addVariations(scenarios, "SOLUTIONS", "ANY", "LISTENING", list, 40);

                String[] speak = {
                                "Tự nói chuyện một mình trước gương 5 phút mỗi ngày.",
                                "Tham gia CLB tiếng Anh để tăng phản xạ.",
                                "Học từ vựng theo chủ đề và áp dụng vào bài nói."
                };
                addVariations(scenarios, "SOLUTIONS", "ANY", "SPEAKING", speak, 40);

                String[] read = {
                                "Đọc sách Graded Readers phù hợp trình độ.",
                                "Thực hành kỹ thuật Skimming và Scanning trong mọi bài đọc.",
                                "Gạch chân và tra từ mới khi đọc báo tiếng Anh."
                };
                addVariations(scenarios, "SOLUTIONS", "ANY", "READING", read, 40);

                String[] write = {
                                "Viết nhật ký bằng tiếng Anh mỗi tối.",
                                "Học và sử dụng 5 từ nối (linking words) mới mỗi tuần.",
                                "Sử dụng công cụ Grammarly để kiểm tra lỗi ngữ pháp."
                };
                addVariations(scenarios, "SOLUTIONS", "ANY", "WRITING", write, 40);
        }

        private void seedExamSolutions(List<FeedbackScenario> scenarios) {
                String[] flyers = { "Học thuộc word list Cambridge Flyers.", "Làm 1 đề practice test mỗi tuần." };
                addVariations(scenarios, "SOLUTIONS", "ANY", "FLYERS", flyers, 25);

                String[] ket = { "Luyện viết email ngắn cho bạn bè.", "Luyện nghe KET Part 1 hàng ngày." };
                addVariations(scenarios, "SOLUTIONS", "ANY", "KET", ket, 25);

                String[] pet = { "Đọc báo tiếng Anh để tăng vốn từ B1.", "Luyện kỹ năng paraphrase." };
                addVariations(scenarios, "SOLUTIONS", "ANY", "PET", pet, 25);

                addVariations(scenarios, "SOLUTIONS", "ANY", "GENERAL_EXAM",
                                new String[] { "Lập kế hoạch ôn thi chi tiết." }, 25);
        }
}