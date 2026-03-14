import { NextRequest, NextResponse } from "next/server";
import { SageOneApiClient, testSageConnection } from "@/lib/sageOneApiClient";

/**
 * Test Sage One API Connection
 * GET /api/sage/test
 * 
 * Tests authentication and returns company details if successful
 */
export async function GET(request: NextRequest) {
  try {
    const sageToken = process.env.SAGE_API_TOKEN;
    const sageUsername = process.env.SAGE_API_USERNAME;
    const sagePassword = process.env.SAGE_API_PASSWORD;
    const sageApiUrl = process.env.SAGE_API_URL;

    console.log("🔐 Checking Sage credentials...");
    console.log("Token:", !!sageToken);
    console.log("Username:", !!sageUsername);
    console.log("Password:", !!sagePassword);

    if (!sageUsername || !sagePassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Sage API credentials",
          required: ["SAGE_API_USERNAME", "SAGE_API_PASSWORD"],
          found: {
            token: !!sageToken,
            username: !!sageUsername,
            password: !!sagePassword,
          },
        },
        { status: 400 }
      );
    }

    const result = await testSageConnection(sageUsername, sagePassword, sageToken);

    return NextResponse.json(
      {
        success: result.success,
        message: result.success ? "✅ Successfully connected to Sage One API" : "❌ Failed to connect to Sage",
        data: result.data,
        error: result.error,
        credentials: {
          username: sageUsername || "not set",
          apiUrl: sageApiUrl || "default",
          sandboxMode: process.env.SAGE_SANDBOX_MODE === "true",
        },
      },
      { status: result.success ? 200 : 401 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: String(error),
      },
      { status: 500 }
    );
  }
}
