import { NextRequest, NextResponse } from "next/server";
import { createInviteLink } from "@/lib/db";
import { resolveJobPositionStorage } from "@/lib/jobs";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { jobValue, otherJob } = await request.json();

    if (!jobValue) {
      return NextResponse.json({ error: "job_required" }, { status: 400 });
    }
    if (jobValue === "other" && !otherJob?.trim()) {
      return NextResponse.json({ error: "other_job_required" }, { status: 400 });
    }

    const position = resolveJobPositionStorage(jobValue, otherJob || "");
    const link = createInviteLink(position, "reception", 3);

    return NextResponse.json({
      token: link.token,
      url: `/apply/${link.token}`,
    });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
