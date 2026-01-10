package com.tutor_management.backend.modules.schedule;

import com.tutor_management.backend.modules.auth.UserRepository;
import com.tutor_management.backend.modules.finance.SessionRecord;
import com.tutor_management.backend.modules.finance.SessionRecordRepository;
import com.tutor_management.backend.modules.notification.event.ScheduleCreatedEvent;
import com.tutor_management.backend.modules.notification.event.ScheduleUpdatedEvent;
import com.tutor_management.backend.modules.schedule.dto.request.RecurringScheduleRequest;
import com.tutor_management.backend.modules.schedule.dto.response.RecurringScheduleResponse;
import com.tutor_management.backend.modules.student.Student;
import com.tutor_management.backend.modules.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
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
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for managing recurring lesson schedules and auto-generating session records.
 * 
 * Provides CRUD operations for schedules and intelligent generation of 
 * monthly session logs based on fixed weekly slots.
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class RecurringScheduleService {

    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;
    private static final String[] DAY_NAMES = { "", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN" };

    private final RecurringScheduleRepository recurringScheduleRepository;
    private final StudentRepository studentRepository;
    private final SessionRecordRepository sessionRecordRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    // ==================== CRUD Operations ====================

    /**
     * Retrieves all recurring schedules, including inactive ones.
     * @return List of schedule response DTOs
     */
    @Transactional(readOnly = true)
    public List<RecurringScheduleResponse> getAllSchedules() {
        return recurringScheduleRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all currently active schedules with populated student data.
     * @return List of active schedule response DTOs
     */
    @Transactional(readOnly = true)
    public List<RecurringScheduleResponse> getActiveSchedules() {
        return recurringScheduleRepository.findAllActiveWithStudent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Fetches a specific schedule by ID.
     * @param id The schedule identifier
     * @return Found schedule details
     * @throws RuntimeException if schedule is not found
     */
    @Transactional(readOnly = true)
    public RecurringScheduleResponse getScheduleById(Long id) {
        RecurringSchedule schedule = recurringScheduleRepository.findByIdWithStudent(id)
                .orElseThrow(() -> new RuntimeException("Recurring schedule not found for ID: " + id));
        return convertToResponse(schedule);
    }

    /**
     * Finds the primary active schedule for a specific student.
     * @param studentId The student identifier
     * @return Active schedule details
     */
    @Transactional(readOnly = true)
    public RecurringScheduleResponse getScheduleByStudentId(Long studentId) {
        RecurringSchedule schedule = recurringScheduleRepository
                .findByStudentIdAndActiveTrueOrderByCreatedAtDesc(studentId)
                .orElseThrow(() -> new RuntimeException("No active schedule found for student ID: " + studentId));
        return convertToResponse(schedule);
    }

    /**
     * Creates a new recurring schedule. 
     * Automatically deactivates any existing active schedules for the same student.
     * 
     * @param request New schedule parameters
     * @param tutorName Name of the tutor creating the schedule for notification context
     * @return Created schedule details
     */
    public RecurringScheduleResponse createSchedule(RecurringScheduleRequest request, String tutorName) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found for ID: " + request.getStudentId()));

        deactivateExistingSchedules(request.getStudentId());

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
        publishScheduleCreatedNotification(saved, tutorName);

        return convertToResponse(saved);
    }

    /**
     * Updates an existing schedule's configuration.
     * @param id The schedule ID to update
     * @param request Updated block of parameters
     * @return Updated schedule details
     */
    public RecurringScheduleResponse updateSchedule(Long id, RecurringScheduleRequest request) {
        RecurringSchedule schedule = recurringScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found with ID: " + id));

        updateScheduleFields(schedule, request);

        RecurringSchedule updated = recurringScheduleRepository.save(schedule);
        publishScheduleUpdatedNotification(updated);

        return convertToResponse(updated);
    }

    /**
     * Hard deletes a recurring schedule record.
     * @param id The schedule identifier
     */
    public void deleteSchedule(Long id) {
        RecurringSchedule schedule = recurringScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attempted to delete non-existent schedule: " + id));
        recurringScheduleRepository.delete(schedule);
        log.info("Deleted recurring schedule: {}", id);
    }

    /**
     * Toggles the active status of a schedule.
     * @param id The schedule identifier
     * @return Updated schedule status
     */
    public RecurringScheduleResponse toggleActive(Long id) {
        RecurringSchedule schedule = recurringScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found: " + id));
        schedule.setActive(!schedule.getActive());
        RecurringSchedule updated = recurringScheduleRepository.save(schedule);
        return convertToResponse(updated);
    }

    // ==================== Auto-Generate Sessions ====================

    /**
     * Batch generates session records for a given month based on active recurring schedules.
     * Skips generation for sessions that already exist in the database.
     *
     * @param month      Target month in YYYY-MM format
     * @param studentIds Optional list of student IDs to filter (null or empty = all students)
     * @return Total count of session records successfully generated
     */
    public int generateSessionsForMonth(String month, List<Long> studentIds) {
        List<RecurringSchedule> targetSchedules = getActiveSchedulesForGeneration(studentIds);
        if (targetSchedules.isEmpty()) {
            return 0;
        }

        Set<String> existingSessionLookup = buildExistingSessionLookup(month, targetSchedules);

        List<SessionRecord> sessionsToSave = new ArrayList<>();
        for (RecurringSchedule schedule : targetSchedules) {
            if (isScheduleValidForMonth(schedule, month)) {
                sessionsToSave.addAll(generateSessionsForSchedule(schedule, month, existingSessionLookup));
            }
        }

        if (!sessionsToSave.isEmpty()) {
            sessionRecordRepository.saveAll(sessionsToSave);
            log.info("Batch generated {} sessions for month {}", sessionsToSave.size(), month);
            return sessionsToSave.size();
        }

        return 0;
    }

    /**
     * Checks if any sessions have already been generated/logged for a specific month.
     * @param month Target month (YYYY-MM)
     * @param studentId Optional student filter
     * @return true if sessions exist
     */
    @Transactional(readOnly = true)
    public boolean hasSessionsForMonth(String month, Long studentId) {
        List<SessionRecord> sessionsInMonth = sessionRecordRepository.findByMonthOrderByCreatedAtDesc(month);

        if (studentId != null) {
            return sessionsInMonth.stream().anyMatch(record -> record.getStudent().getId().equals(studentId));
        }

        return !sessionsInMonth.isEmpty();
    }

    /**
     * Calculates how many sessions would be generated for a month without actually creating them.
     * Used for preview and coordination.
     * 
     * @param month Target month (YYYY-MM)
     * @param studentIds Optional student filter
     * @return Predicted total session count
     */
    @Transactional(readOnly = true)
    public int countSessionsToGenerate(String month, List<Long> studentIds) {
        List<RecurringSchedule> targetSchedules = getActiveSchedulesForGeneration(studentIds);
        int totalPredicted = 0;

        for (RecurringSchedule schedule : targetSchedules) {
            if (isScheduleValidForMonth(schedule, month)) {
                totalPredicted += countOccurrencesOfDaysInMonth(schedule.getDaysOfWeekArray(), month);
            }
        }

        return totalPredicted;
    }

    // ==================== Private Helper Methods ====================

    private void deactivateExistingSchedules(Long studentId) {
        List<RecurringSchedule> existingActive = recurringScheduleRepository.findByStudentIdAndActiveTrue(studentId);
        if (!existingActive.isEmpty()) {
            existingActive.forEach(s -> s.setActive(false));
            recurringScheduleRepository.saveAll(existingActive);
            log.info("Deactivated {} existing schedules for student ID: {}", existingActive.size(), studentId);
        }
    }

    private void updateScheduleFields(RecurringSchedule schedule, RecurringScheduleRequest request) {
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
    }

    private List<RecurringSchedule> getActiveSchedulesForGeneration(List<Long> studentIds) {
        if (studentIds != null && !studentIds.isEmpty()) {
            return recurringScheduleRepository.findAllActiveWithStudent().stream()
                    .filter(schedule -> studentIds.contains(schedule.getStudent().getId()))
                    .collect(Collectors.toList());
        }
        return recurringScheduleRepository.findAllActiveWithStudent();
    }

    private Set<String> buildExistingSessionLookup(String month, List<RecurringSchedule> schedules) {
        List<Long> studentIdsToScan = schedules.stream()
                .map(schedule -> schedule.getStudent().getId())
                .distinct()
                .collect(Collectors.toList());

        List<SessionRecord> existingRecords = sessionRecordRepository.findByMonthAndStudentIdIn(month, studentIdsToScan);
        
        return existingRecords.stream()
                .map(record -> record.getStudent().getId() + "_" + record.getSessionDate())
                .collect(Collectors.toSet());
    }

    private boolean isScheduleValidForMonth(RecurringSchedule schedule, String month) {
        boolean startsAfterMonth = schedule.getStartMonth().compareTo(month) > 0;
        if (startsAfterMonth) return false;

        boolean endsBeforeMonth = schedule.getEndMonth() != null && schedule.getEndMonth().compareTo(month) < 0;
        if (endsBeforeMonth) return false;

        return true;
    }

    private List<SessionRecord> generateSessionsForSchedule(RecurringSchedule schedule, String month, Set<String> existingLookup) {
        List<SessionRecord> sessions = new ArrayList<>();
        YearMonth yearMonth = YearMonth.parse(month);
        LocalDate firstDay = yearMonth.atDay(1);
        LocalDate lastDay = yearMonth.atEndOfMonth();

        for (int dayNum : schedule.getDaysOfWeekArray()) {
            LocalDate date = firstDay.with(TemporalAdjusters.nextOrSame(DayOfWeek.of(dayNum)));

            while (!date.isAfter(lastDay)) {
                String lookupKey = schedule.getStudent().getId() + "_" + date;
                
                if (!existingLookup.contains(lookupKey)) {
                    sessions.add(buildNewSessionRecord(schedule, date, month));
                    existingLookup.add(lookupKey); 
                }
                date = date.plusWeeks(1);
            }
        }
        return sessions;
    }

    private SessionRecord buildNewSessionRecord(RecurringSchedule schedule, LocalDate date, String month) {
        Student student = schedule.getStudent();
        Double actualHours = schedule.getHoursPerSession() * 1.0;
        long calculatedAmount = (long) (student.getPricePerHour() * actualHours);

        return SessionRecord.builder()
                .student(student)
                .month(month)
                .sessions(1)
                .hours(actualHours)
                .pricePerHour(student.getPricePerHour())
                .totalAmount(calculatedAmount)
                .paid(false)
                .sessionDate(date)
                .notes("Auto-generated from recurring schedule")
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .subject(schedule.getSubject())
                .status(com.tutor_management.backend.modules.finance.LessonStatus.SCHEDULED)
                .build();
    }

    private int countOccurrencesOfDaysInMonth(Integer[] daysOfWeek, String month) {
        int count = 0;
        YearMonth yearMonth = YearMonth.parse(month);
        LocalDate firstDay = yearMonth.atDay(1);
        LocalDate lastDay = yearMonth.atEndOfMonth();

        for (int dayNum : daysOfWeek) {
            LocalDate date = firstDay.with(TemporalAdjusters.nextOrSame(DayOfWeek.of(dayNum)));
            while (!date.isAfter(lastDay)) {
                count++;
                date = date.plusWeeks(1);
            }
        }
        return count;
    }

    private void publishScheduleCreatedNotification(RecurringSchedule schedule, String tutorName) {
        try {
            eventPublisher.publishEvent(ScheduleCreatedEvent.builder()
                    .scheduleId(schedule.getId())
                    .studentId(schedule.getStudent().getId().toString())
                    .studentName(schedule.getStudent().getName())
                    .tutorName(tutorName)
                    .subject(schedule.getSubject())
                    .daysOfWeek(formatDaysOfWeek(schedule.getDaysOfWeekArray()))
                    .startTime(schedule.getStartTime())
                    .build());
        } catch (Exception e) {
            log.error("Notification alert failed for schedule creation {}: {}", schedule.getId(), e.getMessage());
        }
    }

    private void publishScheduleUpdatedNotification(RecurringSchedule schedule) {
        try {
            eventPublisher.publishEvent(ScheduleUpdatedEvent.builder()
                    .scheduleId(schedule.getId())
                    .studentId(schedule.getStudent().getId().toString())
                    .studentName(schedule.getStudent().getName())
                    .tutorName("Giáo viên")
                    .subject(schedule.getSubject())
                    .daysOfWeek(formatDaysOfWeek(schedule.getDaysOfWeekArray()))
                    .startTime(schedule.getStartTime())
                    .build());
        } catch (Exception e) {
            log.error("Notification alert failed for schedule update {}: {}", schedule.getId(), e.getMessage());
        }
    }

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
                .createdAt(schedule.getCreatedAt().format(ISO_FORMATTER))
                .updatedAt(schedule.getUpdatedAt().format(ISO_FORMATTER))
                .build();
    }

    private String formatDaysOfWeek(Integer[] days) {
        if (days == null || days.length == 0) return "";
        return Arrays.stream(days)
                .map(day -> DAY_NAMES[day])
                .collect(Collectors.joining(", "));
    }
}
