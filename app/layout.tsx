import type { Metadata } from "next";

import "./globals.css";
import { Kanit } from 'next/font/google'



const kanit = Kanit({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Adel Boussenane",
  description: "Adel Boussenane&apos;s Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${kanit.className} font-kanit`}>{children}</body>
    </html>
  )
}
