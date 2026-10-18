import { SubmissionStatusEnum } from '../types/submission.types';

/**
 * FB-09 / FB-22 — single source of truth for submission status presentation.
 *
 * Every screen (student list, student detail, grading page) must render labels and
 * colors from this module so the same concept never appears under two names.
 */
export interface SubmissionStatusPresentation {
    /** Vietnamese label shown in badges and column headers. */
    label: string;
    /** Short label used where horizontal space is tight (compact table cells). */
    shortLabel: string;
    /** Tailwind classes for outline/soft badges. */
    badgeClassName: string;
    /** Tailwind text color token, reuse for scores/icons next to the badge. */
    textClassName: string;
    /** Raw semantic token name, used to drive progress bars and accents (FB-10/FB-22). */
    token: 'pending' | 'inProgress' | 'submitted' | 'autoSubmitted' | 'graded';
    /** FB-22: Tailwind background for progress-bar fills, semantic per status. */
    progressClassName: string;
    /** FB-22: Tailwind text colour for a score, semantic per status. */
    scoreClassName: string;
    /** FB-22: Lucide icon name so every screen draws the same glyph per status. */
    iconName: string;
}

/** Sentinel used when a submission row exists but the backend sent no status. */
export const UNKNOWN_SUBMISSION_STATUS = 'UNKNOWN';

export const SUBMISSION_STATUS_PRESENTATION: Record<string, SubmissionStatusPresentation> = {
    [SubmissionStatusEnum.PENDING]: {
        label: 'Chờ làm',
        shortLabel: 'Chờ',
        badgeClassName: 'border-orange-500/50 text-orange-700 bg-orange-50/70 dark:text-orange-300 dark:bg-orange-950/40',
        textClassName: 'text-orange-600 dark:text-orange-400',
        token: 'pending',
        // FB-22: nothing done yet — neutral (slate) instead of an alarming colour.
        progressClassName: 'bg-slate-400 dark:bg-slate-500',
        scoreClassName: 'text-muted-foreground',
        iconName: 'Clock',
    },
    [SubmissionStatusEnum.DRAFT]: {
        label: 'Đang làm',
        shortLabel: 'Đang làm',
        badgeClassName: 'border-sky-500/50 text-sky-700 bg-sky-50/70 dark:text-sky-300 dark:bg-sky-950/40',
        textClassName: 'text-sky-600 dark:text-sky-400',
        token: 'inProgress',
        // FB-22: work in flight is neither good nor bad news — neutral (slate).
        progressClassName: 'bg-slate-400 dark:bg-slate-500',
        scoreClassName: 'text-muted-foreground',
        iconName: 'PencilLine',
    },
    [SubmissionStatusEnum.SUBMITTED]: {
        label: 'Đã nộp',
        shortLabel: 'Đã nộp',
        badgeClassName: 'border-blue-500/50 text-blue-700 bg-blue-50/70 dark:text-blue-300 dark:bg-blue-950/40',
        textClassName: 'text-blue-600 dark:text-blue-400',
        token: 'submitted',
        // FB-22: submitted work still needs a hand-graded pass — amber, not green.
        progressClassName: 'bg-amber-500 dark:bg-amber-400',
        scoreClassName: 'text-amber-600 dark:text-amber-400',
        iconName: 'FileText',
    },
    [SubmissionStatusEnum.AUTO_SUBMITTED]: {
        // FB-01: system-collected attempt. Destructive on purpose — it must never read
        // as a genuine student submission.
        label: 'Tự thu',
        shortLabel: 'Tự thu',
        badgeClassName: 'border-red-500/60 text-red-700 bg-red-50/80 dark:text-red-300 dark:bg-red-950/50',
        textClassName: 'text-red-600 dark:text-red-400',
        token: 'autoSubmitted',
        // FB-22: the system collected this because the student did not — always red.
        progressClassName: 'bg-red-500 dark:bg-red-400',
        scoreClassName: 'text-red-600 dark:text-red-400',
        iconName: 'Bot',
    },
    [SubmissionStatusEnum.GRADED]: {
        label: 'Đã chấm',
        shortLabel: 'Đã chấm',
        badgeClassName: 'border-emerald-500/50 text-emerald-700 bg-emerald-50/70 dark:text-emerald-300 dark:bg-emerald-950/40',
        textClassName: 'text-emerald-600 dark:text-emerald-400',
        token: 'graded',
        // FB-22: the only status that reads as a genuine result — green.
        progressClassName: 'bg-emerald-500 dark:bg-emerald-400',
        scoreClassName: 'text-emerald-600 dark:text-emerald-400',
        iconName: 'CheckCircle2',
    },
};

