import type { Permission } from "./types";

export const EGYPTIAN_GOVERNORATES = [
  { ar: "القاهرة", en: "Cairo" },
  { ar: "الجيزة", en: "Giza" },
  { ar: "الإسكندرية", en: "Alexandria" },
  { ar: "الدقهلية", en: "Dakahlia" },
  { ar: "الشرقية", en: "Sharqia" },
  { ar: "القليوبية", en: "Qalyubia" },
  { ar: "كفر الشيخ", en: "Kafr El Sheikh" },
  { ar: "الغربية", en: "Gharbia" },
  { ar: "المنوفية", en: "Monufia" },
  { ar: "البحيرة", en: "Beheira" },
  { ar: "الإسماعيلية", en: "Ismailia" },
  { ar: "بورسعيد", en: "Port Said" },
  { ar: "السويس", en: "Suez" },
  { ar: "دمياط", en: "Damietta" },
  { ar: "الفيوم", en: "Fayoum" },
  { ar: "بني سويف", en: "Beni Suef" },
  { ar: "المنيا", en: "Minya" },
  { ar: "أسيوط", en: "Assiut" },
  { ar: "سوهاج", en: "Sohag" },
  { ar: "قنا", en: "Qena" },
  { ar: "الأقصر", en: "Luxor" },
  { ar: "أسوان", en: "Aswan" },
  { ar: "البحر الأحمر", en: "Red Sea" },
  { ar: "الوادي الجديد", en: "New Valley" },
  { ar: "مطروح", en: "Matrouh" },
  { ar: "شمال سيناء", en: "North Sinai" },
  { ar: "جنوب سيناء", en: "South Sinai" },
];

export const GENDERS = [
  { ar: "ذكر", en: "Male" },
  { ar: "أنثى", en: "Female" },
];

export const MARITAL_STATUSES = [
  { ar: "أعزب", en: "Single" },
  { ar: "متزوج", en: "Married" },
  { ar: "مطلق", en: "Divorced" },
  { ar: "أرمل", en: "Widowed" },
];

export const RELIGIONS = [
  { ar: "مسلم", en: "Muslim" },
  { ar: "مسيحي", en: "Christian" },
  { ar: "أخرى", en: "Other" },
];

export const GRADES = [
  { ar: "ممتاز", en: "Excellent" },
  { ar: "جيد جداً", en: "Very Good" },
  { ar: "جيد", en: "Good" },
  { ar: "مقبول", en: "Pass" },
];

export const MILITARY_STATUSES = [
  { ar: "أدى الخدمة", en: "Completed" },
  { ar: "معفى", en: "Exempted" },
  { ar: "مؤجل", en: "Postponed" },
  { ar: "غير مطلوب", en: "Not Required" },
];

export const EDUCATIONAL_QUALIFICATIONS = [
  { ar: "ثانوية عامة", en: "High School" },
  { ar: "دبلوم", en: "Diploma" },
  { ar: "بكالوريوس", en: "Bachelor's Degree" },
  { ar: "بكالوريوس صيدلة", en: "Bachelor of Pharmacy" },
  { ar: "ماجستير", en: "Master's Degree" },
  { ar: "ماجستير صيدلة", en: "Master of Pharmacy" },
  { ar: "دكتوراه", en: "PhD" },
];

export const PROFICIENCY_LEVELS = [
  { ar: "ممتاز", en: "Excellent" },
  { ar: "جيد", en: "Good" },
  { ar: "متوسط", en: "Average" },
  { ar: "ضعيف", en: "Poor" },
  { ar: "لا يوجد", en: "None" },
];

export const CANDIDATE_STATUSES = [
  { ar: "قيد الانتظار", en: "Pending", value: "pending" },
  { ar: "تم التقديم", en: "Submitted", value: "submitted" },
  { ar: "قيد المراجعة", en: "Reviewing", value: "reviewing" },
  { ar: "تمت المقابلة", en: "Interviewed", value: "interviewed" },
  { ar: "مقبول", en: "Accepted", value: "accepted" },
  { ar: "مرفوض", en: "Rejected", value: "rejected" },
];

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
    createdAt: now,
    updatedAt: now,
    submittedAt: null,
  };
}
