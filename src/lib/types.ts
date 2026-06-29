export type UserRole = "admin" | "hr" | "viewer";

export type Permission =
  | "view_candidates"
  | "edit_candidates"
  | "delete_candidates"
  | "manage_users"
  | "create_links"
  | "delete_links"
  | "edit_interviews"
  | "manage_settings"
  | "view_reports";

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  nameAr: string;
  nameEn: string;
  customPermissions: Permission[] | null;
  createdAt: string;
}

export interface WorkExperience {
  jobTitle: string;
  workLocation: string;
  periodFrom: string;
  periodTo: string;
  netSalary: string;
  reasonForLeaving: string;
}

export interface TrainingCourse {
  courseName: string;
  trainingEntity: string;
  dateObtained: string;
  notes: string;
}

export interface JobOffer {
  experienceYears: string;
  basicSalary: string;
  workNatureAllowance: string;
  transportationAllowance: string;
  kpiBonus: string;
  totalSalary: string;
  workHours: string;
  notes: string;
}

export interface ExamScores {
  examScore: string;
  examCorrect: string;
  examGrade: string;
  examNotes: string;
}

export interface BrandingSettings {
  customLogo: boolean;
  logoUpdatedAt: string | null;
  logoMimeType: string | null;
}

export interface AppSettings {
  fieldVisibility: Record<string, boolean>;
  branding: BrandingSettings;
}

export interface InterviewRecord {
  mark: string;
  signature: string;
  date: string;
  comment: string;
}

export interface Candidate {
  id: string;
  applicationNumber: string;
  positionAppliedFor: string;
  applicationDate: string;
  inviteToken: string | null;

  fullName: string;
  address: string;
  area: string;
  governorate: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  numberOfChildren: string;
  religion: string;
  mobile1: string;
  mobile2: string;
  educationalQualification: string;
  graduationEntity: string;
  graduationYear: string;
  grade: string;
  militaryStatus: string;
  pharmacistAssignmentStatus: string;
  drivingLicenseNumber: string;
  drivingLicenseStart: string;
  drivingLicenseEnd: string;
  motorcyclePlateNumber: string;
  motorcycleLicenseStart: string;
  motorcycleLicenseEnd: string;

  workExperiences: WorkExperience[];
  trainingCourses: TrainingCourse[];

  computerProficiency: string;
  englishProficiency: string;
  specialPrograms: string;
  otherLanguages: string;

  hasHealthProblems: boolean;
  healthProblemType: string;
  workedForCompanyBefore: boolean;
  previousJobAtCompany: string;
  previousBranchAtCompany: string;
  hasRelativesInCompany: boolean;
  relativeName: string;
  relativeJob: string;
  currentlyEmployed: boolean;
  readyForShiftWork: boolean;

  declarationFullName: string;
  declarationSignature: string;
  declarationDate: string;

  firstInterview: InterviewRecord;
  secondInterview: InterviewRecord;

  jobOffer: JobOffer;
  examScores: ExamScores;

  status: "pending" | "submitted" | "reviewing" | "interviewed" | "accepted" | "rejected";
  decisionReason: string;
  decidedAt: string | null;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
}

export interface InviteLink {
  id: string;
  token: string;
  positionAppliedFor: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string | null;
  usedAt: string | null;
  candidateId: string | null;
}

export type Locale = "ar" | "en";

export interface SessionUser {
  id: string;
  username: string;
  role: UserRole;
  nameAr: string;
  nameEn: string;
  permissions: Permission[];
}
