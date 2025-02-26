import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css";
import Navbar from "@/app/components/Navbar";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nile Project Data Portal",
  description: "Select a data source for analyzing musical content from the Nile Project",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Navbar />
        <div className="container mx-auto">{children}</div>
      </body>
    </html>
  )
}
