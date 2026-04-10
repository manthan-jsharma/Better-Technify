import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./fonts.css";
import { ScrollProvider } from "@/app/components/providers/ScrollProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Better Technify", // I updated this from "Create Next App" for you!
  description: "Better Technify Official Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* I added `bg-white` and `text-gray-900` here. 
        This will force the background to be white and text to be dark, 
        overriding any default dark mode styles! 
      */}
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <ScrollProvider>
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}
