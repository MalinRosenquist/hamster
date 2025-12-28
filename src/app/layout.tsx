import "@/styles/globals.scss";
import { Karma, Martel_Sans } from "next/font/google";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

const karma = Karma({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-brand",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const martelSans = Martel_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  fallback: ["system-ui", "-apple-system", "Roboto", "sans-serif"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${karma.variable} ${martelSans.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
