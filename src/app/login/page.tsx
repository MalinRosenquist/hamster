"use client";

import Button from "@/components/Buttons/Button/Button";
import styles from "./Login.module.scss";
import Spinner from "@/components/Spinner/Spinner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { authSetUserName } from "@/lib/storage/authStore";

export default function LoginPage() {
  const [isPending, setIsPending] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const trimmed = nameInput.trim();

  const USERNAME_RE = /^[A-Za-zÅÄÖåäö]{3,20}$/;
  const isValid = USERNAME_RE.test(trimmed);
  const isDisabled = isPending || !isValid;

  const router = useRouter();
  const { isAuthed } = useAuth();

  useEffect(() => {
    if (isAuthed) router.replace("/");
  }, [isAuthed, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setIsPending(true);
    try {
      authSetUserName(trimmed);
      router.replace("/");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={`container ${styles.container}`}>
      <h1>Alla kan samla på LEGO!</h1>
      <h2>Med Hamster kan du:</h2>

      <ul className={styles.features}>
        <li>Spara dina LEGO-set</li>
        <li>Bevaka set du letar efter</li>
        <li>Följa LEGO-auktioner</li>
      </ul>

      <div className={styles.card}>
        <h2>Kom igång</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userName">Smeknamn</label>
            <small id="userNameHelp">Välj ett smeknamn (3-20 bokstäver)</small>
            <input
              data-testid="login-username"
              id="userName"
              name="username"
              type="text"
              placeholder="T.ex LegoLasse"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              disabled={isPending}
              required
              aria-describedby="userNameHelp"
            />
          </div>

          <Button
            data-testid="login-submit"
            variant="primary"
            type="submit"
            disabled={isDisabled}
          >
            {isPending ? (
              <>
                <Spinner size="small" />
                <span>Laddar...</span>
              </>
            ) : (
              "Utforska set"
            )}
          </Button>
        </form>

        <small className={styles.muted}>
          Du behöver inget konto. Din data sparas bara i den här webbläsaren.
        </small>
      </div>
    </div>
  );
}
