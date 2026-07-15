"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { LotusLogo } from "@/components/LotusLogo";
import { Printer, QrCode } from "lucide-react";

export function ReceptionQrPanel() {
  const { t } = useLanguage();
  const [origin, setOrigin] = useState("");
  const receptionUrl = origin ? `${origin}/apply/reception` : "";
  const qrSrc = receptionUrl ? `/api/reception/qr?url=${encodeURIComponent(receptionUrl)}` : "";

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="section-header flex items-center gap-2">
        <QrCode className="h-5 w-5" />
        {t("receptionQr")}
      </div>

      <div className="p-6">
        <p className="text-sm text-gray-600 mb-6">{t("receptionQrDesc")}</p>

        <div id="reception-qr-print" className="flex flex-col items-center gap-6 print:gap-4">
          <div className="rounded-2xl border-2 border-lotus-green/20 bg-white p-6 text-center shadow-sm print:shadow-none print:border-2">
            <div className="mb-4 flex justify-center">
              <div className="rounded-xl bg-white p-3">
                <LotusLogo variant="official" className="h-16 w-auto" width={64} height={64} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-lotus-green mb-1">{t("lotusPharmacies")}</h3>
            <p className="text-sm text-gray-600 mb-4">{t("scanToApply")}</p>

            {qrSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrSrc}
                alt={t("receptionQr")}
                width={280}
                height={280}
                className="mx-auto rounded-lg"
              />
            ) : (
              <div className="h-[280px] w-[280px] mx-auto bg-gray-100 animate-pulse rounded-lg" />
            )}

            <p className="mt-4 text-xs text-gray-500 break-all" dir="ltr">
              {receptionUrl}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 print:hidden">
          <button type="button" onClick={handlePrint} className="btn-lotus">
            <Printer className="h-4 w-4" />
            {t("printQr")}
          </button>
        </div>
      </div>
    </div>
  );
}
