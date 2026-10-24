import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/pohon/:path*",
    "/individu/:path*",
    "/direktori/:path*",
    "/kontribusi/:path*",
    "/sumber/:path*",
    "/anggota/:path*",
    "/pengaturan/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
