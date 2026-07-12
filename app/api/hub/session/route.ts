// app/api/hub/session/route.ts
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Extract cookie from standard Next.js request.cookies
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/admin_token=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: decoded.sub,
        name: decoded.name,
        role: decoded.role || "admin",
        phone: decoded.phone,
        email: decoded.email
      }
    });
  } catch (error) {
    console.error("Session check API error:", error);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
