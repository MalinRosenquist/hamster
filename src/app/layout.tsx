import "@/styles/globals.scss";
import { Cabin_Condensed, Manrope } from "next/font/google";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Suspense } from "react";
import { Metadata } from "next";

const karma = Cabin_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-brand",
  fallback: ["system-ui", "-apple-system", "Roboto", "sans-serif"],
});

const martelSans = Manrope({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  fallback: ["system-ui", "-apple-system", "Roboto", "sans-serif"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Hamster",
    template: "%s | Hamster",
  },
  description: "Din samlingsplats",
  icons: {
    icon: [{ url: "/icons/favicon.ico" }],
  },
  openGraph: {
    title: "Hamster",
    description: "Din samlingsplats",
    type: "website",
    url: "https://hamster-virid.vercel.app/",
    images: [{ url: "/images/og.png", width: 1200, height: 630 }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${karma.variable} ${martelSans.variable}`}>
      <body>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
