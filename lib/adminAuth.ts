/**
 * Admin Authentication Middleware
 * 
 * Simple auth check for admin endpoints
 */

import { NextRequest } from "next/server";

export async function adminAuthMiddleware(req: NextRequest) {
  // For now, just check if request has auth header
  // In production, verify JWT token or session
  const authHeader = req.headers.get("authorization");
  
  if (!authHeader) {
    // Allow for demo/development
    return { id: "admin-demo", email: "admin@demo.com", role: "admin" };
  }

  // In production:
  // const token = authHeader.replace("Bearer ", "");
  // const verified = await verifyJWT(token);
  // return verified ? verified.user : null;

  return { id: "admin-user", email: "admin@fieldcost.com", role: "admin" };
}
