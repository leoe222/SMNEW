import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import PageTransitionDots from "@/components/ui/PageTransitionDots";
import React, { Suspense } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skill Matrix",
  description: "Gestiona tus habilidades y competencias profesionales",
    generator: 'v0.app'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
  <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
  <PageTransitionDots />
  <Suspense fallback={null}>{children}</Suspense>
        <Toaster />
      </body>
    </html>
  );
}
