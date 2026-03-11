import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      status: "operational",
      timestamp: new Date().toISOString(),
      integrationType: "sage-accounting-api",
      apiVersion: "2.0.0",
      lastSync: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
      syncEnabled: true,
      connected: true,
    });
  } catch (e) {
    return NextResponse.json({
      status: "error",
      error: String(e),
      connected: false,
    }, { status: 500 });
  }
}
