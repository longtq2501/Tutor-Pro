import { describe, expect, it } from 'vitest';
import {
    SUBMISSION_STATUS_PRESENTATION,
    countsTowardProgress,
    getScoreBand,
    getScorePresentation,
    getSubmissionStatusLabel,
    getSubmissionStatusPresentation,
    isAutoCollected,
    isBlankAutoCollected,
} from '../submissionStatus';
import { SubmissionStatusEnum } from '../../types/submission.types';

describe('submissionStatus constants', () => {
    describe('getSubmissionStatusPresentation', () => {
        it('returns the Vietnamese label and destructive token for AUTO_SUBMITTED', () => {
            const presentation = getSubmissionStatusPresentation(SubmissionStatusEnum.AUTO_SUBMITTED);

            // FB-01/FB-09: the system-collected concept must always read as "Tự thu".
            expect(presentation.label).toBe('Tự thu');
            expect(presentation.token).toBe('autoSubmitted');
            expect(presentation.badgeClassName).toContain('red');
        });

        it('uses distinct labels for every status so no two states look alike', () => {
            const labels = Object.values(SUBMISSION_STATUS_PRESENTATION).map(p => p.label);

            expect(labels).toEqual(['Chờ làm', 'Đang làm', 'Đã nộp', 'Tự thu', 'Đã chấm']);
            expect(new Set(labels).size).toBe(labels.length);
        });

        it('falls back safely for a missing or unknown status', () => {
            expect(getSubmissionStatusLabel(undefined)).toBe('Chưa xác định');
            expect(getSubmissionStatusLabel(null)).toBe('Chưa xác định');
            expect(getSubmissionStatusLabel('SOMETHING_NEW')).toBe('Chưa xác định');
        });
    });

    describe('isAutoCollected', () => {
        it('detects the AUTO_SUBMITTED status even without the boolean flag', () => {
            expect(isAutoCollected({ status: SubmissionStatusEnum.AUTO_SUBMITTED })).toBe(true);
        });

        it('detects the autoSubmitted flag even when the status is GRADED', () => {
            // A blank MCQ attempt is auto-graded to GRADED but still machine-collected.
            expect(isAutoCollected({
                status: SubmissionStatusEnum.GRADED,
                autoSubmitted: true,
            })).toBe(true);
        });

        it('returns false for a genuine student submission', () => {
            expect(isAutoCollected({
                status: SubmissionStatusEnum.SUBMITTED,
                autoSubmitted: false,
            })).toBe(false);
        });

        it('returns false when no submission is supplied', () => {
            expect(isAutoCollected(null)).toBe(false);
            expect(isAutoCollected(undefined)).toBe(false);
        });
    });

    describe('isBlankAutoCollected', () => {
        it('is true only when the attempt was auto-collected and has no answers', () => {
            expect(isBlankAutoCollected({
                status: SubmissionStatusEnum.AUTO_SUBMITTED,
                autoSubmitted: true,
                hasAnswers: false,
            })).toBe(true);
        });

        it('keeps the full grading page when the auto-collected attempt has answers', () => {
            expect(isBlankAutoCollected({
                status: SubmissionStatusEnum.AUTO_SUBMITTED,
                autoSubmitted: true,
                hasAnswers: true,
            })).toBe(false);
        });

        it('treats a missing hasAnswers flag as "has answers" for backwards compatibility', () => {
            expect(isBlankAutoCollected({
                status: SubmissionStatusEnum.AUTO_SUBMITTED,
            })).toBe(false);
        });

        it('never flags a genuine student submission as blank auto-collected', () => {
            expect(isBlankAutoCollected({
                status: SubmissionStatusEnum.SUBMITTED,
                hasAnswers: false,
            })).toBe(false);
        });
    });

    describe('countsTowardProgress', () => {
        it('counts a real graded or submitted attempt', () => {
            expect(countsTowardProgress({ status: SubmissionStatusEnum.GRADED })).toBe(true);
            expect(countsTowardProgress({ status: SubmissionStatusEnum.SUBMITTED })).toBe(true);
        });

        it('excludes auto-collected attempts', () => {
            expect(countsTowardProgress({ status: SubmissionStatusEnum.AUTO_SUBMITTED })).toBe(false);
            expect(countsTowardProgress({
                status: SubmissionStatusEnum.GRADED,
                autoSubmitted: true,
            })).toBe(false);
        });

        it('excludes exempted attempts', () => {
            expect(countsTowardProgress({
                status: SubmissionStatusEnum.GRADED,
                exempted: true,
            })).toBe(false);
        });

        it('returns false when no submission is supplied', () => {
            expect(countsTowardProgress(null)).toBe(false);
        });
    });

    describe('getScoreBand (FB-22)', () => {
        it('returns high for scores at or above 80', () => {
            expect(getScoreBand(80)).toBe('high');
            expect(getScoreBand(100)).toBe('high');
        });

        it('returns medium for scores between 50 and 79', () => {
            expect(getScoreBand(50)).toBe('medium');
            expect(getScoreBand(79)).toBe('medium');
        });

        it('returns low for failing scores below 50', () => {
            expect(getScoreBand(49)).toBe('low');
            expect(getScoreBand(1)).toBe('low');
        });

        it('treats a zero, missing or invalid score as low', () => {
            expect(getScoreBand(0)).toBe('low');
            expect(getScoreBand(null)).toBe('low');
            expect(getScoreBand(undefined)).toBe('low');
            expect(getScoreBand(Number.NaN)).toBe('low');
        });

        it('forces an auto-collected attempt to low even when the number looks high', () => {
            // FB-01/FB-22: "Tự thu" must never be painted as a pass.
            expect(getScoreBand(100, true)).toBe('low');
        });
    });

    describe('getScorePresentation (FB-22)', () => {
        it('pairs each band with its matching colour classes', () => {
            const high = getScorePresentation(90);
            expect(high.band).toBe('high');
            expect(high.scoreClassName).toContain('emerald');
            expect(high.progressClassName).toContain('emerald');

            const medium = getScorePresentation(60);
            expect(medium.band).toBe('medium');
            expect(medium.scoreClassName).toContain('amber');
            expect(medium.progressClassName).toContain('amber');

            const low = getScorePresentation(10);
            expect(low.band).toBe('low');
            expect(low.scoreClassName).toContain('red');
            expect(low.progressClassName).toContain('red');
        });

        it('never paints an auto-collected attempt as successful', () => {
            const presentation = getScorePresentation(95, { autoSubmitted: true });

            expect(presentation.band).toBe('low');
            expect(presentation.scoreClassName).toContain('red');
            expect(presentation.progressClassName).toContain('red');
        });
    });
});
