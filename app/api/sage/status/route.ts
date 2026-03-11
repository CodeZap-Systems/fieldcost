import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "operational",
    timestamp: new Date().toISOString(),
    integrationType: "sage-x3-xero",
    lastSync: null,
  });
}
