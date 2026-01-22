import "@/styles/globals.scss";
import { Cabin_Condensed, Manrope } from "next/font/google";
import UserProvider from "@/providers/UserProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Suspense } from "react";

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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${karma.variable} ${martelSans.variable}`}>
      <body>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <UserProvider>{children}</UserProvider>
        <Footer />
      </body>
    </html>
  );
}
