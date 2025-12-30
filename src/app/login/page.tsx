"use client";

import Button from "@/components/Buttons/Button";
import styles from "./Login.module.scss";
import Spinner from "@/components/Spinner/Spinner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isPending, setIsPending] = useState(false);
  const [userName, setUserName] = useState("");
  const trimmed = userName.trim();
  const isDisabled = isPending || trimmed.length < 3;
  const router = useRouter();
  const USERNAME_RE = /^[A-Za-zÅÄÖåäö]{3,20}$/;

  // Send user to "/" when entered userName
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!USERNAME_RE.test(trimmed)) {
      return;
    }

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
          <div>
            <label htmlFor="userName">Smeknamn</label>
            <small id="userNameHelp">Välj ett smeknamn (minst 3 tecken)</small>
            <input
              id="userName"
              name="username"
              type="text"
              placeholder="T.ex Lego-Lasse"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={isPending}
              required
              aria-describedby="userNameHelp"
            />
          </div>
          <div>
            <Button variant="primary" type="submit" disabled={isDisabled}>
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
