"use client";

import { useState } from "react";
import styles from "./FaqAccordion.module.scss";
import { FaqItem } from "@/models/FaqItem";

type FaqAccordionProps = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={styles.accordion}>
      {items.map((item) => {
        const isOpen = item.id === openId;
        const panelId = `faq-panel-${item.id}`;
        const buttonId = `faq-button-${item.id}`;

        return (
          <div key={item.id} className={styles.item}>
            <h3>
              <button
                data-testid={`faq-toggle-${item.id}`}
                type="button"
                id={buttonId}
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span>{item.question}</span>
                <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
            </h3>

            {isOpen && (
              <div
                data-testid={`faq-panel-${item.id}`}
                id={panelId}
                className={styles.panel}
                role="region"
                aria-labelledby={buttonId}
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
