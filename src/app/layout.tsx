import { Navigation } from "@/components/Navigation"
import AuthProvider from "@/providers/AuthProvider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ReliableNet - Find Your Perfect ISP",
  description: "Compare internet service providers, check speeds, and read reviews.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          <main className="min-h-screen pt-16">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
