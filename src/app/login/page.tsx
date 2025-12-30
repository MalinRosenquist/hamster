"use client";

import Button from "@/components/Buttons/Button";
import styles from "./Login.module.scss";
import Spinner from "@/components/Spinner/Spinner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isPending, setIsPending] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsPending(true);

    await Promise.resolve();
    router.push("/");
  }

  return (
    <div className={`container ${styles.container}`}>
      <h1>Alla kan samla på LEGO!</h1>
      <h2>Med Hamster kan du:</h2>
      <ul className={styles.features}>
        <li>Spara dina LEGO-set</li>
        <li>Bevaka set du letar efter</li>
        <li>Följ LEGO-auktioner</li>
      </ul>
      <div className={styles.card}>
        <h2>Kom igång</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <label htmlFor="userName">Smeknamn</label>
            <small>Välj ett smeknamn för att börja</small>
            <input
              id="userName"
              name="username"
              type="text"
              placeholder="T.ex Lego-Lasse"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className={styles.btnWrapper}>
            <Button variant="primary" type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner size="small"></Spinner>
                  <span>Laddar...</span>
                </>
              ) : (
                "Utforska set"
              )}
            </Button>
          </div>
        </form>
        <small className={styles.muted}>
          Du behöver inget konto. Din data sparas bara i den här webbläsaren.
        </small>
      </div>
    </div>
  );
}
