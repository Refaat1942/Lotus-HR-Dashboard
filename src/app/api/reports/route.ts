import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getReportData } from "@/lib/db";
import { hasPermission } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "view_reports")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const type = request.nextUrl.searchParams.get("type") || "summary";
  const data = getReportData();

  if (type === "candidates-csv") {
    const headers = [
      "Application Number", "Full Name", "Position", "Status", "Mobile", "Governorate",
      "Qualification", "Application Date", "Submitted At",
    ];
    const rows = data.candidates.map((c) => [
      c.applicationNumber, c.fullName, c.positionAppliedFor, c.status, c.mobile1,
      c.governorate, c.educationalQualification, c.applicationDate, c.submittedAt || "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="lotus-candidates-${Date.now()}.csv"`,
      },
    });
  }

  if (type === "links-csv") {
    const headers = ["Position", "Status", "Created At", "Used At", "Expires At", "Token"];
    const rows = data.links.map((l) => [
      l.positionAppliedFor,
      l.usedAt ? "Used" : "Active",
      l.createdAt,
      l.usedAt || "",
      l.expiresAt || "",
      l.token,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="lotus-links-${Date.now()}.csv"`,
      },
    });
  }

  return NextResponse.json(data);
}
