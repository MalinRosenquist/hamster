import styles from "./CardList.module.scss";

type CardListProps = {
  children: React.ReactNode;
};

export default function CardList({ children }: CardListProps) {
  return (
    <>
      <ul className={styles.list}>{children}</ul>
    </>
  );
}
