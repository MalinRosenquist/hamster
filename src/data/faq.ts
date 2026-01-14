import { FaqItem } from "@/models/FaqItem";

export const faqItems: FaqItem[] = [
  {
    id: "what-is-hamster",
    question: "Vad är Hamster?",
    answer:
      "Hamster är en tjänst för samlare där du kan katalogisera LEGO-set och se matchande Tradera-annonser.",
  },
  {
    id: "where-is-data-saved",
    question: "Var sparas min data?",
    answer:
      "I den här versionen sparas data lokalt i din webbläsare via localStorage. Om du rensar webbdata kan den försvinna.",
  },
];
