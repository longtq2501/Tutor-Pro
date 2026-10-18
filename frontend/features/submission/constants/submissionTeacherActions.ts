import { SubmissionStatusEnum } from '../types/submission.types';
import { isBlankAutoCollected } from './submissionStatus';

/**
 * FB-04 — teacher exception workflow.
 *
 * The backend exposes four tutor-only operations on a single attempt
 * (`reopen`, `extend`, `exempt`, `regrade`). This module keeps the
 * *decision logic* — which action is offered for which attempt, and which
 * label/description it carries — in one pure, testable place so the grading
 * page and the submission list can never drift apart.
 */

/** Identifier of a teacher exception operation. */
export type SubmissionTeacherActionId = 'reopen' | 'extendDeadline' | 'exempt' | 'regrade';

export interface SubmissionTeacherAction {
    id: SubmissionTeacherActionId;
    /** Vietnamese button label. */
    label: string;
    /** Explanation shown under the label / in the confirmation dialog. */
    description: string;
    /**
     * True when the action may be triggered. Disabled actions stay visible so
     * the tutor understands the workflow instead of hunting for a button.
     */
    enabled: boolean;
    /** Why the action is disabled — rendered as the tooltip. */
    disabledReason?: string;
    /** Confirmation dialog text used by the UI before calling the API. */
    confirmTitle?: string;
    confirmDescription?: string;
    confirmText?: string;
    /** Renders the confirmation button in a destructive style. */
    destructive?: boolean;
}

/** Minimal attempt shape the decision logic depends on. */
export interface SubmissionTeacherActionSubject {
    status?: string | null;
    autoSubmitted?: boolean | null;
    hasAnswers?: boolean | null;
    exempted?: boolean | null;
}

/** Context the UI knows but the attempt payload does not. */
export interface SubmissionTeacherActionContext {
    /** Review mode is a read-only screen (student viewing their own work). */
    isReviewMode?: boolean;
}

/**
 * Converts a `datetime-local` input value (`YYYY-MM-DDTHH:mm`) into the
 * ISO-8601 local date-time the backend `ExtendDeadlineRequest` expects.
 *
 * Mirrors `useExerciseListLogic.toApiLocalDateTime` so every deadline the
 * frontend sends uses one single format.
 */
export const toApiLocalDateTime = (value?: string): string | undefined => {
    if (!value) return undefined;
    return value.length === 16 ? `${value}:00` : value;
};

/**
 * Normalises an ISO/local date-time coming back from the API into the value a
 * `<input type="datetime-local">` can consume (`YYYY-MM-DDTHH:mm`).
 */
