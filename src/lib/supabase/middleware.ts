import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";

interface CookieToSet {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
}

/**
 * Decode Base64 / Base64URL yang aman untuk Edge Runtime dan Node.js
 */
function safeBase64Decode(str: string): string {
  try {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(str, str.includes("-") || str.includes("_") ? "base64url" : "base64").toString("utf-8");
    }
  } catch {
    // Lanjut ke atob fallback
  }

  try {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    return atob(base64);
  } catch {
    return "";
  }
}

/**
 * Validasi lokal token JWT tanpa round-trip HTTPS ke server Supabase Cloud.
 * Membaca payload JWT langsung dari cookie sesi (0.01ms vs 600-1000ms network lag).
 */
function checkLocalTokenValidity(request: NextRequest): { isValid: boolean; expiresSoon: boolean } {
  try {
    const allCookies = request.cookies.getAll();
    const authCookie = allCookies.find(
      (c) => c.name.includes("-auth-token") && Boolean(c.value)
    );

    if (!authCookie) return { isValid: false, expiresSoon: false };

    let rawValue = authCookie.value;
    if (rawValue.startsWith("base64-")) {
      rawValue = safeBase64Decode(rawValue.slice(7));
    }

    let parsed: any;
    try {
      parsed = JSON.parse(rawValue);
    } catch {
      return { isValid: false, expiresSoon: false };
    }

    const accessToken = parsed.access_token || (Array.isArray(parsed) ? parsed[0] : null);
    if (!accessToken || typeof accessToken !== "string") return { isValid: false, expiresSoon: false };

    const parts = accessToken.split(".");
    if (parts.length !== 3) return { isValid: false, expiresSoon: false };

    const payloadStr = safeBase64Decode(parts[1]);
    if (!payloadStr) return { isValid: false, expiresSoon: true };

    const payload = JSON.parse(payloadStr);
    const now = Math.floor(Date.now() / 1000);

    // Masih berlaku lebih dari 60 detik -> Sangat valid, tidak perlu refresh
    if (payload.exp && payload.exp > now + 60) {
      return { isValid: true, expiresSoon: false };
    }

    // Masih berlaku tapi akan kedaluwarsa dalam 60 detik -> Perlu refresh di background
    if (payload.exp && payload.exp > now) {
      return { isValid: true, expiresSoon: true };
    }
  } catch {
    // Abaikan jika format token berbeda, serahkan ke verifikasi jaringan
  }

  return { isValid: false, expiresSoon: true };
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const pathname = request.nextUrl.pathname;
    const isAuthRoute =
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/forgot-password");
    const isProtectedRoute =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/pohon") ||
      pathname.startsWith("/individu") ||
      pathname.startsWith("/direktori") ||
      pathname.startsWith("/kontribusi") ||
      pathname.startsWith("/sumber") ||
      pathname.startsWith("/anggota") ||
      pathname.startsWith("/pengaturan");

    // 1. Jalur super cepat: Jika bukan rute auth maupun terproteksi, langsung lewat (0ms)
    if (!isAuthRoute && !isProtectedRoute) {
      return supabaseResponse;
    }

    // 2. Evaluasi token JWT lokal di memori (0.01ms)
    const tokenState = checkLocalTokenValidity(request);

    // Kasus A: Token JWT terbukti valid & aktif (navigasi sat set tanpa internet)
    if (tokenState.isValid && !tokenState.expiresSoon) {
      if (isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }

    // Kasus B: Tidak ada token sama sekali
    if (!tokenState.isValid && !tokenState.expiresSoon) {
      if (isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirectedFrom", pathname);
        return NextResponse.redirect(url);
      }
      if (isAuthRoute) {
        return supabaseResponse;
      }
    }

    // Kasus C: Token mendekati kedaluwarsa atau perlu disegarkan -> panggil Supabase SSR
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: CookieToSet[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && isProtectedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(url);
    }

    if (user && isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (error) {
    console.error("Middleware updateSession error:", error);
    return supabaseResponse;
  }
}
