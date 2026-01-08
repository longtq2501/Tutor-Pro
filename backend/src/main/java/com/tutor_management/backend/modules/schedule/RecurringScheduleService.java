package com.tutor_management.backend.modules.schedule;

import com.tutor_management.backend.modules.schedule.dto.request.RecurringScheduleRequest;

import com.tutor_management.backend.modules.schedule.dto.response.RecurringScheduleResponse;
import com.tutor_management.backend.modules.finance.SessionRecord;
import com.tutor_management.backend.modules.student.Student;
import com.tutor_management.backend.modules.finance.SessionRecordRepository;
import com.tutor_management.backend.modules.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RecurringScheduleService {

    private final RecurringScheduleRepository recurringScheduleRepository;
    private final StudentRepository studentRepository;
    private final SessionRecordRepository sessionRecordRepository;

    private final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

    // ==================== CRUD Operations ====================

    public List<RecurringScheduleResponse> getAllSchedules() {
        List<RecurringSchedule> schedules = recurringScheduleRepository.findAllByOrderByCreatedAtDesc();
        return schedules.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<RecurringScheduleResponse> getActiveSchedules() {
        List<RecurringSchedule> schedules = recurringScheduleRepository.findAllActiveWithStudent();
        return schedules.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public RecurringScheduleResponse getScheduleById(Long id) {
        RecurringSchedule schedule = recurringScheduleRepository.findByIdWithStudent(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        return convertToResponse(schedule);
    }

    public RecurringScheduleResponse getScheduleByStudentId(Long studentId) {
        RecurringSchedule schedule = recurringScheduleRepository
                .findByStudentIdAndActiveTrueOrderByCreatedAtDesc(studentId)
                .orElseThrow(() -> new RuntimeException("No active schedule found for student"));
        return convertToResponse(schedule);
    }

    public RecurringScheduleResponse createSchedule(RecurringScheduleRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Deactivate existing schedules for this student
        List<RecurringSchedule> existingSchedules = recurringScheduleRepository
                .findByStudentIdAndActiveTrue(request.getStudentId());
        existingSchedules.forEach(schedule -> schedule.setActive(false));
        recurringScheduleRepository.saveAll(existingSchedules);

        RecurringSchedule schedule = RecurringSchedule.builder()
                .student(student)
                .startTime(LocalTime.parse(request.getStartTime()))
                .endTime(LocalTime.parse(request.getEndTime()))
                .hoursPerSession(request.getHoursPerSession())
                .startMonth(request.getStartMonth())
                .endMonth(request.getEndMonth())
                .active(request.getActive() != null ? request.getActive() : true)
                .notes(request.getNotes())
                .subject(request.getSubject())
                .build();

        schedule.setDaysOfWeekArray(request.getDaysOfWeek());

        RecurringSchedule saved = recurringScheduleRepository.save(schedule);
        return convertToResponse(saved);
    }

    public RecurringScheduleResponse updateSchedule(Long id, RecurringScheduleRequest request) {
        RecurringSchedule schedule = recurringScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        schedule.setDaysOfWeekArray(request.getDaysOfWeek());
        schedule.setStartTime(LocalTime.parse(request.getStartTime()));
        schedule.setEndTime(LocalTime.parse(request.getEndTime()));
        schedule.setHoursPerSession(request.getHoursPerSession());
        schedule.setStartMonth(request.getStartMonth());
        schedule.setEndMonth(request.getEndMonth());

        if (request.getActive() != null) {
            schedule.setActive(request.getActive());
        }
        if (request.getNotes() != null) {
            schedule.setNotes(request.getNotes());
        }
        if (request.getSubject() != null) {
            schedule.setSubject(request.getSubject());
        }

        RecurringSchedule updated = recurringScheduleRepository.save(schedule);
        return convertToResponse(updated);
    }

    public void deleteSchedule(Long id) {
        RecurringSchedule schedule = recurringScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        recurringScheduleRepository.delete(schedule);
    }

    public RecurringScheduleResponse toggleActive(Long id) {
        RecurringSchedule schedule = recurringScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        schedule.setActive(!schedule.getActive());
        RecurringSchedule updated = recurringScheduleRepository.save(schedule);
        return convertToResponse(updated);
    }

    // ==================== Auto-Generate Sessions ====================

    /**
     * Tạo tự động các buổi học cho 1 tháng theo lịch cố định
     *
     * @param month      Tháng cần tạo (YYYY-MM)
     * @param studentIds Danh sách student IDs (null = tất cả)
     * @return Số buổi học đã tạo
     */
    public int generateSessionsForMonth(String month, List<Long> studentIds) {
        List<RecurringSchedule> schedules;

        if (studentIds != null && !studentIds.isEmpty()) {
            // Chỉ tạo cho các student được chọn
            schedules = recurringScheduleRepository.findAllActiveWithStudent().stream()
                    .filter(s -> studentIds.contains(s.getStudent().getId()))
                    .collect(Collectors.toList());
        } else {
            // Tạo cho tất cả
            schedules = recurringScheduleRepository.findAllActiveWithStudent();
        }

        if (schedules.isEmpty()) {
            return 0;
        }

        // OPTIMIZATION: Fetch existing sessions for the month in ONE query
        List<Long> studentIdsToScan = schedules.stream()
                .map(s -> s.getStudent().getId())
                .distinct()
                .collect(Collectors.toList());

        List<SessionRecord> existingRecords = sessionRecordRepository.findByMonthAndStudentIdIn(month, studentIdsToScan);
        
        // Build efficient lookup set: "studentId_date"
        java.util.Set<String> existingSessionKeys = existingRecords.stream()
                .map(sr -> sr.getStudent().getId() + "_" + sr.getSessionDate())
                .collect(Collectors.toSet());

        int totalCreated = 0;
        List<SessionRecord> sessionsToSave = new ArrayList<>();

        for (RecurringSchedule schedule : schedules) {
            // Check if schedule is valid for this month
            if (!isScheduleValidForMonth(schedule, month)) {
                continue;
            }

            // Generate sessions for this schedule passing the lookup set
            List<SessionRecord> sessions = generateSessionsForSchedule(schedule, month, existingSessionKeys);
            sessionsToSave.addAll(sessions);
        }

        // Batch save
        if (!sessionsToSave.isEmpty()) {
            sessionRecordRepository.saveAll(sessionsToSave);
            totalCreated = sessionsToSave.size();
        }

        return totalCreated;
    }

    /**
     * Kiểm tra lịch có valid cho tháng này không
     */
    private boolean isScheduleValidForMonth(RecurringSchedule schedule, String month) {
        // Check if schedule starts after this month
        if (schedule.getStartMonth().compareTo(month) > 0) {
            return false;
        }

        // Check if schedule ends before this month
        if (schedule.getEndMonth() != null && schedule.getEndMonth().compareTo(month) < 0) {
            return false;
        }

        return true;
    }

    /**
     * Tạo các session records cho 1 schedule trong 1 tháng
     */
    private List<SessionRecord> generateSessionsForSchedule(RecurringSchedule schedule, String month, java.util.Set<String> existingKeys) {
        List<SessionRecord> sessions = new ArrayList<>();

        YearMonth yearMonth = YearMonth.parse(month);
        LocalDate firstDay = yearMonth.atDay(1);
        LocalDate lastDay = yearMonth.atEndOfMonth();

        Integer[] daysOfWeek = schedule.getDaysOfWeekArray();

        for (int dayOfWeek : daysOfWeek) {
            // Find all dates in month for this day of week
            LocalDate date = firstDay.with(TemporalAdjusters.nextOrSame(getDayOfWeek(dayOfWeek)));

            while (!date.isAfter(lastDay)) {
                // Check if session already exists using Memory Lookup
                String key = schedule.getStudent().getId() + "_" + date;
                
                if (!existingKeys.contains(key)) {
                    // Create session record
                    SessionRecord session = SessionRecord.builder()
                            .student(schedule.getStudent())
                            .month(month)
                            .sessions(1) // 1 buổi học
                            .hours(schedule.getHoursPerSession() * 1) // Tính giờ (Double)
                            .pricePerHour(schedule.getStudent().getPricePerHour())
                            .totalAmount((long) (schedule.getStudent().getPricePerHour() *
                                    (schedule.getHoursPerSession() * 1)))
                            .paid(false)
                            .sessionDate(date)
                            .notes("Auto-generated from recurring schedule")
                            .startTime(schedule.getStartTime())
                            .endTime(schedule.getEndTime())
                            .subject(schedule.getSubject())
                            .status(com.tutor_management.backend.modules.finance.LessonStatus.SCHEDULED)
                            .build();

                    sessions.add(session);
                    // Add to keys to prevent duplicate creation if multiple schedules overlap? (Assuming logic allows overlaps if explicit, but here we prevent duplicates for same day/student)
                    existingKeys.add(key); 
                }

                // Move to next week
                date = date.plusWeeks(1);
            }
        }

        return sessions;
    }

    /**
     * Convert day number to DayOfWeek
     * 1 = Monday, 7 = Sunday
     */
    private DayOfWeek getDayOfWeek(int day) {
        return DayOfWeek.of(day);
    }

    /**
     * Kiểm tra xem tháng này đã tạo sessions chưa
     */
    public boolean hasSessionsForMonth(String month, Long studentId) {
        List<SessionRecord> sessions = sessionRecordRepository.findByMonthOrderByCreatedAtDesc(month);

        if (studentId != null) {
            return sessions.stream().anyMatch(s -> s.getStudent().getId().equals(studentId));
        }

        return !sessions.isEmpty();
    }

    /**
     * Thống kê số buổi học sẽ tạo cho tháng
     */
    public int countSessionsToGenerate(String month, List<Long> studentIds) {
        List<RecurringSchedule> schedules;

        if (studentIds != null && !studentIds.isEmpty()) {
            schedules = recurringScheduleRepository.findAllActiveWithStudent().stream()
                    .filter(s -> studentIds.contains(s.getStudent().getId()))
                    .collect(Collectors.toList());
        } else {
            schedules = recurringScheduleRepository.findAllActiveWithStudent();
        }

        int total = 0;

        for (RecurringSchedule schedule : schedules) {
            if (!isScheduleValidForMonth(schedule, month)) {
                continue;
            }

            YearMonth yearMonth = YearMonth.parse(month);
            LocalDate firstDay = yearMonth.atDay(1);
            LocalDate lastDay = yearMonth.atEndOfMonth();
            Integer[] daysOfWeek = schedule.getDaysOfWeekArray();

            for (int dayOfWeek : daysOfWeek) {
                LocalDate date = firstDay.with(TemporalAdjusters.nextOrSame(getDayOfWeek(dayOfWeek)));

                while (!date.isAfter(lastDay)) {
                    total++;
                    date = date.plusWeeks(1);
                }
            }
        }

        return total;
    }

    // ==================== Helpers ====================

    private RecurringScheduleResponse convertToResponse(RecurringSchedule schedule) {
        Integer[] days = schedule.getDaysOfWeekArray();

        return RecurringScheduleResponse.builder()
                .id(schedule.getId())
                .studentId(schedule.getStudent().getId())
                .studentName(schedule.getStudent().getName())
                .daysOfWeek(days)
                .daysOfWeekDisplay(formatDaysOfWeek(days))
                .startTime(schedule.getStartTime().toString())
                .endTime(schedule.getEndTime().toString())
                .timeRange(schedule.getStartTime() + "-" + schedule.getEndTime())
                .hoursPerSession(schedule.getHoursPerSession())
                .startMonth(schedule.getStartMonth())
                .endMonth(schedule.getEndMonth())
                .active(schedule.getActive())
                .notes(schedule.getNotes())
                .subject(schedule.getSubject())
                .createdAt(schedule.getCreatedAt().format(formatter))
                .updatedAt(schedule.getUpdatedAt().format(formatter))
                .build();
    }

    private String formatDaysOfWeek(Integer[] days) {
        if (days == null || days.length == 0) {
            return "";
        }

        String[] dayNames = { "", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN" };

        return Arrays.stream(days)
                .map(day -> dayNames[day])
                .collect(Collectors.joining(", "));
    }
}
