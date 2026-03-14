import { NextRequest, NextResponse } from "next/server";
import { SageOneApiClient } from "@/lib/sageOneApiClient";

/**
 * Get Items from Sage One
 * GET /api/sage/items
 * 
 * Pulls the list of items/stock from Sage One API
 */
export async function GET(request: NextRequest) {
  try {
    const sageToken = process.env.SAGE_API_TOKEN;
    const sageUsername = process.env.SAGE_API_USERNAME;
    const sagePassword = process.env.SAGE_API_PASSWORD;
    const sageApiUrl = process.env.SAGE_API_URL;

    if (!sageToken && (!sageUsername || !sagePassword)) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Sage API credentials",
        },
        { status: 400 }
      );
    }

    // Initialize Sage client
    const client = new SageOneApiClient(
      sageUsername || "",
      sagePassword || "",
      sageToken,
      sageApiUrl
    );

    // Authenticate
    const authSuccess = await client.authenticate();
    if (!authSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to authenticate with Sage One API",
          hint: "Check SAGE_API_TOKEN, SAGE_API_USERNAME, and SAGE_API_PASSWORD",
        },
        { status: 401 }
      );
    }

    // Get items from Sage
    const itemsResult = await client.getItems();

    if (!itemsResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: itemsResult.error,
          message: "Failed to retrieve items from Sage",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Retrieved ${itemsResult.data?.length || 0} items from Sage One`,
        items: itemsResult.data || [],
        count: itemsResult.data?.length || 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sage items GET error:", error);
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
