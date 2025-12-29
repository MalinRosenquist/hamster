import Button from "@/components/Buttons/Button";
import styles from "./Login.module.scss";

export default function LoginPage() {
  return (
    <section className={`container ${styles.container}`}>
      <h1>Alla kan samla på LEGO!</h1>
      <h2>Med Hamster kan du:</h2>
      <ul className={styles.features}>
        <li>Spara dina LEGO-set</li>
        <li>Bevaka set du letar efter</li>
        <li>Följ LEGO-auktioner</li>
      </ul>
      <div className={styles.card}>
        <h2>Kom igång</h2>
        <form action="">
          <label htmlFor="userName">Smeknamn</label>
          <small>Välj ett smeknamn för att börja</small>
          <input
            id="userName"
            name="username"
            type="text"
            placeholder="T.ex Lego-Lasse"
          />
        </form>
        <Button variant="primary" type="submit">
          Utforska set
        </Button>
        <small className={styles.muted}>
          Du behöver inget konto. Din data sparas bara i den här webbläsaren.
        </small>
      </div>
    </section>
  );
}
