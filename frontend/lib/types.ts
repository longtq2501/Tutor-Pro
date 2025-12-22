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

export interface Lesson {
  id: number;
  studentId: number;
  studentName: string;
  tutorName: string;
  
  title: string;
  summary: string;
  content: string;  // Markdown
  lessonDate: string;  // ISO date string
  
  videoUrl?: string;
  thumbnailUrl?: string;
  
  isCompleted: boolean;
  completedAt?: string;
  viewCount: number;
  lastViewedAt?: string;
  
  images: LessonImage[];
  resources: LessonResource[];
  
  createdAt: string;
  updatedAt: string;
}

export interface LessonImage {
  id: number;
  imageUrl: string;
  caption?: string;
  displayOrder: number;
}

export interface LessonResource {
  id: number;
  title: string;
  description?: string;
  resourceUrl: string;
  resourceType: 'PDF' | 'LINK' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  fileSize?: number;
  formattedFileSize: string;
  displayOrder: number;
}

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

export interface AdminLesson {
  id: number;
  studentId: number;
  studentName: string;
  tutorName: string;
  
  title: string;
  summary?: string;
  content?: string;  // Markdown content
  lessonDate: string;  // ISO date string
  
  videoUrl?: string;
  thumbnailUrl?: string;
  
  isPublished: boolean;
  publishedAt?: string;
  
  isCompleted: boolean;
  completedAt?: string;
  viewCount: number;
  lastViewedAt?: string;
  
  images: AdminLessonImage[];
  resources: AdminLessonResource[];
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonRequest {
  studentIds: number[];  // Frontend uses number[]
  tutorName: string;
  title: string;
  summary?: string;
  content?: string;
  lessonDate: string;  // Must be 'yyyy-MM-dd' format
  videoUrl?: string;
  thumbnailUrl?: string;
  images?: AdminLessonImage[];
  resources?: AdminLessonResource[];
  isPublished: boolean;
}

export interface UpdateLessonRequest {
  tutorName?: string;
  title?: string;
  summary?: string;
  content?: string;
  lessonDate?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  images?: AdminLessonImage[];
  resources?: AdminLessonResource[];
  isPublished?: boolean;
}

export interface AdminLessonStats {
  totalLessons: number;
  publishedLessons: number;
  draftLessons: number;
  completedLessons: number;
}