const FALLBACK_PRESENTATION: SubmissionStatusPresentation = {
    label: 'Chưa xác định',
    shortLabel: '—',
    badgeClassName: 'border-muted-foreground/40 text-muted-foreground bg-muted/40',
    textClassName: 'text-muted-foreground',
    token: 'pending',
    progressClassName: 'bg-slate-400 dark:bg-slate-500',
    scoreClassName: 'text-muted-foreground',
    iconName: 'Clock',
};

/** Resolves presentation metadata for a status coming from the API. */
export const getSubmissionStatusPresentation = (status?: string | null): SubmissionStatusPresentation =>
    (status ? SUBMISSION_STATUS_PRESENTATION[status] : undefined) ?? FALLBACK_PRESENTATION;

/** Vietnamese label for a submission status, with a safe fallback. */
export const getSubmissionStatusLabel = (status?: string | null): string =>
    getSubmissionStatusPresentation(status).label;

/** True when the attempt was collected by the system instead of the student (FB-01). */
export const isAutoCollected = (submission?: { status?: string | null; autoSubmitted?: boolean | null } | null): boolean =>
    !!submission && (submission.autoSubmitted === true || submission.status === SubmissionStatusEnum.AUTO_SUBMITTED);

/**
 * FB-03 — a blank auto-collected attempt needs no human grading at all.
 * `hasAnswers === undefined` is treated as "has answers" so older payloads keep the
 * full grading page instead of collapsing it by mistake.
 */
export const isBlankAutoCollected = (
    submission?: { status?: string | null; autoSubmitted?: boolean | null; hasAnswers?: boolean | null } | null,
): boolean => isAutoCollected(submission) && submission?.hasAnswers === false;

/**
 * FB-02 — an attempt counts towards real progress only when the student actually did it.
 */
export const countsTowardProgress = (submission?: {
    status?: string | null;
    autoSubmitted?: boolean | null;
    exempted?: boolean | null;
} | null): boolean =>
    !!submission && !submission.exempted && !isAutoCollected(submission);

/** FB-22: semantic colour buckets for a score/progress value. */
export type ScoreBand = 'high' | 'medium' | 'low';

export interface ScorePresentation {
    band: ScoreBand;
    /** Tailwind text colour for the score number. */
    scoreClassName: string;
    /** Tailwind background for a progress bar filled with this value. */
    progressClassName: string;
}

export const SCORE_PRESENTATION: Record<ScoreBand, Omit<ScorePresentation, 'band'>> = {
    // FB-22: >= 80 is solid, 50-79 needs attention, below 50 (and 0) is a fail.
    high: {
        scoreClassName: 'text-emerald-600 dark:text-emerald-400',
        progressClassName: 'bg-emerald-500 dark:bg-emerald-400',
    },
    medium: {
        scoreClassName: 'text-amber-600 dark:text-amber-400',
        progressClassName: 'bg-amber-500 dark:bg-amber-400',
    },
    low: {
        scoreClassName: 'text-red-600 dark:text-red-400',
        progressClassName: 'bg-red-500 dark:bg-red-400',
    },
};

/**
 * FB-22 — maps a 0-100 score to its semantic band.
 * A system-collected attempt is always `low`, even if the raw number looks high.
 */
export const getScoreBand = (score?: number | null, autoSubmitted?: boolean | null): ScoreBand => {
    if (autoSubmitted) return 'low';
    if (typeof score !== 'number' || Number.isNaN(score) || score <= 0) return 'low';
    if (score >= 80) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
};

/** FB-22 — convenience wrapper returning both colour classes for a score. */
export const getScorePresentation = (
    score?: number | null,
    options?: { autoSubmitted?: boolean | null },
): ScorePresentation => {
    const band = getScoreBand(score, options?.autoSubmitted);
    return { band, ...SCORE_PRESENTATION[band] };
};
