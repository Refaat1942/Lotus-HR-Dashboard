import type { TranslationKey } from "./i18n";

export interface FieldDefinition {
  key: string;
  section: string;
  labelKey: TranslationKey;
  defaultVisible: boolean;
}

export const APPLICATION_FIELDS: FieldDefinition[] = [
  { key: "positionAppliedFor", section: "header", labelKey: "positionAppliedFor", defaultVisible: true },
  { key: "applicationDate", section: "header", labelKey: "applicationDate", defaultVisible: true },
  { key: "applicationNumber", section: "header", labelKey: "applicationNumber", defaultVisible: false },
  { key: "fullName", section: "personal", labelKey: "fullName", defaultVisible: true },
  { key: "address", section: "personal", labelKey: "address", defaultVisible: true },
  { key: "area", section: "personal", labelKey: "area", defaultVisible: true },
  { key: "governorate", section: "personal", labelKey: "governorate", defaultVisible: true },
  { key: "dateOfBirth", section: "personal", labelKey: "dateOfBirth", defaultVisible: true },
  { key: "gender", section: "personal", labelKey: "gender", defaultVisible: true },
  { key: "maritalStatus", section: "personal", labelKey: "maritalStatus", defaultVisible: true },
  { key: "numberOfChildren", section: "personal", labelKey: "numberOfChildren", defaultVisible: true },
  { key: "religion", section: "personal", labelKey: "religion", defaultVisible: true },
  { key: "mobile1", section: "personal", labelKey: "mobile1", defaultVisible: true },
  { key: "mobile2", section: "personal", labelKey: "mobile2", defaultVisible: true },
  { key: "educationalQualification", section: "personal", labelKey: "educationalQualification", defaultVisible: true },
  { key: "graduationEntity", section: "personal", labelKey: "graduationEntity", defaultVisible: true },
  { key: "graduationYear", section: "personal", labelKey: "graduationYear", defaultVisible: true },
  { key: "grade", section: "personal", labelKey: "grade", defaultVisible: true },
  { key: "militaryStatus", section: "personal", labelKey: "militaryStatus", defaultVisible: true },
  { key: "pharmacistAssignmentStatus", section: "personal", labelKey: "pharmacistAssignment", defaultVisible: false },
  { key: "drivingLicenseNumber", section: "delivery", labelKey: "drivingLicense", defaultVisible: false },
  { key: "drivingLicenseStart", section: "delivery", labelKey: "licenseStart", defaultVisible: false },
  { key: "drivingLicenseEnd", section: "delivery", labelKey: "licenseEnd", defaultVisible: false },
  { key: "motorcyclePlateNumber", section: "delivery", labelKey: "motorcyclePlate", defaultVisible: false },
  { key: "motorcycleLicenseStart", section: "delivery", labelKey: "licenseStart", defaultVisible: false },
  { key: "motorcycleLicenseEnd", section: "delivery", labelKey: "licenseEnd", defaultVisible: false },
  { key: "workExperiences", section: "experience", labelKey: "previousExperience", defaultVisible: true },
  { key: "trainingCourses", section: "training", labelKey: "trainingCourses", defaultVisible: true },
  { key: "computerProficiency", section: "skills", labelKey: "computerProficiency", defaultVisible: true },
  { key: "englishProficiency", section: "skills", labelKey: "englishProficiency", defaultVisible: true },
  { key: "specialPrograms", section: "skills", labelKey: "specialPrograms", defaultVisible: true },
  { key: "otherLanguages", section: "skills", labelKey: "otherLanguages", defaultVisible: true },
  { key: "hasHealthProblems", section: "important", labelKey: "healthProblems", defaultVisible: true },
  { key: "workedForCompanyBefore", section: "important", labelKey: "workedBefore", defaultVisible: true },
  { key: "hasRelativesInCompany", section: "important", labelKey: "relativesInCompany", defaultVisible: true },
  { key: "currentlyEmployed", section: "important", labelKey: "currentlyEmployed", defaultVisible: true },
  { key: "readyForShiftWork", section: "important", labelKey: "readyForShifts", defaultVisible: true },
  { key: "declarationFullName", section: "declaration", labelKey: "declarationFullName", defaultVisible: true },
  { key: "declarationSignature", section: "declaration", labelKey: "signature", defaultVisible: true },
  { key: "declarationDate", section: "declaration", labelKey: "date", defaultVisible: true },
];

export function defaultFieldVisibility(): Record<string, boolean> {
  const visibility: Record<string, boolean> = {};
  for (const field of APPLICATION_FIELDS) {
    visibility[field.key] = field.defaultVisible;
  }
  return visibility;
}

export function mergeFieldVisibility(stored?: Record<string, boolean>): Record<string, boolean> {
  const defaults = defaultFieldVisibility();
  if (!stored) return defaults;
  return { ...defaults, ...stored };
}

export function isFieldVisible(key: string, visibility: Record<string, boolean>): boolean {
  return visibility[key] !== false;
}

export function isSectionVisible(section: string, visibility: Record<string, boolean>): boolean {
  return APPLICATION_FIELDS.some((f) => f.section === section && isFieldVisible(f.key, visibility));
}

export const FIELD_SECTIONS = [
  { id: "header", labelKey: "jobApplicationForm" as TranslationKey },
  { id: "personal", labelKey: "personalData" as TranslationKey },
  { id: "delivery", labelKey: "deliveryInfo" as TranslationKey },
  { id: "experience", labelKey: "previousExperience" as TranslationKey },
  { id: "training", labelKey: "trainingCourses" as TranslationKey },
  { id: "skills", labelKey: "otherSkills" as TranslationKey },
  { id: "important", labelKey: "importantInfo" as TranslationKey },
  { id: "declaration", labelKey: "declaration" as TranslationKey },
];
