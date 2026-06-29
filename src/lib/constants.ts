import type { Permission } from "./types";
import type { LocalizedOption } from "./options-i18n";

export const EGYPTIAN_GOVERNORATES: LocalizedOption[] = [
  { ar: "القاهرة", en: "Cairo", value: "cairo" },
  { ar: "الجيزة", en: "Giza", value: "giza" },
  { ar: "الإسكندرية", en: "Alexandria", value: "alexandria" },
  { ar: "الدقهلية", en: "Dakahlia", value: "dakahlia" },
  { ar: "الشرقية", en: "Sharqia", value: "sharqia" },
  { ar: "القليوبية", en: "Qalyubia", value: "qalyubia" },
  { ar: "كفر الشيخ", en: "Kafr El Sheikh", value: "kafr_el_sheikh" },
  { ar: "الغربية", en: "Gharbia", value: "gharbia" },
  { ar: "المنوفية", en: "Monufia", value: "monufia" },
  { ar: "البحيرة", en: "Beheira", value: "beheira" },
  { ar: "الإسماعيلية", en: "Ismailia", value: "ismailia" },
  { ar: "بورسعيد", en: "Port Said", value: "port_said" },
  { ar: "السويس", en: "Suez", value: "suez" },
  { ar: "دمياط", en: "Damietta", value: "damietta" },
  { ar: "الفيوم", en: "Fayoum", value: "fayoum" },
  { ar: "بني سويف", en: "Beni Suef", value: "beni_suef" },
  { ar: "المنيا", en: "Minya", value: "minya" },
  { ar: "أسيوط", en: "Assiut", value: "assiut" },
  { ar: "سوهاج", en: "Sohag", value: "sohag" },
  { ar: "قنا", en: "Qena", value: "qena" },
  { ar: "الأقصر", en: "Luxor", value: "luxor" },
  { ar: "أسوان", en: "Aswan", value: "aswan" },
  { ar: "البحر الأحمر", en: "Red Sea", value: "red_sea" },
  { ar: "الوادي الجديد", en: "New Valley", value: "new_valley" },
  { ar: "مطروح", en: "Matrouh", value: "matrouh" },
  { ar: "شمال سيناء", en: "North Sinai", value: "north_sinai" },
  { ar: "جنوب سيناء", en: "South Sinai", value: "south_sinai" },
];

export const GENDERS: LocalizedOption[] = [
  { ar: "ذكر", en: "Male", value: "male" },
  { ar: "أنثى", en: "Female", value: "female" },
];

export const MARITAL_STATUSES: LocalizedOption[] = [
  { ar: "أعزب", en: "Single", value: "single" },
  { ar: "متزوج", en: "Married", value: "married" },
  { ar: "مطلق", en: "Divorced", value: "divorced" },
  { ar: "أرمل", en: "Widowed", value: "widowed" },
];

export const RELIGIONS: LocalizedOption[] = [
  { ar: "مسلم", en: "Muslim", value: "muslim" },
  { ar: "مسيحي", en: "Christian", value: "christian" },
  { ar: "أخرى", en: "Other", value: "other" },
];

export const GRADES: LocalizedOption[] = [
  { ar: "ممتاز", en: "Excellent", value: "excellent" },
  { ar: "جيد جداً", en: "Very Good", value: "very_good" },
  { ar: "جيد", en: "Good", value: "good" },
  { ar: "مقبول", en: "Pass", value: "pass" },
];

export const MILITARY_STATUSES: LocalizedOption[] = [
  { ar: "أدى الخدمة", en: "Completed", value: "completed" },
  { ar: "معفى", en: "Exempted", value: "exempted" },
  { ar: "مؤجل", en: "Postponed", value: "postponed" },
  { ar: "غير مطلوب", en: "Not Required", value: "not_required" },
];

