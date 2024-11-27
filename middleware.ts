import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  if (!token) {
    // Přesměruj nepřihlášeného uživatele na login stránku
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Konfigurace middleware
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], // Přidejte další chráněné cesty podle potřeby
};
