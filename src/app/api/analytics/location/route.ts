import { NextRequest, NextResponse } from "next/server";
import { recordLocation } from "@/infrastructure/analytics/location-analytics";

const COOKIE = "sole_location_recorded";

function headerValue(request: NextRequest, name: string, fallback: string) {
  const value = request.headers.get(name)?.trim();
  if (!value) return fallback;
  try { return decodeURIComponent(value); } catch { return value; }
}

export async function POST(request: NextRequest) {
  if (request.cookies.has(COOKIE)) return new NextResponse(null, { status: 204 });
  await recordLocation({
    country: headerValue(request, "x-vercel-ip-country", "Desconhecido"),
    region: headerValue(request, "x-vercel-ip-country-region", "Desconhecido"),
    city: headerValue(request, "x-vercel-ip-city", "Desconhecida"),
  });
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(COOKIE, "1", {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 60 * 60 * 24,
  });
  return response;
}