export const EDUCATIONAL_QUALIFICATIONS: LocalizedOption[] = [
  { ar: "ثانوية عامة", en: "High School", value: "high_school" },
  { ar: "دبلوم", en: "Diploma", value: "diploma" },
  { ar: "بكالوريوس", en: "Bachelor's Degree", value: "bachelor" },
  { ar: "بكالوريوس صيدلة", en: "Bachelor of Pharmacy", value: "bachelor_pharmacy" },
  { ar: "ماجستير", en: "Master's Degree", value: "master" },
  { ar: "ماجستير صيدلة", en: "Master of Pharmacy", value: "master_pharmacy" },
  { ar: "دكتوراه", en: "PhD", value: "phd" },
];

export const PROFICIENCY_LEVELS: LocalizedOption[] = [
  { ar: "ممتاز", en: "Excellent", value: "excellent" },
  { ar: "جيد", en: "Good", value: "good" },
  { ar: "متوسط", en: "Average", value: "average" },
  { ar: "ضعيف", en: "Poor", value: "poor" },
  { ar: "لا يوجد", en: "None", value: "none" },
];

export const CANDIDATE_STATUSES: LocalizedOption[] = [
  { ar: "قيد الانتظار", en: "Pending", value: "pending" },
  { ar: "تم التقديم", en: "Submitted", value: "submitted" },
  { ar: "قيد المراجعة", en: "Reviewing", value: "reviewing" },
  { ar: "تمت المقابلة", en: "Interviewed", value: "interviewed" },
  { ar: "مقبول", en: "Accepted", value: "accepted" },
  { ar: "مرفوض", en: "Rejected", value: "rejected" },
];

export const CANDIDATE_OPTION_FIELDS = [
  { key: "governorate", options: EGYPTIAN_GOVERNORATES },
  { key: "gender", options: GENDERS },
  { key: "maritalStatus", options: MARITAL_STATUSES },
  { key: "religion", options: RELIGIONS },
  { key: "grade", options: GRADES },
  { key: "militaryStatus", options: MILITARY_STATUSES },
  { key: "educationalQualification", options: EDUCATIONAL_QUALIFICATIONS },
  { key: "computerProficiency", options: PROFICIENCY_LEVELS },
  { key: "englishProficiency", options: PROFICIENCY_LEVELS },
] as const;

export const ROLE_PERMISSIONS = {
  admin: ["view_candidates", "edit_candidates", "delete_candidates", "manage_users", "create_links", "delete_links", "edit_interviews", "manage_settings", "view_reports"],
  hr: ["view_candidates", "edit_candidates", "create_links", "delete_links", "edit_interviews", "manage_settings", "view_reports"],
  viewer: ["view_candidates", "view_reports"],
} as const;

export const PERMISSION_GROUPS: {
  id: string;
  labelKey: string;
  permissions: { id: Permission; labelKey: string }[];
}[] = [
  {
    id: "candidates",
    labelKey: "candidates",
    permissions: [
      { id: "view_candidates", labelKey: "permViewCandidates" },
      { id: "edit_candidates", labelKey: "permEditCandidates" },
      { id: "delete_candidates", labelKey: "permDeleteCandidates" },
    ],
  },
  {
    id: "links",
    labelKey: "inviteLinks",
    permissions: [
      { id: "create_links", labelKey: "permCreateLinks" },
      { id: "delete_links", labelKey: "permDeleteLinks" },
    ],
  },
  {
    id: "interviews",
    labelKey: "interviews",
    permissions: [{ id: "edit_interviews", labelKey: "permEditInterviews" }],
  },
  {
    id: "reports",
    labelKey: "reports",
    permissions: [{ id: "view_reports", labelKey: "permViewReports" }],
  },
  {
    id: "settings",
    labelKey: "settings",
    permissions: [{ id: "manage_settings", labelKey: "permManageSettings" }],
  },
  {
    id: "users",
    labelKey: "users",
    permissions: [{ id: "manage_users", labelKey: "permManageUsers" }],
  },
];

