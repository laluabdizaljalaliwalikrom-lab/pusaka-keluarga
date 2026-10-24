import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="id">
      <body className="antialiased selection:bg-pusaka-200 selection:text-pusaka-900">
        {children}
      </body>
    </html>
  );
}

