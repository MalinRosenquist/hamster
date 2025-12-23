import "@/styles/globals.scss";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
