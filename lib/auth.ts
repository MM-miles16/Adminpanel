// lib/auth.ts - Secure JWT authentication utilities
import jwt from 'jsonwebtoken';

/**
 * Securely verify JWT token using Supabase JWT secret
 * @param token - The JWT token to verify
 * @returns Decoded user object if valid, null otherwise
 */
export function verifyToken(token: string | null): any {
  if (!token) {
    return null;
  }

  try {
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('CRITICAL: SUPABASE_JWT_SECRET environment variable is not set. Authentication disabled.');
      return null;
    }

    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error: any) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
}

/**
 * Extract and verify user from standard Request object (supporting cookies and authorization header)
 * @param request - Next.js Request or IncomingMessage
 * @returns Decoded user object if valid, null otherwise
 */
export function getUserFromRequest(request: any): any {
  if (!request) return null;

  let token = null;

  // 1. Try to read token from Next.js request.cookies helper
  if (request.cookies && typeof request.cookies.get === "function") {
    token = request.cookies.get("admin_token")?.value;
  }

  // 2. Fallback: Parse from standard raw Cookie header string
  if (!token) {
    const cookieHeader = request.headers?.get?.("cookie") || request.headers?.cookie || "";
    const match = cookieHeader.match(/admin_token=([^;]+)/);
    if (match) {
      token = match[1];
    }
  }

  // 3. Fallback: Read from Authorization header
  if (!token) {
    const authHeader = request.headers?.get?.("authorization") || request.headers?.authorization || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  return verifyToken(token);
}

/**
 * Legacy support for extracting user from authorization header string
 */
export function getUserFromAuthHeader(authHeader: string | null): any {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  return verifyToken(token);
}

/**
 * Middleware function to verify authentication (now checking request cookies)
 */
export function requireAuth(request: any): any {
  const user = getUserFromRequest(request);
  if (!user) {
    return null;
  }
  return user;
}
