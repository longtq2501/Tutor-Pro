import { describe, expect, it } from 'vitest';
import {
    buildSubmissionTeacherActions,
    canExemptSubmission,
    canExtendDeadline,
    canRegradeSubmission,
    canReopenSubmission,
    toApiLocalDateTime,
    toDateTimeLocalValue,
    type SubmissionTeacherAction,
    type SubmissionTeacherActionId,
} from '../submissionTeacherActions';
import { SubmissionStatusEnum } from '../../types/submission.types';

/** Finds one action by id, failing loudly when the builder dropped it. */
const findAction = (
    actions: SubmissionTeacherAction[],
    id: SubmissionTeacherActionId,
): SubmissionTeacherAction => {
    const action = actions.find(candidate => candidate.id === id);
    if (!action) throw new Error(`Action ${id} was not built`);
    return action;
};

describe('submissionTeacherActions constants', () => {
    describe('toApiLocalDateTime', () => {
        it('appends seconds to a datetime-local value so Spring can parse LocalDateTime', () => {
            expect(toApiLocalDateTime('2026-10-31T23:59')).toBe('2026-10-31T23:59:00');
        });

        it('keeps an already-complete value untouched', () => {
            expect(toApiLocalDateTime('2026-10-31T23:59:30')).toBe('2026-10-31T23:59:30');
        });

        it('returns undefined when no deadline was picked', () => {
            expect(toApiLocalDateTime('')).toBeUndefined();
            expect(toApiLocalDateTime(undefined)).toBeUndefined();
        });
    });

    describe('toDateTimeLocalValue', () => {
        it('truncates an API timestamp to the minute', () => {
            expect(toDateTimeLocalValue('2026-10-31T23:59:00')).toBe('2026-10-31T23:59');
        });

        it('accepts a space-separated timestamp', () => {
            expect(toDateTimeLocalValue('2026-10-31 23:59:00')).toBe('2026-10-31T23:59');
        });

        it('returns an empty string for missing or invalid input', () => {
            expect(toDateTimeLocalValue(null)).toBe('');
            expect(toDateTimeLocalValue('not-a-date')).toBe('');
        });
    });

    describe('buildSubmissionTeacherActions', () => {
        it('returns no actions in review mode so students cannot see tutor tools', () => {
            const actions = buildSubmissionTeacherActions(
                { status: SubmissionStatusEnum.GRADED },
                { isReviewMode: true },
            );

            expect(actions).toEqual([]);
        });

        it('returns no actions when no attempt is loaded yet', () => {
            expect(buildSubmissionTeacherActions(null)).toEqual([]);
            expect(buildSubmissionTeacherActions(undefined)).toEqual([]);
        });

        it('offers reopen and gia hạn for an auto-collected attempt', () => {
            const actions = buildSubmissionTeacherActions({
                status: SubmissionStatusEnum.AUTO_SUBMITTED,
                autoSubmitted: true,
            });

            expect(findAction(actions, 'reopen').enabled).toBe(true);
            expect(findAction(actions, 'extendDeadline').enabled).toBe(true);
            // An auto-collected attempt is not graded yet, so it cannot be exempted or regraded.
            expect(findAction(actions, 'exempt').enabled).toBe(false);
            expect(findAction(actions, 'regrade').enabled).toBe(false);
        });

        it('keeps reopen available for a blank auto-collected attempt and warns about the lost 0 score', () => {
            const actions = buildSubmissionTeacherActions({
                status: SubmissionStatusEnum.AUTO_SUBMITTED,
                autoSubmitted: true,
                hasAnswers: false,
            });
            const reopen = findAction(actions, 'reopen');

            expect(reopen.enabled).toBe(true);
            expect(reopen.confirmDescription).toContain('không có câu trả lời');
        });

        it('offers reopen, exempt and regrade for a graded attempt', () => {
            const actions = buildSubmissionTeacherActions({ status: SubmissionStatusEnum.GRADED });

            expect(findAction(actions, 'reopen').enabled).toBe(true);
            expect(findAction(actions, 'extendDeadline').enabled).toBe(true);
            expect(findAction(actions, 'exempt').enabled).toBe(true);
            expect(findAction(actions, 'regrade').enabled).toBe(true);
        });

        it('blocks every exception for an attempt the student never started', () => {
            const actions = buildSubmissionTeacherActions({ status: SubmissionStatusEnum.PENDING });

            actions.forEach(action => {
                expect(action.enabled).toBe(false);
                expect(action.disabledReason).toBeTruthy();
            });
        });

        it('disables gia hạn for an exempted attempt and says why', () => {
            const actions = buildSubmissionTeacherActions({
                status: SubmissionStatusEnum.GRADED,
                exempted: true,
            });
            const extend = findAction(actions, 'extendDeadline');

            expect(extend.enabled).toBe(false);
            expect(extend.disabledReason).toContain('miễn chấm');
        });

        it('explains that an already exempted attempt stays exempted', () => {
            const exempt = findAction(
                buildSubmissionTeacherActions({ status: SubmissionStatusEnum.GRADED, exempted: true }),
                'exempt',
            );

            expect(exempt.enabled).toBe(false);
            expect(exempt.disabledReason).toBe('Bài nộp đã được miễn chấm trước đó.');
        });

        it('treats a machine-collected attempt as reopenable even when the status already moved to GRADED', () => {
            const actions = buildSubmissionTeacherActions({
                status: SubmissionStatusEnum.GRADED,
                autoSubmitted: true,
                hasAnswers: false,
            });

            expect(findAction(actions, 'reopen').enabled).toBe(true);
        });

        it('marks only the destructive operations as destructive', () => {
            const actions = buildSubmissionTeacherActions({ status: SubmissionStatusEnum.GRADED });

            expect(findAction(actions, 'exempt').destructive).toBe(true);
            expect(findAction(actions, 'regrade').destructive).toBe(true);
            expect(findAction(actions, 'reopen').destructive).toBeFalsy();
            expect(findAction(actions, 'extendDeadline').destructive).toBeFalsy();
        });

        it('always returns the four exception operations in a stable order', () => {
            const actions = buildSubmissionTeacherActions({ status: SubmissionStatusEnum.GRADED });

            expect(actions.map(action => action.id)).toEqual([
                'reopen',
                'extendDeadline',
                'exempt',
                'regrade',
            ]);
        });
    });

    describe('single-action predicates', () => {
        it('canReopenSubmission is false for pending work and attempts still in progress', () => {
            expect(canReopenSubmission({ status: SubmissionStatusEnum.PENDING })).toBe(false);
            expect(canReopenSubmission({ status: SubmissionStatusEnum.DRAFT })).toBe(false);
            expect(canReopenSubmission(null)).toBe(false);
        });

        it('canExtendDeadline allows a submitted attempt awaiting grading', () => {
            expect(canExtendDeadline({ status: SubmissionStatusEnum.SUBMITTED })).toBe(true);
        });

        it('canExtendDeadline refuses an exempted attempt', () => {
            expect(canExtendDeadline({ status: SubmissionStatusEnum.GRADED, exempted: true })).toBe(false);
        });

        it('canExemptSubmission only accepts a graded, non-exempted attempt', () => {
            expect(canExemptSubmission({ status: SubmissionStatusEnum.GRADED })).toBe(true);
            expect(canExemptSubmission({ status: SubmissionStatusEnum.AUTO_SUBMITTED })).toBe(false);
            expect(canExemptSubmission({ status: SubmissionStatusEnum.GRADED, exempted: true })).toBe(false);
        });

        it('canRegradeSubmission mirrors the exemption rules', () => {
            expect(canRegradeSubmission({ status: SubmissionStatusEnum.GRADED })).toBe(true);
            expect(canRegradeSubmission({ status: SubmissionStatusEnum.SUBMITTED })).toBe(false);
            expect(canRegradeSubmission({ status: SubmissionStatusEnum.GRADED, exempted: true })).toBe(false);
        });
    });
});
