import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

// Internationalization Middleware
const intlMiddleware = createMiddleware(routing);

// Backend API URL for verifying refresh tokens
const VERIFY_REFRESH_TOKEN_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-refresh-token`;

export async function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;
  const siteLocale = pathname.split("/")[1];

  const isAuthRoute = pathname.startsWith(`/${siteLocale}/auth`);
  const isDashboardRoute = pathname.startsWith(`/${siteLocale}/dashboard`);

  // If accessing a protected route, verify refresh token
  if (isDashboardRoute) {
    if (!refreshToken) {
      return redirectToLogin(request, siteLocale, pathname);
    }

    const isValid = await verifyRefreshToken(refreshToken);
    if (!isValid) {
      return redirectToLogin(request, siteLocale, pathname);
    }
  }

  // Redirect authenticated users away from auth routes
  if (refreshToken && isAuthRoute) {
    const from =
      request.nextUrl.searchParams.get("from") || `/${siteLocale}/dashboard`;
    return NextResponse.redirect(new URL(from, request.url));
  }

  // Run the internationalization middleware first
  const intlResponse = intlMiddleware(request);
  if (intlResponse) return intlResponse;

  // Redirect "/" to the localized dashboard
  if (pathname === "/" || pathname === `/${siteLocale}`) {
    return NextResponse.redirect(
      new URL(`/${siteLocale}/dashboard`, request.url)
    );
  }

  return NextResponse.next();
}

// Function to verify refresh token
async function verifyRefreshToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(VERIFY_REFRESH_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return false;
  }
}

// Redirect to login
function redirectToLogin(request: NextRequest, locale: string, from: string) {
  const redirectUrl = new URL(`/${locale}/auth/login`, request.url);
  redirectUrl.searchParams.set("from", from);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    "/",
    "/(en|tr|ru)",
    "/(en|tr|ru)/dashboard",
    "/(en|tr|ru)/dashboard/:path*",
    "/(en|tr|ru)/auth",
    "/(en|tr|ru)/auth/:path*",
  ],
};
