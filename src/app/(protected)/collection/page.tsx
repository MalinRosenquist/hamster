import { Metadata } from "next";
import CollectionSection from "./CollectionSection";

export const metadata: Metadata = {
  title: "Min samling",
};

export default function CollectionPage() {
  return (
    <div className="container">
      <section>
        <h1>Samling</h1>
      </section>

      <CollectionSection />
    </div>
  );
}
