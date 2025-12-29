import React from "react";
import styles from "./Button.module.scss";

type ButtonProps = {
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
};

export default function Button({
  variant = "primary",
  children,
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
