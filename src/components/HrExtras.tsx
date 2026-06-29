"use client";

import type { Candidate } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

interface HrExtrasProps {
  data: Partial<Candidate>;
  onChange: (data: Partial<Candidate>) => void;
  readOnly?: boolean;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export function HrExtras({ data, onChange, readOnly = false }: HrExtrasProps) {
  const { t } = useLanguage();

  function updateJobOffer(field: string, value: string) {
    onChange({ jobOffer: { ...data.jobOffer!, [field]: value } });
  }

  function updateExam(field: string, value: string) {
    onChange({ examScores: { ...data.examScores!, [field]: value } });
  }

  const job = data.jobOffer || {
    experienceYears: "", basicSalary: "", workNatureAllowance: "",
    transportationAllowance: "", kpiBonus: "", totalSalary: "", workHours: "", notes: "",
  };

  const exam = data.examScores || {
    examScore: "", examCorrect: "", examGrade: "", examNotes: "",
  };

  return (
    <>
      <div className="form-section">
        <div className="section-header">{t("jobOffer")}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <Field label={t("experienceYears")}>
            <input type="text" value={job.experienceYears} onChange={(e) => updateJobOffer("experienceYears", e.target.value)} disabled={readOnly} className="input-field" placeholder={t("placeholderExperienceYears")} />
          </Field>
          <Field label={t("basicSalary")}>
            <input type="number" value={job.basicSalary} onChange={(e) => updateJobOffer("basicSalary", e.target.value)} disabled={readOnly} className="input-field" />
          </Field>
          <Field label={t("workNatureAllowance")}>
            <input type="number" value={job.workNatureAllowance} onChange={(e) => updateJobOffer("workNatureAllowance", e.target.value)} disabled={readOnly} className="input-field" />
          </Field>
          <Field label={t("transportationAllowance")}>
            <input type="number" value={job.transportationAllowance} onChange={(e) => updateJobOffer("transportationAllowance", e.target.value)} disabled={readOnly} className="input-field" />
          </Field>
          <Field label={t("kpiBonus")}>
            <input type="number" value={job.kpiBonus} onChange={(e) => updateJobOffer("kpiBonus", e.target.value)} disabled={readOnly} className="input-field" />
          </Field>
          <Field label={t("totalSalary")}>
            <input type="number" value={job.totalSalary} onChange={(e) => updateJobOffer("totalSalary", e.target.value)} disabled={readOnly} className="input-field" />
          </Field>
          <Field label={t("workHours")}>
            <input type="text" value={job.workHours} onChange={(e) => updateJobOffer("workHours", e.target.value)} disabled={readOnly} className="input-field" placeholder={t("placeholderWorkHours")} />
          </Field>
          <Field label={t("notes")}>
            <input type="text" value={job.notes} onChange={(e) => updateJobOffer("notes", e.target.value)} disabled={readOnly} className="input-field" />
          </Field>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">{t("examScores")}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <Field label={t("examScore")}>
            <input type="text" value={exam.examScore} onChange={(e) => updateExam("examScore", e.target.value)} disabled={readOnly} className="input-field" placeholder={t("placeholderExamScore")} />
          </Field>
          <Field label={t("examCorrect")}>
            <input type="text" value={exam.examCorrect} onChange={(e) => updateExam("examCorrect", e.target.value)} disabled={readOnly} className="input-field" placeholder={t("placeholderExamCorrect")} />
          </Field>
          <Field label={t("examGrade")}>
            <input type="text" value={exam.examGrade} onChange={(e) => updateExam("examGrade", e.target.value)} disabled={readOnly} className="input-field" placeholder={t("placeholderExamGrade")} />
          </Field>
          <Field label={t("notes")}>
            <input type="text" value={exam.examNotes} onChange={(e) => updateExam("examNotes", e.target.value)} disabled={readOnly} className="input-field" />
          </Field>
        </div>
      </div>
    </>
  );
}
