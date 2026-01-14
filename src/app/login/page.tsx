"use client";

import Button from "@/components/Buttons/Button/Button";
import styles from "./Login.module.scss";
import Spinner from "@/components/Spinner/Spinner";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/contexts/UserContext";
import { UserActionTypes } from "@/reducers/UserReducer";
import { getStoredUserName } from "@/lib/authLocalStorage";

export default function LoginPage() {
  const [isPending, setIsPending] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const { dispatch } = useContext(UserContext);
  const trimmed = nameInput.trim();
  const USERNAME_RE = /^[A-Za-zÅÄÖåäö]{3,20}$/;
  const isValid = USERNAME_RE.test(trimmed);
  const isDisabled = isPending || !isValid;
  const router = useRouter();

  // If user already exists in localStorage, send to "/".
  useEffect(() => {
    const existing = getStoredUserName();
    if (existing) router.replace("/");
  }, [router]);

  // Send user to "/" when entered userName
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    setIsPending(true);

    try {
      dispatch({ type: UserActionTypes.SET_NAME, payload: trimmed });
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
        </form>
        <small className={styles.muted}>
          Du behöver inget konto. Din data sparas bara i den här webbläsaren.
        </small>
      </div>
    </div>
  );
}
