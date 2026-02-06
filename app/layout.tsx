import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"

import { AppMotionShell } from "@/components/motion/AppMotionShell"
import { TamboClientRootProvider } from "@/components/tambo/TamboClientRootProvider"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "The Playbook",
  description: "One template. Infinite realities.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <TamboClientRootProvider>
          <AppMotionShell>{children}</AppMotionShell>
        </TamboClientRootProvider>
      </body>
    </html>
  )
}
