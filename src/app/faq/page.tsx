import styles from "./FaqPage.module.scss";
import { faqItems } from "@/data/faq";
import FaqAccordion from "@/components/FaqAccordion/FaqAccordion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
};

export default function FaqPage() {
  return (
    <section className="container">
      <section className={styles.top}>
        <h1>FAQ</h1>
        <p>
          Här hittar du svar på vanliga frågor om hur Hamster fungerar och hur du
          använder funktionerna på sidan.
        </p>
      </section>

      <section>
        <h2 className="srOnly">Frågor och svar</h2>
        <FaqAccordion items={faqItems} />
      </section>
    </section>
  );
}
