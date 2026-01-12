import styles from "./Collection.module.scss";
import CollectionSection from "./CollectionSection";

export default function CollectionPage() {
  return (
    <div className="container">
      <section className={styles.top}>
        <h1>Samling</h1>
      </section>

      <CollectionSection />
    </div>
  );
}
