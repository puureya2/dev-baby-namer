import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BabyNamer — Find Your Baby's Perfect Name",
  description:
    "Get 50 personalised baby name suggestions powered by AI. Answer 10 quick questions, pay $5, and discover names you'll love.",
  openGraph: {
    title: "BabyNamer — Find Your Baby's Perfect Name",
    description: "50 personalised baby names powered by AI. Answer 10 questions, get results instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-cream-100 min-h-screen`}>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#FFF8F0",
              border: "1px solid #F4A26B",
              color: "#2D1F14",
              borderRadius: "12px",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
