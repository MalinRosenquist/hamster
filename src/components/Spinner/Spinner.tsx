import styles from "./Spinner.module.scss";

type SpinnerProps = {
  size: "default" | "small";
};

export default function Spinner({ size = "default" }: SpinnerProps) {
  return (
    <div
      className={`${styles.spinner} ${size === "small" ? styles.small : ""}`}
      aria-hidden="true"
    ></div>
  );
}
