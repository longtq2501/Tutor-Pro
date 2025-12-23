/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Parent {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ParentRequest {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface Student {
  id: number;
  name: string;
  phone?: string;
  schedule: string;
  pricePerHour: number;
  notes?: string;
  active: boolean;
  startMonth: string;
  lastActiveMonth?: string;
  monthsLearned?: number;
  learningDuration?: string;
  createdAt: string;
  totalPaid: number;
  totalUnpaid: number;
  parent?: Parent; // Sửa từ 'any' thành Parent interface

  parentId?: number;      // ← THÊM
  parentName?: string;    // ← THÊM  
  parentEmail?: string;   // ← THÊM
  parentPhone?: string;   // ← THÊM
}

export interface StudentRequest {
  name: string;
  phone?: string;
  schedule: string;
  pricePerHour: number;
  notes?: string;
  active?: boolean;
  startMonth?: string;

  parentId?: number;      // ← THÊM
}

export interface SessionRecord {
  id: number;
  studentId: number;
  studentName: string;
  month: string;
  sessions: number;
  hours: number;
  pricePerHour: number;
  totalAmount: number;
  paid: boolean;
  completed?: boolean; // ← THÊM: Trạng thái đã dạy hay chưa
  paidAt?: string;
  notes?: string;
  sessionDate: string;
  hoursPerSession: number;
  createdAt: string;
}

export interface SessionRecordRequest {
  studentId: number;
  month: string;
  sessions: number;
  sessionDate: string;
  hoursPerSession: number;
  notes?: string;
  completed?: boolean; // ← THÊM
}

export interface DashboardStats {
  totalStudents: number;
  totalPaidAllTime: number;
  totalUnpaidAllTime: number;
  currentMonthTotal: number;
  currentMonthUnpaid: number;
}

export interface MonthlyStats {
  month: string;
  totalPaid: number;
  totalUnpaid: number;
  totalSessions: number;
}

// api.ts - thêm field vào InvoiceRequest interface
export interface InvoiceRequest {
  studentId?: number;
  month: string;
  sessionRecordIds?: number[];
  allStudents?: boolean;
  multipleStudents?: boolean; // NEW
  selectedStudentIds?: number[]; // NEW
}

export interface InvoiceResponse {
  invoiceNumber: string;
  studentName: string;
  month: string;
  totalSessions: number;
  totalHours: number;
  totalAmount: number;
  items: InvoiceItem[];
  bankInfo: BankInfo;
  qrCodeUrl: string;
  createdDate: string;
}

export interface InvoiceItem {
  date: string;
  description: string;
  sessions: number;
  hours: number;
  pricePerHour: number;
  amount: number;
}

export interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
  swiftCode: string;
}

export type DocumentCategory = 
  | 'GRAMMAR' | 'VOCABULARY' | 'READING' | 'LISTENING'
  | 'SPEAKING' | 'WRITING' | 'EXERCISES' | 'EXAM'
  | 'PET' | 'FCE' | 'IELTS' | 'TOEIC' | 'OTHER';

export interface Document {
  id: number;
  title: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  category: DocumentCategory;
  categoryDisplayName: string;
  description?: string;
  studentId?: number;
  studentName?: string;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  formattedFileSize: string;
}

export interface DocumentUploadRequest {
  title: string;
  category: DocumentCategory;
  description?: string;
  studentId?: number;
}

export interface DocumentStats {
  totalDocuments: number;
  totalSize: number;
  formattedTotalSize: string;
  totalDownloads: number;
  categoryStats: {
    grammar: number;
    vocabulary: number;
    reading: number;
    listening: number;
    speaking: number;
    writing: number;
    exercises: number;
    exam: number;
    pet: number;
    fce: number;
    ielts: number;
    toeic: number;
    other: number;
  };
}

export interface RecurringSchedule {
  id: number;
  studentId: number;
  studentName: string;
  daysOfWeek: number[];          // [1,3,5] = Thứ 2,4,6
  daysOfWeekDisplay: string;     // "Thứ 2, 4, 6"
  startTime: string;             // "18:00"
  endTime: string;               // "20:00"
  timeRange: string;             // "18:00-20:00"
  hoursPerSession: number;       // 2.0
  startMonth: string;            // "2025-01"
  endMonth?: string;             // "2025-12" (optional)
  active: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringScheduleRequest {
  studentId: number;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  hoursPerSession: number;
  startMonth: string;
  endMonth?: string;
  active?: boolean;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string; // LocalDateTime từ Java sẽ được convert thành chuỗi ISO string khi về JS
}

export type HomeworkStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'OVERDUE';
export type HomeworkPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Homework {
  id: number;
  studentId: number;
  studentName: string;
  sessionRecordId?: number;
  title: string;
  description?: string;
  dueDate: string;
  status: HomeworkStatus;
  priority: HomeworkPriority;
  attachmentUrls: string[];
  tutorNotes?: string;
  submittedAt?: string;
  submissionUrls: string[];
  submissionNotes?: string;
  score?: number;
  feedback?: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
  isOverdue: boolean;
  daysUntilDue?: number;
}

export interface CreateHomeworkRequest {
  studentId: number;
  sessionRecordId?: number;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  tutorNotes?: string;
  attachmentUrls?: string[];
}

export interface HomeworkStats {
  totalHomeworks: number;
  assignedCount: number;
  inProgressCount: number;
  submittedCount: number;
  gradedCount: number;
  overdueCount: number;
  upcomingCount: number;
  averageScore: number;
}

export interface HomeworkRequest {
  studentId: number;
  sessionRecordId?: number;
  title: string;
  description?: string;
  dueDate: string;
  priority: HomeworkPriority;
  tutorNotes?: string;
  attachmentUrls?: string[];
}

export interface HomeworkSubmissionRequest {
  submissionNotes?: string;
  submissionUrls?: string[];
}

export interface HomeworkGradingRequest {
  score: number;
  feedback?: string;
}

export interface HomeworkStatusUpdateRequest {
  status: HomeworkStatus;
}

/**
 * LessonImage - Images associated with a lesson
 * 
 * ⚠️ IMPORTANT:
 * - id is OPTIONAL because new images don't have IDs yet
 * - caption is OPTIONAL because it's not always provided
 */
export interface LessonImage {
  id?: number;              // ✅ Optional - new images from frontend don't have ID
  imageUrl: string;         // Required - must have image URL
  caption?: string;         // ✅ Optional - caption can be empty
  displayOrder: number;     // Required - for sorting
}

/**
 * LessonResource - Resources (PDFs, links, videos) associated with a lesson
 * 
 * ⚠️ IMPORTANT:
 * - id is OPTIONAL for same reason as images
 * - description is OPTIONAL
 * - fileSize is OPTIONAL (only for uploaded files, not links)
 */
export interface LessonResource {
  id?: number;              // ✅ Optional - new resources don't have ID
  title: string;            // Required
  description?: string;     // ✅ Optional - description can be empty
  resourceUrl: string;      // Required
  resourceType: 'PDF' | 'LINK' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  fileSize?: number;        // ✅ Optional - bytes, only for uploaded files
  formattedFileSize?: string; // ✅ Optional - backend-calculated
  displayOrder: number;     // Required - for sorting
}

/**
 * Lesson - Main lesson entity (STUDENT VIEW)
 * 
 * ⚠️ SCHEMA CHANGES (Dec 2025):
 * - REMOVED: studentId, studentName (moved to LessonAssignment)
 * - REMOVED: totalViewCount (now just viewCount from assignment)
 * - ADDED: isLibrary (true = unassigned, false = assigned to students)
 * - Student-specific fields (viewCount, isCompleted) come from LessonAssignment
 */
export interface Lesson {
  // Core fields
  id: number;
  tutorName: string;
  title: string;
  summary?: string;
  content?: string;          // Markdown content
  lessonDate: string;        // ISO date string (YYYY-MM-DD)
  
  // Media
  videoUrl?: string;
  thumbnailUrl?: string;
  
  // Status flags
  isLibrary: boolean;        // ✅ NEW: true if not assigned to any student
  isPublished: boolean;
  publishedAt?: string;
  
  // ❌ REMOVED: studentId, studentName (no longer in Many-to-Many)
  
  // Student-specific fields (from LessonAssignment)
  viewCount: number;         // ✅ RENAMED from totalViewCount
  isCompleted: boolean;
  completedAt?: string;
  
  // Relationships
  images: LessonImage[];
  resources: LessonResource[];
  
  // Aggregated statistics (for admin view)
  assignedStudentCount: number;  // How many students have this lesson
  completionRate: number;        // % of students who completed it
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * LessonStats - Statistics for student's lessons
 */
export interface LessonStats {
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  completionRate: number;
}

export interface AdminLessonImage {
  imageUrl: string;
  caption?: string;
  displayOrder: number;
}

export interface AdminLessonResource {
  title: string;
  description?: string;
  resourceUrl: string;
  resourceType: 'PDF' | 'LINK' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  fileSize?: number;
  displayOrder: number;
}

/**
 * AdminLesson - Lesson entity for admin/library view
 * 
 * ⚠️ DIFFERENCE FROM Lesson:
 * - No student-specific fields (viewCount, isCompleted)
 * - Shows aggregated statistics instead
 * - Used in lesson library management
 */
export interface AdminLesson {
  id: number;
  tutorName: string;
  title: string;
  summary?: string;
  content?: string;
  lessonDate: string;
  
  videoUrl?: string;
  thumbnailUrl?: string;
  
  isLibrary: boolean;
  isPublished: boolean;
  publishedAt?: string;
  
  // Aggregated statistics
  assignedStudentCount: number;
  totalViewCount: number;      // ✅ Sum of all students' view counts
  completionRate: number;
  
  images: LessonImage[];
  resources: LessonResource[];
  
  createdAt: string;
  updatedAt: string;
}

/**
 * CreateLessonRequest - Payload for creating new lesson
 * 
 * ⚠️ CHANGES:
 * - studentIds is now OPTIONAL (can create library lesson without students)
 * - Uses LessonImage/LessonResource (not Admin versions)
 */
export interface CreateLessonRequest {
  studentIds?: number[];     // ✅ Optional - for library lessons
  tutorName: string;
  title: string;
  summary?: string;
  content?: string;
  lessonDate: string;        // Format: YYYY-MM-DD
  videoUrl?: string;
  thumbnailUrl?: string;
  images?: LessonImage[];    // ✅ NOT AdminLessonImage
  resources?: LessonResource[]; // ✅ NOT AdminLessonResource
  isPublished?: boolean;
}

/**
 * UpdateLessonRequest - Payload for updating lesson
 * All fields optional except what you want to change
 */
export interface UpdateLessonRequest {
  tutorName?: string;
  title?: string;
  summary?: string;
  content?: string;
  lessonDate?: string;       // Format: YYYY-MM-DD
  videoUrl?: string;
  thumbnailUrl?: string;
  images?: LessonImage[];
  resources?: LessonResource[];
  isPublished?: boolean;
}

export interface AdminLessonStats {
  totalLessons: number;
  publishedLessons: number;
  draftLessons: number;
  completedLessons: number;
}

/**
 * LibraryLesson - Simplified lesson info for library view
 */
export interface LibraryLesson {
  id: number;
  tutorName: string;
  title: string;
  summary?: string;
  lessonDate: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  isLibrary: boolean;
  assignedStudentCount: number;
  totalViewCount: number;
  completionRate: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 🛠️ HELPER FUNCTIONS
// ============================================

/**
 * Format file size from bytes to human-readable string
 * 
 * @example
 * formatBytes(1024) → "1 KB"
 * formatBytes(1048576) → "1 MB"
 */
export function formatBytes(bytes: number | undefined | null): string {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

/**
 * Validate if a date string is in YYYY-MM-DD format
 */
export function isValidDateFormat(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateStr);
}

/**
 * Sanitize lesson data before sending to backend
 * - Removes undefined fields
 * - Converts empty strings to undefined
 * - Trims all string values
 */
export function sanitizeLessonPayload<T extends Record<string, any>>(data: T): T {
  const sanitized: any = { ...data };  // ✅ Use 'any' for intermediate object
  
  Object.keys(sanitized).forEach((key: string) => {
    const value = sanitized[key];
    
    // Remove undefined
    if (value === undefined) {
      delete sanitized[key];
      return;
    }
    
    // Convert empty strings to undefined
    if (value === '') {
      sanitized[key] = undefined;
      return;
    }
    
    // Trim strings
    if (typeof value === 'string') {
      const trimmed = value.trim();
      sanitized[key] = trimmed || undefined;
    }
  });
  
  return sanitized as T;  // ✅ Cast back to T
}

/**
 * Type guard to check if lesson is library lesson
 */
export function isLibraryLesson(lesson: Lesson | AdminLesson): boolean {
  return lesson.isLibrary === true;
}

/**
 * Type guard to check if lesson is assigned
 */
export function isAssignedLesson(lesson: Lesson | AdminLesson): boolean {
  return lesson.assignedStudentCount > 0;
}

// ============================================
// 📊 TYPE GUARDS & VALIDATORS
// ============================================

/**
 * Validate LessonImage data
 */
export function isValidLessonImage(img: any): img is LessonImage {
  return (
    typeof img === 'object' &&
    typeof img.imageUrl === 'string' &&
    typeof img.displayOrder === 'number'
  );
}

/**
 * Validate LessonResource data
 */
export function isValidLessonResource(res: any): res is LessonResource {
  return (
    typeof res === 'object' &&
    typeof res.title === 'string' &&
    typeof res.resourceUrl === 'string' &&
    ['PDF', 'LINK', 'IMAGE', 'VIDEO', 'DOCUMENT'].includes(res.resourceType) &&
    typeof res.displayOrder === 'number'
  );
}