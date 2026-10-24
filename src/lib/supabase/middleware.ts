import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";

interface CookieToSet {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

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

  // Jalur cepat: Jika bukan rute auth maupun terproteksi, langsung lewat tanpa network call (0ms)
  if (!isAuthRoute && !isProtectedRoute) {
    return supabaseResponse;
  }

  // Cek apakah ada cookie sesi Supabase
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) => c.name.includes("-auth-token") && Boolean(c.value)
  );

  // Optimasi Cepat (Zero-Network Bypass):
  // Jika pengguna tidak punya cookie auth:
  if (!hasAuthCookie) {
    // Ke rute terproteksi -> langsung redirect ke login secara lokal (0ms)
    if (isProtectedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectedFrom", pathname);
      return NextResponse.redirect(url);
    }
    // Ke rute login/register -> langsung sajikan halaman tanpa memanggil internet (0ms)
    if (isAuthRoute) {
      return supabaseResponse;
    }
  }

  // Hanya verifikasi ke cloud Supabase jika ada cookie sesi aktif
  try {
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
