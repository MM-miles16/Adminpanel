import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * Catch-all proxy route: /api/sb/rest/v1/vehicles?... 
 * → https://xyz.supabase.co/rest/v1/vehicles?...
 */
export async function GET(request, context) {
  return proxyRequest(request, context, "GET");
}

export async function POST(request, context) {
  return proxyRequest(request, context, "POST");
}

export async function PATCH(request, context) {
  return proxyRequest(request, context, "PATCH");
}

export async function PUT(request, context) {
  return proxyRequest(request, context, "PUT");
}

export async function DELETE(request, context) {
  return proxyRequest(request, context, "DELETE");
}

async function proxyRequest(request, context, method) {
  try {
    // Next.js 15: params is a Promise
    const resolvedParams = await context.params;
    const pathSegments = resolvedParams.path;
    const pathStr = Array.isArray(pathSegments) ? pathSegments.join("/") : pathSegments;
    
    // Reconstruct the target URL with query params
    const url = new URL(request.url);
    const targetUrl = `${SUPABASE_URL}/${pathStr}${url.search}`;
    
    console.log(`[SB Proxy] ${method} → ${targetUrl}`);
    
    // Forward relevant headers
    const headers = {};
    const forwardHeaders = ["apikey", "authorization", "content-type", "prefer", "range", "accept"];
    for (const key of forwardHeaders) {
      const val = request.headers.get(key);
      if (val) headers[key] = val;
    }
    
    // Build fetch options
    const fetchOptions = {
      method,
      headers,
    };
    
    // Forward body for non-GET requests
    if (method !== "GET" && method !== "HEAD") {
      try {
        const body = await request.text();
        if (body) fetchOptions.body = body;
      } catch (e) {
        // No body to forward
      }
    }
    
    const response = await fetch(targetUrl, fetchOptions);
    
    console.log(`[SB Proxy] Response: ${response.status}`);
    
    // Read response body
    const data = await response.arrayBuffer();
    
    // Forward relevant response headers
    const responseHeaders = {};
    const passHeaders = ["content-type", "content-range", "x-total-count"];
    for (const key of passHeaders) {
      const val = response.headers.get(key);
      if (val) responseHeaders[key] = val;
    }
    
    return new NextResponse(response.status === 204 ? null : data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[SB Proxy] Error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Proxy request failed", details: error.message },
      { status: 500 }
    );
  }
}
