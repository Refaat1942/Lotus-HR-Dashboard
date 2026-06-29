"use client";

import { useLanguage } from "./LanguageProvider";
import { getLocalizedOption } from "@/lib/i18n";
import { resolveOptionValue } from "@/lib/options-i18n";
import {
  EGYPTIAN_GOVERNORATES,
  GENDERS,
  MARITAL_STATUSES,
  RELIGIONS,
  GRADES,
  MILITARY_STATUSES,
  EDUCATIONAL_QUALIFICATIONS,
  PROFICIENCY_LEVELS,
} from "@/lib/constants";
import type { Candidate, WorkExperience, TrainingCourse } from "@/lib/types";
import { isFieldVisible, isSectionVisible } from "@/lib/fieldConfig";
import { resolveJobPositionLabel } from "@/lib/jobs";
import { HrExtras } from "./HrExtras";
import { Plus, Trash2 } from "lucide-react";

interface ApplicationFormProps {
  data: Partial<Candidate>;
  onChange: (data: Partial<Candidate>) => void;
  readOnly?: boolean;
  showHrSection?: boolean;
  fieldVisibility?: Record<string, boolean>;
}

function FormField({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ms-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function YesNoField({
  label,
  value,
  onChange,
  detailLabel,
  detailValue,
  onDetailChange,
  readOnly,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  detailLabel?: string;
  detailValue?: string;
  onDetailChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <p className="mb-3 text-sm font-medium text-gray-700">{label}</p>
      <div className="flex gap-4 mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={value === true}
            onChange={() => onChange(true)}
            disabled={readOnly}
            className="accent-lotus-green"
          />
          <span className="text-sm">{t("yes")}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={value === false}
            onChange={() => onChange(false)}
            disabled={readOnly}
            className="accent-lotus-green"
          />
          <span className="text-sm">{t("no")}</span>
        </label>
      </div>
      {value && detailLabel && onDetailChange && (
        <input
          type="text"
          value={detailValue || ""}
          onChange={(e) => onDetailChange(e.target.value)}
          disabled={readOnly}
          placeholder={detailLabel}
          className="input-field"
        />
      )}
    </div>
  );
}

export function ApplicationForm({ data, onChange, readOnly = false, showHrSection = false, fieldVisibility }: ApplicationFormProps) {
  const { t, locale } = useLanguage();

  const visible = (key: string) => showHrSection || !fieldVisibility || isFieldVisible(key, fieldVisibility);
  const sectionVisible = (section: string) => showHrSection || !fieldVisibility || isSectionVisible(section, fieldVisibility);

  function update(field: string, value: unknown) {
    onChange({ ...data, [field]: value });
  }

  function updateExperience(index: number, field: keyof WorkExperience, value: string) {
    const experiences = [...(data.workExperiences || [])];
    experiences[index] = { ...experiences[index], [field]: value };
    update("workExperiences", experiences);
  }

  function addExperience() {
    const experiences = [...(data.workExperiences || [])];
    experiences.push({ jobTitle: "", workLocation: "", periodFrom: "", periodTo: "", netSalary: "", reasonForLeaving: "" });
    update("workExperiences", experiences);
  }

  function removeExperience(index: number) {
    const experiences = [...(data.workExperiences || [])];
    experiences.splice(index, 1);
    update("workExperiences", experiences);
  }

  function updateCourse(index: number, field: keyof TrainingCourse, value: string) {
    const courses = [...(data.trainingCourses || [])];
    courses[index] = { ...courses[index], [field]: value };
    update("trainingCourses", courses);
  }

  function addCourse() {
    const courses = [...(data.trainingCourses || [])];
    courses.push({ courseName: "", trainingEntity: "", dateObtained: "", notes: "" });
    update("trainingCourses", courses);
  }

  function removeCourse(index: number) {
    const courses = [...(data.trainingCourses || [])];
    courses.splice(index, 1);
    update("trainingCourses", courses);
  }

  const selectOptions = {
    governorate: getLocalizedOption(locale, EGYPTIAN_GOVERNORATES),
    gender: getLocalizedOption(locale, GENDERS),
    maritalStatus: getLocalizedOption(locale, MARITAL_STATUSES),
    religion: getLocalizedOption(locale, RELIGIONS),
    grade: getLocalizedOption(locale, GRADES),
    militaryStatus: getLocalizedOption(locale, MILITARY_STATUSES),
    education: getLocalizedOption(locale, EDUCATIONAL_QUALIFICATIONS),
    proficiency: getLocalizedOption(locale, PROFICIENCY_LEVELS),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {sectionVisible("header") && (
      <div className="form-section">
        <div className="section-header">{t("jobApplicationForm")}</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {visible("positionAppliedFor") && (
          <FormField label={t("positionAppliedFor")} required>
            <input
              type="text"
              value={readOnly ? resolveJobPositionLabel(locale, data.positionAppliedFor || "") : (data.positionAppliedFor || "")}
              onChange={(e) => update("positionAppliedFor", e.target.value)}
              disabled={readOnly}
              className="input-field"
            />
          </FormField>
          )}
          {visible("applicationDate") && (
          <FormField label={t("applicationDate")}>
            <input
              type="date"
              value={data.applicationDate || ""}
              onChange={(e) => update("applicationDate", e.target.value)}
              disabled={readOnly}
              className="input-field"
            />
          </FormField>
          )}
          {visible("applicationNumber") && (
          <FormField label={t("applicationNumber")}>
            <input
              type="text"
              value={data.applicationNumber || ""}
              disabled
              className="input-field bg-gray-50"
            />
          </FormField>
          )}
        </div>
      </div>
      )}

      {/* Personal Data */}
      {sectionVisible("personal") && (
      <div className="form-section">
        <div className="section-header">{t("personalData")}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <FormField label={t("fullName")} required>
            <input type="text" value={data.fullName || ""} onChange={(e) => update("fullName", e.target.value)} disabled={readOnly} className="input-field" />
          </FormField>
          <FormField label={t("address")}>
            <input type="text" value={data.address || ""} onChange={(e) => update("address", e.target.value)} disabled={readOnly} className="input-field" />
          </FormField>
          <FormField label={t("area")}>
            <input type="text" value={data.area || ""} onChange={(e) => update("area", e.target.value)} disabled={readOnly} className="input-field" />
          </FormField>
          <FormField label={t("governorate")}>
            <select value={resolveOptionValue(EGYPTIAN_GOVERNORATES, data.governorate || "")} onChange={(e) => update("governorate", e.target.value)} disabled={readOnly} className="select-field">
              <option value="">{t("selectOption")}</option>
              {selectOptions.governorate.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          <FormField label={t("dateOfBirth")}>
            <input type="date" value={data.dateOfBirth || ""} onChange={(e) => update("dateOfBirth", e.target.value)} disabled={readOnly} className="input-field" />
          </FormField>
          <FormField label={t("gender")}>
            <select value={resolveOptionValue(GENDERS, data.gender || "")} onChange={(e) => update("gender", e.target.value)} disabled={readOnly} className="select-field">
              <option value="">{t("selectOption")}</option>
              {selectOptions.gender.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          <FormField label={t("maritalStatus")}>
            <select value={resolveOptionValue(MARITAL_STATUSES, data.maritalStatus || "")} onChange={(e) => update("maritalStatus", e.target.value)} disabled={readOnly} className="select-field">
              <option value="">{t("selectOption")}</option>
              {selectOptions.maritalStatus.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          <FormField label={t("numberOfChildren")}>
            <input type="number" min="0" value={data.numberOfChildren || "0"} onChange={(e) => update("numberOfChildren", e.target.value)} disabled={readOnly} className="input-field" />
          </FormField>
          <FormField label={t("religion")}>
            <select value={resolveOptionValue(RELIGIONS, data.religion || "")} onChange={(e) => update("religion", e.target.value)} disabled={readOnly} className="select-field">
              <option value="">{t("selectOption")}</option>
              {selectOptions.religion.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          <FormField label={t("mobile1")} required>
            <input type="tel" dir="ltr" value={data.mobile1 || ""} onChange={(e) => update("mobile1", e.target.value)} disabled={readOnly} className="input-field" />
          </FormField>
          <FormField label={t("mobile2")}>
            <input type="tel" dir="ltr" value={data.mobile2 || ""} onChange={(e) => update("mobile2", e.target.value)} disabled={readOnly} className="input-field" />
          </FormField>
          <FormField label={t("educationalQualification")}>
            <select value={resolveOptionValue(EDUCATIONAL_QUALIFICATIONS, data.educationalQualification || "")} onChange={(e) => update("educationalQualification", e.target.value)} disabled={readOnly} className="select-field">
              <option value="">{t("selectOption")}</option>
              {selectOptions.education.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          <FormField label={t("graduationEntity")}>
            <input type="text" value={data.graduationEntity || ""} onChange={(e) => update("graduationEntity", e.target.value)} disabled={readOnly} className="input-field" />
          </FormField>
          <FormField label={t("graduationYear")}>
            <input type="number" value={data.graduationYear || ""} onChange={(e) => update("graduationYear", e.target.value)} disabled={readOnly} className="input-field" />
          </FormField>
          <FormField label={t("grade")}>
            <select value={resolveOptionValue(GRADES, data.grade || "")} onChange={(e) => update("grade", e.target.value)} disabled={readOnly} className="select-field">
              <option value="">{t("selectOption")}</option>
              {selectOptions.grade.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          <FormField label={t("militaryStatus")}>
            <select value={resolveOptionValue(MILITARY_STATUSES, data.militaryStatus || "")} onChange={(e) => update("militaryStatus", e.target.value)} disabled={readOnly} className="select-field">
              <option value="">{t("selectOption")}</option>
              {selectOptions.militaryStatus.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          {visible("pharmacistAssignmentStatus") && (
          <FormField label={t("pharmacistAssignment")}>
            <input type="text" value={data.pharmacistAssignmentStatus || ""} onChange={(e) => update("pharmacistAssignmentStatus", e.target.value)} disabled={readOnly} className="input-field" />
          </FormField>
          )}
        </div>

        {/* Delivery fields */}
        {sectionVisible("delivery") && (
        <div className="border-t border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <FormField label={t("drivingLicense")}>
                <input type="text" value={data.drivingLicenseNumber || ""} onChange={(e) => update("drivingLicenseNumber", e.target.value)} disabled={readOnly} className="input-field" />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label={t("licenseStart")}>
                  <input type="date" value={data.drivingLicenseStart || ""} onChange={(e) => update("drivingLicenseStart", e.target.value)} disabled={readOnly} className="input-field" />
                </FormField>
                <FormField label={t("licenseEnd")}>
                  <input type="date" value={data.drivingLicenseEnd || ""} onChange={(e) => update("drivingLicenseEnd", e.target.value)} disabled={readOnly} className="input-field" />
                </FormField>
              </div>
            </div>
            <div className="space-y-3">
              <FormField label={t("motorcyclePlate")}>
                <input type="text" value={data.motorcyclePlateNumber || ""} onChange={(e) => update("motorcyclePlateNumber", e.target.value)} disabled={readOnly} className="input-field" />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label={t("licenseStart")}>
                  <input type="date" value={data.motorcycleLicenseStart || ""} onChange={(e) => update("motorcycleLicenseStart", e.target.value)} disabled={readOnly} className="input-field" />
                </FormField>
                <FormField label={t("licenseEnd")}>
                  <input type="date" value={data.motorcycleLicenseEnd || ""} onChange={(e) => update("motorcycleLicenseEnd", e.target.value)} disabled={readOnly} className="input-field" />
                </FormField>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
      )}

      {/* Previous Experience */}
      {sectionVisible("experience") && (
      <div className="form-section">
        <div className="section-header flex items-center justify-between">
          <span>{t("previousExperience")}</span>
          {!readOnly && (
            <button type="button" onClick={addExperience} className="text-xs bg-white/20 rounded px-2 py-1 hover:bg-white/30 transition-colors">
              <Plus className="h-3 w-3 inline" /> {t("addExperience")}
            </button>
          )}
        </div>
        <div className="p-4 space-y-4">
          {(data.workExperiences || []).map((exp, i) => (
            <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-4 relative">
              {!readOnly && (data.workExperiences?.length || 0) > 1 && (
                <button type="button" onClick={() => removeExperience(i)} className="absolute top-2 end-2 text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <FormField label={t("jobTitle")}>
                  <input type="text" value={exp.jobTitle} onChange={(e) => updateExperience(i, "jobTitle", e.target.value)} disabled={readOnly} className="input-field" />
                </FormField>
                <FormField label={t("workLocation")}>
                  <input type="text" value={exp.workLocation} onChange={(e) => updateExperience(i, "workLocation", e.target.value)} disabled={readOnly} className="input-field" />
                </FormField>
                <FormField label={t("netSalary")}>
                  <input type="text" value={exp.netSalary} onChange={(e) => updateExperience(i, "netSalary", e.target.value)} disabled={readOnly} className="input-field" />
                </FormField>
                <FormField label={t("periodFrom")}>
                  <input type="date" value={exp.periodFrom} onChange={(e) => updateExperience(i, "periodFrom", e.target.value)} disabled={readOnly} className="input-field" />
                </FormField>
                <FormField label={t("periodTo")}>
                  <input type="date" value={exp.periodTo} onChange={(e) => updateExperience(i, "periodTo", e.target.value)} disabled={readOnly} className="input-field" />
                </FormField>
                <FormField label={t("reasonForLeaving")}>
                  <input type="text" value={exp.reasonForLeaving} onChange={(e) => updateExperience(i, "reasonForLeaving", e.target.value)} disabled={readOnly} className="input-field" />
                </FormField>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Training Courses */}
      {sectionVisible("training") && (
      <div className="form-section">
        <div className="section-header flex items-center justify-between">
          <span>{t("trainingCourses")}</span>
          {!readOnly && (
            <button type="button" onClick={addCourse} className="text-xs bg-white/20 rounded px-2 py-1 hover:bg-white/30 transition-colors">
              <Plus className="h-3 w-3 inline" /> {t("addCourse")}
            </button>
          )}
        </div>
        <div className="p-4 space-y-4">
          {(data.trainingCourses || []).map((course, i) => (
            <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-4 relative">
              {!readOnly && (data.trainingCourses?.length || 0) > 1 && (
                <button type="button" onClick={() => removeCourse(i)} className="absolute top-2 end-2 text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField label={t("courseName")}>
                  <input type="text" value={course.courseName} onChange={(e) => updateCourse(i, "courseName", e.target.value)} disabled={readOnly} className="input-field" />
                </FormField>
                <FormField label={t("trainingEntity")}>
                  <input type="text" value={course.trainingEntity} onChange={(e) => updateCourse(i, "trainingEntity", e.target.value)} disabled={readOnly} className="input-field" />
                </FormField>
                <FormField label={t("dateObtained")}>
                  <input type="date" value={course.dateObtained} onChange={(e) => updateCourse(i, "dateObtained", e.target.value)} disabled={readOnly} className="input-field" />
                </FormField>
                <FormField label={t("notes")}>
                  <input type="text" value={course.notes} onChange={(e) => updateCourse(i, "notes", e.target.value)} disabled={readOnly} className="input-field" />
                </FormField>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Other Skills */}
      {sectionVisible("skills") && (
      <div className="form-section">
        <div className="section-header">{t("otherSkills")}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <FormField label={t("computerProficiency")}>
            <select value={resolveOptionValue(PROFICIENCY_LEVELS, data.computerProficiency || "")} onChange={(e) => update("computerProficiency", e.target.value)} disabled={readOnly} className="select-field">
              <option value="">{t("selectOption")}</option>
              {selectOptions.proficiency.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          <FormField label={t("englishProficiency")}>
            <select value={resolveOptionValue(PROFICIENCY_LEVELS, data.englishProficiency || "")} onChange={(e) => update("englishProficiency", e.target.value)} disabled={readOnly} className="select-field">
              <option value="">{t("selectOption")}</option>
              {selectOptions.proficiency.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </FormField>
          <FormField label={t("specialPrograms")}>
            <input type="text" value={data.specialPrograms || ""} onChange={(e) => update("specialPrograms", e.target.value)} disabled={readOnly} className="input-field" />
          </FormField>
          <FormField label={t("otherLanguages")}>
            <input type="text" value={data.otherLanguages || ""} onChange={(e) => update("otherLanguages", e.target.value)} disabled={readOnly} className="input-field" />
          </FormField>
        </div>
      </div>
      )}

      {/* Important Information */}
      {sectionVisible("important") && (
      <div className="form-section">
        <div className="section-header">{t("importantInfo")}</div>
        <div className="p-4 space-y-4">
          <YesNoField
            label={t("healthProblems")}
            value={data.hasHealthProblems || false}
            onChange={(v) => update("hasHealthProblems", v)}
            detailLabel={t("healthProblemType")}
            detailValue={data.healthProblemType}
            onDetailChange={(v) => update("healthProblemType", v)}
            readOnly={readOnly}
          />
          <YesNoField
            label={t("workedBefore")}
            value={data.workedForCompanyBefore || false}
            onChange={(v) => update("workedForCompanyBefore", v)}
            detailLabel={t("previousJob")}
            detailValue={data.previousJobAtCompany}
            onDetailChange={(v) => update("previousJobAtCompany", v)}
            readOnly={readOnly}
          />
          {data.workedForCompanyBefore && (
            <FormField label={t("previousBranch")}>
              <input type="text" value={data.previousBranchAtCompany || ""} onChange={(e) => update("previousBranchAtCompany", e.target.value)} disabled={readOnly} className="input-field" />
            </FormField>
          )}
          <YesNoField
            label={t("relativesInCompany")}
            value={data.hasRelativesInCompany || false}
            onChange={(v) => update("hasRelativesInCompany", v)}
            detailLabel={t("relativeName")}
            detailValue={data.relativeName}
            onDetailChange={(v) => update("relativeName", v)}
            readOnly={readOnly}
          />
          {data.hasRelativesInCompany && (
            <FormField label={t("relativeJob")}>
              <input type="text" value={data.relativeJob || ""} onChange={(e) => update("relativeJob", e.target.value)} disabled={readOnly} className="input-field" />
            </FormField>
          )}
          <YesNoField
            label={t("currentlyEmployed")}
            value={data.currentlyEmployed || false}
            onChange={(v) => update("currentlyEmployed", v)}
            readOnly={readOnly}
          />
          <YesNoField
            label={t("readyForShifts")}
            value={data.readyForShiftWork || false}
            onChange={(v) => update("readyForShiftWork", v)}
            readOnly={readOnly}
          />
        </div>
      </div>
      )}

      {/* Declaration */}
      {!showHrSection && sectionVisible("declaration") && (
        <div className="form-section">
          <div className="section-header">{t("declaration")}</div>
          <div className="p-4 space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">{t("declarationText")}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label={t("declarationFullName")} required>
                <input type="text" value={data.declarationFullName || ""} onChange={(e) => update("declarationFullName", e.target.value)} disabled={readOnly} className="input-field" />
              </FormField>
              <FormField label={t("signature")}>
                <input type="text" value={data.declarationSignature || ""} onChange={(e) => update("declarationSignature", e.target.value)} disabled={readOnly} className="input-field" placeholder={t("signature")} />
              </FormField>
              <FormField label={t("date")}>
                <input type="date" value={data.declarationDate || ""} onChange={(e) => update("declarationDate", e.target.value)} disabled={readOnly} className="input-field" />
              </FormField>
            </div>
          </div>
        </div>
      )}

      {/* HR-only: Job Offer & Exam Scores */}
      {showHrSection && (
        <HrExtras data={data} onChange={onChange} readOnly={readOnly} />
      )}

      {/* HR Section */}
      {showHrSection && (
        <div className="form-section">
          <div className="section-header">{t("hrSection")}</div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 px-3 text-start font-medium text-gray-600"></th>
                    <th className="py-2 px-3 text-center font-medium text-lotus-green">{t("firstInterview")}</th>
                    <th className="py-2 px-3 text-center font-medium text-lotus-green">{t("secondInterview")}</th>
                  </tr>
                </thead>
                <tbody>
                  {(["mark", "signature", "date", "comment"] as const).map((field) => (
                    <tr key={field} className="border-b border-gray-100">
                      <td className="py-2 px-3 font-medium text-gray-600">{t(field === "mark" ? "mark" : field === "signature" ? "signature" : field === "date" ? "date" : "comment")}</td>
                      <td className="py-2 px-3">
                        <input
                          type={field === "date" ? "date" : "text"}
                          value={data.firstInterview?.[field] || ""}
                          onChange={(e) => update("firstInterview", { ...data.firstInterview, [field]: e.target.value, mark: data.firstInterview?.mark || "", signature: data.firstInterview?.signature || "", date: data.firstInterview?.date || "", comment: data.firstInterview?.comment || "" })}
                          disabled={readOnly}
                          className="input-field text-center"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type={field === "date" ? "date" : "text"}
                          value={data.secondInterview?.[field] || ""}
                          onChange={(e) => update("secondInterview", { ...data.secondInterview, [field]: e.target.value, mark: data.secondInterview?.mark || "", signature: data.secondInterview?.signature || "", date: data.secondInterview?.date || "", comment: data.secondInterview?.comment || "" })}
                          disabled={readOnly}
                          className="input-field text-center"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
