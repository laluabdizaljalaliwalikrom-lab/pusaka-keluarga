import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pusaka Keluarga — Pencatatan & Penelusuran Silsilah Lintas Generasi",
  description: "Aplikasi pencatatan silsilah keluarga besar terpusat, kolaboratif, berbasis bukti sumber dan verifikasi silsilah akurat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={outfit.variable}>
      <body className={`${outfit.className} bg-gray-50 text-gray-900 antialiased selection:bg-brand-100 selection:text-brand-900`}>
        {children}
      </body>
    </html>
  );
}
