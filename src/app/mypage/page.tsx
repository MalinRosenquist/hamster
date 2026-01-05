"use client";

import Button from "@/components/Buttons/Button/Button";
import styles from "./MyPage.module.scss";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { UserActionTypes } from "@/reducers/UserReducer";
import ClearModal from "@/components/Modal/ClearModal";

export default function MyPage() {
  const router = useRouter();
  const { userName, dispatch } = useContext(UserContext);
  const [nameInput, setNameInput] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const trimmed = nameInput.trim();
  const USERNAME_RE = /^[A-Za-zÅÄÖåäö]{3,20}$/;
  const isValid = USERNAME_RE.test(trimmed);
  const isDisabled = !isValid || trimmed === userName;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Send to login if userName does not exist
  useEffect(() => {
    if (!userName) router.replace("/login");
  }, [userName, router]);

  // Set time on save message
  useEffect(() => {
    if (!saveMessage) return;

    const t = setTimeout(() => {
      setSaveMessage(null);
    }, 3500);

    return () => clearTimeout(t);
  }, [saveMessage]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!isValid) {
      setSaveMessage("Namnet måste vara 3-20 bokstäver (A-Ö)");
      return;
    }

    dispatch({ type: UserActionTypes.SET_NAME, payload: trimmed });

    setNameInput("");
    setSaveMessage("Sparat!");
  }

  function handleConfirmClear() {
    dispatch({ type: UserActionTypes.CLEAR_DATA });
    setIsModalOpen(false);
    setNameInput("");
  }

  return (
    <div className="container">
      <div className={styles.wrapper}>
        <section className={styles.top}>
          <h1>Min Sida</h1>
        </section>

        {/* Counters */}
        <section className={styles.counters}>
          <div className={styles.card}>
            <span id="watchlistCounter" className={styles.counter}>
              0
            </span>
            <span className={styles.label}>Bevakningar</span>
          </div>
          <div className={styles.card}>
            <span id="collectionCounter" className={styles.counter}>
              0
            </span>
            <span className={styles.label}>Set samlade</span>
          </div>
        </section>

        {/* Usersettings */}
        <section className={styles.userSettings}>
          <section className={styles.panel}>
            <h3 className={styles.title}>Ändra namn</h3>
            <form className={styles.form} onSubmit={handleSave}>
              <label htmlFor="newName">Välj ett nytt namn</label>
              <small id="newNameHelp">Namnet behöver bestå av 3-20 bokstäver</small>
              <div className={styles.row}>
                <input
                  id="newName"
                  type="text"
                  value={nameInput}
                  placeholder={userName ?? ""}
                  aria-describedby="newNameHelp"
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    setSaveMessage(null);
                  }}
                />
                <Button variant="secondary" type="submit" disabled={isDisabled}>
                  Spara
                </Button>
                {saveMessage && (
                  <p role="status" aria-live="polite">
                    {saveMessage}
                  </p>
                )}
              </div>
            </form>
          </section>

          <section className={styles.panel}>
            <h3 className={styles.title}>Rensa min information</h3>
            <p>
              Har du samlat klart? Här kan du ta bort ditt konto. Detta tar bort
              samling, bevakning och sparat namn från den här enheten och kan inte
              återhämtas.
            </p>
            <Button
              variant="danger"
              type="button"
              onClick={() => setIsModalOpen(true)}
            >
              Rensa data
            </Button>
          </section>
        </section>

        <ClearModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmClear}
        ></ClearModal>
      </div>
    </div>
  );
}
