import Link from "next/link";
import styles from "./Button.module.scss";

type Variant = "primary" | "secondary" | "danger";

type Props = {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
}: Props) {
  return (
    <Link
      href={href}
      className={`${styles.button} ${styles[variant]} ${className ?? ""}`}
    >
      {children}
    </Link>
  );
}