export const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => p.id));

export function getEffectivePermissions(user: {
  role: keyof typeof ROLE_PERMISSIONS;
  customPermissions?: Permission[] | null;
}): Permission[] {
  if (user.customPermissions && user.customPermissions.length > 0) {
    return user.customPermissions;
  }
  return [...ROLE_PERMISSIONS[user.role]] as Permission[];
}

export function hasPermission(
  role: keyof typeof ROLE_PERMISSIONS,
  permission: Permission,
  customPermissions?: Permission[] | null
): boolean {
  if (customPermissions && customPermissions.length > 0) {
    return customPermissions.includes(permission);
  }
  return (ROLE_PERMISSIONS[role] as readonly string[]).includes(permission);
}

export function hasSessionPermission(
  session: { role: keyof typeof ROLE_PERMISSIONS; permissions?: Permission[] },
  permission: Permission
): boolean {
  if (session.permissions && session.permissions.length > 0) {
    return session.permissions.includes(permission);
  }
  return hasPermission(session.role, permission);
}

export function emptyJobOffer() {
  return {
    experienceYears: "",
    basicSalary: "",
    workNatureAllowance: "",
    transportationAllowance: "",
    kpiBonus: "",
    totalSalary: "",
    workHours: "",
    notes: "",
  };
}

export function emptyExamScores() {
  return {
    examScore: "",
    examCorrect: "",
    examGrade: "",
    examNotes: "",
  };
}

export function emptyInterview(): { mark: string; signature: string; date: string; comment: string } {
  return { mark: "", signature: "", date: "", comment: "" };
}

export function emptyWorkExperience() {
  return {
    jobTitle: "",
    workLocation: "",
    periodFrom: "",
    periodTo: "",
    netSalary: "",
    reasonForLeaving: "",
  };
}

export function emptyTrainingCourse() {
  return {
    courseName: "",
    trainingEntity: "",
    dateObtained: "",
    notes: "",
  };
}

export function createEmptyCandidate(id: string, applicationNumber: string, positionAppliedFor: string, inviteToken: string | null = null) {
  const now = new Date().toISOString();
  return {
    id,
    applicationNumber,
    positionAppliedFor,
    applicationDate: now.split("T")[0],
    inviteToken,
    fullName: "",
    address: "",
    area: "",
    governorate: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    numberOfChildren: "0",
    religion: "",
    mobile1: "",
    mobile2: "",
    educationalQualification: "",
    graduationEntity: "",
    graduationYear: "",
    grade: "",
    militaryStatus: "",
    pharmacistAssignmentStatus: "",
    drivingLicenseNumber: "",
    drivingLicenseStart: "",
    drivingLicenseEnd: "",
    motorcyclePlateNumber: "",
    motorcycleLicenseStart: "",
    motorcycleLicenseEnd: "",
    workExperiences: [emptyWorkExperience(), emptyWorkExperience(), emptyWorkExperience()],
    trainingCourses: [emptyTrainingCourse(), emptyTrainingCourse()],
    computerProficiency: "",
    englishProficiency: "",
    specialPrograms: "",
    otherLanguages: "",
    hasHealthProblems: false,
    healthProblemType: "",
    workedForCompanyBefore: false,
    previousJobAtCompany: "",
    previousBranchAtCompany: "",
    hasRelativesInCompany: false,
    relativeName: "",
    relativeJob: "",
    currentlyEmployed: false,
    readyForShiftWork: false,
    declarationFullName: "",
    declarationSignature: "",
    declarationDate: "",
    firstInterview: emptyInterview(),
    secondInterview: emptyInterview(),
    jobOffer: emptyJobOffer(),
    examScores: emptyExamScores(),
    status: "pending" as const,
    decisionReason: "",
    decidedAt: null,
    createdAt: now,
    updatedAt: now,
    submittedAt: null,
  };
}
