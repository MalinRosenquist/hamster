import styles from "./ItemDetailPage.module.scss";
import { getSetBySetNum } from "@/server/services/setService";
import Image from "next/image";
import DetailToggles from "@/components/ListToggle/DetailToggles/DetailToggles";

type SetProps = {
  params: Promise<{ setId: string }>;
};

export default async function ItemDetailPage({ params }: SetProps) {
  const { setId } = await params;
  const set = await getSetBySetNum(setId);

  return (
    <div className={`container ${styles.container}`}>
      <section>
        <h1>{set.name}</h1>
      </section>

      <section className={styles.setCard}>
        <div className={styles.imgContainer}>
          <Image
            src={set.set_img_url?.trim() ? set.set_img_url : "/icons/no_photo.svg"}
            className={styles.image}
            alt=""
            width={200}
            height={200}
          />
        </div>
        <div className={styles.detailsContainer}>
          <dl className={styles.details}>
            <div className={styles.detailRow}>
              <dt>Setnamn</dt>
              <dd>{set.name}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Setnummer</dt>
              <dd>{set.set_num}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Tema</dt>
              <dd>{set.theme_id}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Antal delar</dt>
              <dd>{set.num_parts}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Utgivningsår</dt>
              <dd>{set.year}</dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Status</dt>
              <dd></dd>
            </div>
            <div className={styles.detailRow}>
              <dt>Tillagd</dt>
              <dd></dd>
            </div>
          </dl>
          <DetailToggles setNum={set.set_num} />
        </div>
      </section>

      <section className={styles.traderaCard}>
        <h2>Tradera</h2>
      </section>
    </div>
  );
}
