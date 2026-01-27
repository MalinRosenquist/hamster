import { Metadata } from "next";
import WatchlistSection from "./WatchlistSection";

export const metadata: Metadata = {
  title: "Mina bevakningar",
};

export default function WatchListPage() {
  return (
    <div className="container">
      <section>
        <h1>Bevakning</h1>
      </section>

      <WatchlistSection />
    </div>
  );
}
