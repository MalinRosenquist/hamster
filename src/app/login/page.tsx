"use client";

import Button from "@/components/Buttons/Button/Button";
import styles from "./Login.module.scss";
import Spinner from "@/components/Spinner/Spinner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { authSetUserName } from "@/lib/storage/authStore";
import Image from "next/image";

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
      <div>
        <h1>Hamstra set - på ditt sätt</h1>
        <p className={styles.tagline}>
          Platsen för dig som aldrig blir för gammal för att samla på LEGO
        </p>
      </div>

      <section className={styles.featuresSection}>
        <h2>Med Hamster kan du:</h2>
        <ul className={styles.features}>
          <li>Håll koll på dina set</li>
          <li>Bevaka set du letar efter</li>
          <li>Se matchande auktioner</li>
        </ul>
      </section>

      <section className={styles.card}>
        <h2>Kom igång</h2>
        <Image
          src="/images/logo_dark.png"
          alt="Hamster med LEGO"
          width={100}
          height={100}
        />
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
              "Börja hamstra"
            )}
          </Button>
        </form>

        <small className={styles.muted}>
          Inget konto, inget krångel. Listorna sparas bara här i webbläsaren.
        </small>
      </section>
    </div>
  );
}