export const toDateTimeLocalValue = (value?: string | null): string => {
    if (!value) return '';

    const directMatch = value.match(/^(\d{4}-\d{2}-\d{2})[T\s](\d{2}:\d{2})/);
    if (directMatch) {
        return `${directMatch[1]}T${directMatch[2]}`;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
};

const isMachineCollected = (submission: SubmissionTeacherActionSubject): boolean =>
    submission.autoSubmitted === true || submission.status === SubmissionStatusEnum.AUTO_SUBMITTED;

const isGraded = (submission: SubmissionTeacherActionSubject): boolean =>
    submission.status === SubmissionStatusEnum.GRADED;

const isPending = (submission: SubmissionTeacherActionSubject): boolean =>
    submission.status === SubmissionStatusEnum.PENDING;

/**
 * True when the attempt is worth reopening: either the system collected it
 * (student never really submitted) or a tutor already graded it and wants to
 * hand it back for another attempt.
 */
export const canReopenSubmission = (submission?: SubmissionTeacherActionSubject | null): boolean =>
    !!submission && !isPending(submission) && (isMachineCollected(submission) || isGraded(submission));

/**
 * True when the tutor may grant another deadline. Exempted attempts are
 * finished business and never need one.
 */
export const canExtendDeadline = (submission?: SubmissionTeacherActionSubject | null): boolean =>
    !!submission && submission.exempted !== true && !isPending(submission);

/**
 * True when the attempt may be exempted (miễn chấm). Only a graded attempt can
 * be exempted, because the exemption finalises it at 0 points.
 */
export const canExemptSubmission = (submission?: SubmissionTeacherActionSubject | null): boolean =>
    !!submission && isGraded(submission) && submission.exempted !== true;

/**
 * True when the attempt may be reset for re-grading. Only a graded attempt that
 * is not exempted can go back to the pending-grading queue.
 */
export const canRegradeSubmission = (submission?: SubmissionTeacherActionSubject | null): boolean =>
    !!submission && isGraded(submission) && submission.exempted !== true;

/**
 * Builds the ordered list of teacher exception actions for one attempt.
 *
 * Every action is always returned so the UI can explain *why* something is not
 * available; callers decide whether to hide or disable based on `enabled`.
 */
export const buildSubmissionTeacherActions = (
    submission?: SubmissionTeacherActionSubject | null,
    context: SubmissionTeacherActionContext = {},
): SubmissionTeacherAction[] => {
    if (!submission || context.isReviewMode) {
        return [];
    }

    const blankAutoCollected = isBlankAutoCollected(submission);
    const machineCollected = isMachineCollected(submission);
    const pending = isPending(submission);
    const exempted = submission.exempted === true;

    const reopen: SubmissionTeacherAction = {
        id: 'reopen',
        label: 'Mở lại cho học sinh làm tiếp',
        description: machineCollected
            ? 'Hệ thống tự thu bài này khi hết hạn. Mở lại sẽ xoá thời điểm nộp và đưa bài về trạng thái "Đang làm".'
            : 'Đưa bài đã chấm về trạng thái "Đang làm" để học sinh làm lại.',
        enabled: canReopenSubmission(submission),
        disabledReason: pending
            ? 'Học sinh chưa bắt đầu làm bài này.'
            : 'Bài nộp chưa có nội dung nào để mở lại.',
        confirmTitle: 'Mở lại bài nộp?',
        confirmDescription: blankAutoCollected
            ? 'Bài tự thu không có câu trả lời sẽ được mở lại để học sinh làm tiếp. Điểm 0 hiện tại sẽ không còn hiệu lực.'
            : 'Bài nộp sẽ trở về trạng thái "Đang làm" và học sinh có thể tiếp tục trả lời.',
        confirmText: 'Mở lại',
    };

    const extend: SubmissionTeacherAction = {
        id: 'extendDeadline',
        label: 'Gia hạn thời gian nộp',
        description: 'Gia hạn hạn nộp riêng cho học sinh này. Nếu bài đã bị tự thu, hệ thống cũng mở lại luôn.',
        enabled: canExtendDeadline(submission),
        disabledReason: pending
            ? 'Học sinh chưa bắt đầu làm bài này.'
            : 'Bài nộp đã được miễn chấm nên không cần gia hạn.',
        confirmText: 'Gia hạn',
    };

    const exempt: SubmissionTeacherAction = {
        id: 'exempt',
        label: exempted ? 'Bài nộp đã được miễn chấm' : 'Miễn chấm bài nộp',
        description: 'Đánh dấu bài nộp là miễn chấm và chốt 0 điểm, bài không còn nằm trong danh sách chờ chấm.',
        enabled: canExemptSubmission(submission),
        disabledReason: exempted
            ? 'Bài nộp đã được miễn chấm trước đó.'
            : 'Chỉ có thể miễn chấm sau khi bài nộp được chấm.',
        confirmTitle: 'Miễn chấm bài nộp?',
        confirmDescription:
            'Bài nộp sẽ được chốt 0 điểm và bị loại khỏi danh sách chờ chấm. Hành động này có thể hoàn tác bằng "Chấm lại từ đầu".',
        confirmText: 'Miễn chấm',
        destructive: true,
    };

    const regrade: SubmissionTeacherAction = {
        id: 'regrade',
        label: 'Chấm lại từ đầu',
        description: 'Đưa bài nộp về trạng thái chờ chấm để chấm lại toàn bộ phần tự luận.',
        enabled: canRegradeSubmission(submission),
        disabledReason: exempted
            ? 'Bài nộp đang được miễn chấm, hãy bỏ miễn chấm trước khi chấm lại.'
            : 'Chỉ có thể chấm lại bài đã chấm.',
        confirmTitle: 'Chấm lại bài nộp?',
        confirmDescription: 'Điểm tự luận và nhận xét hiện tại sẽ bị xoá để bạn chấm lại từ đầu.',
        confirmText: 'Chấm lại',
        destructive: true,
    };

    return [reopen, extend, exempt, regrade];
};
