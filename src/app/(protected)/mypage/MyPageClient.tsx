"use client";

import Button from "@/components/Buttons/Button/Button";
import styles from "./MyPage.module.scss";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import ClearModal from "@/components/Modal/ClearModal";
import { SetListsContext } from "@/contexts/SetListsContext";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import { authClearUserName, authSetUserName } from "@/lib/storage/authStore";
import { LS_SET_LISTS } from "../../../lib/storage/storageKeys";

export default function MyPageClient() {
  const router = useRouter();
  const { userName, isAuthed } = useAuth();

  const [nameInput, setNameInput] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const trimmed = nameInput.trim();
  const USERNAME_RE = /^[A-Za-zÅÄÖåäö]{3,20}$/;
  const isValid = USERNAME_RE.test(trimmed);

  const isDisabled = !isValid || trimmed === (userName ?? "");

  const { counts } = useContext(SetListsContext);

  // Send to login if not authed
  useEffect(() => {
    if (!isAuthed) router.replace("/login");
  }, [isAuthed, router]);

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

    authSetUserName(trimmed);

    setNameInput("");
    setSaveMessage("Sparat!");
  }

  function handleConfirmClear() {
    window.localStorage.removeItem(LS_SET_LISTS);
    authClearUserName();
    setIsModalOpen(false);
    setNameInput("");
    setSaveMessage(null);
    router.replace("/login");
  }

  // Prevent any content from flashing while redirecting
  if (!isAuthed) return null;

  return (
    <div className="container">
      <div className={styles.wrapper}>
        <section>
          <h1>Min Sida</h1>
        </section>

        {/* Counters */}
        <section className={styles.counters} aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="srOnly">
            Översikt
          </h2>
          <Link href="/watchlist" className={styles.card}>
            <span
              data-testid="watchlist-count"
              id="watchlistCounter"
              className={styles.counter}
            >
              {counts.watchlist}
            </span>
            <span id="watchlistLabel" className={styles.label}>
              Set bevakade
            </span>
          </Link>

          <Link href="/collection" className={styles.card}>
            <span
              data-testid="collection-count"
              id="collectionCounter"
              className={styles.counter}
            >
              {counts.collection}
            </span>
            <span id="collectionLabel" className={styles.label}>
              Set samlade
            </span>
          </Link>
        </section>

        {/* Usersettings */}
        <section
          className={styles.userSettings}
          aria-labelledby="user-settings-heading"
        >
          <h2 id="user-settings-heading" className="srOnly">
            Inställningar
          </h2>
          <section className={styles.panel}>
            <h3 className={styles.title}>Ändra namn</h3>
            <form className={styles.form} onSubmit={handleSave}>
              <label htmlFor="newName">Välj ett nytt namn</label>
              <small id="newNameHelp">Namnet behöver bestå av 3-20 bokstäver</small>

              <div className={styles.row}>
                <input
                  data-testid="username-input"
                  id="newName"
                  minLength={3}
                  maxLength={20}
                  type="text"
                  value={nameInput}
                  placeholder={userName ?? ""}
                  aria-describedby="newNameHelp"
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    setSaveMessage(null);
                  }}
                />

                <Button
                  data-testid="save-username"
                  variant="secondary"
                  type="submit"
                  disabled={isDisabled}
                >
                  Spara
                </Button>

                {saveMessage && (
                  <p data-testid="save-message" role="status" aria-live="polite">
                    {saveMessage}
                  </p>
                )}
              </div>
            </form>
          </section>

          <section className={styles.panel}>
            <h3 className={styles.title}>Rensa min information</h3>
            <p className={styles.description}>
              Har du samlat klart? Här kan du ta bort ditt konto. Detta tar bort
              samling, bevakning och sparat namn från den här enheten och kan inte
              återhämtas.
            </p>
            <Button
              data-testid="clear-data"
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
        />
      </div>
    </div>
  );
}
