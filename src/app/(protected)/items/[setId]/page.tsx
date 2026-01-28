import styles from "./ItemDetailPage.module.scss";
import { getSetBySetNum } from "@/server/services/setService";
import Image from "next/image";
import DetailToggles from "@/components/ListToggle/DetailToggles/DetailToggles";
import { getTraderaAuctionsBySetNum } from "@/server/services/traderaService";
import { formatDurationSv } from "@/lib/time";
import TraderaList from "@/components/TraderaList/TraderaList";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ setId: string }>;
}): Promise<Metadata> {
  const { setId } = await params;
  const set = await getSetBySetNum(setId);

  return { title: set.name };
}

type SetProps = {
  params: Promise<{ setId: string }>;
};

export default async function ItemDetailPage({ params }: SetProps) {
  const { setId } = await params;
  const set = await getSetBySetNum(setId);
  const tradera = await getTraderaAuctionsBySetNum(set.set_num);
  const nowIso = new Date().toISOString();

  return (
    <div className={`container ${styles.container}`}>
      <section>
        <h1>{set.name}</h1>
      </section>

      <section data-testid="set-card" className={styles.setCard}>
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
            <dt>Setnamn</dt>
            <dd data-testid="set-name">{set.name}</dd>

            <dt>Setnummer</dt>
            <dd data-testid="set-num">{set.set_num}</dd>

            <dt>Tema</dt>
            <dd>{set.theme_id}</dd>

            <dt>Antal delar</dt>
            <dd>{set.num_parts}</dd>

            <dt>Utgivningsår</dt>
            <dd>{set.year}</dd>

            <dt>Status</dt>
            <dd></dd>

            <dt>Tillagd</dt>
            <dd></dd>
          </dl>
          <DetailToggles setNum={set.set_num} />
        </div>
      </section>

      {/* Tradera */}
      <section className={styles.traderaListings} aria-labelledby="tradera-heading">
        <h2 id="tradera-heading" className={styles.traderaLogo}>
          <span className="srOnly">Tradera</span>
          <Image
            src="/images/tradera_logo_black.png"
            alt=""
            aria-hidden="true"
            fill
            className={styles.logoImg}
          />
        </h2>

        {tradera.status === "rate_limited" ? (
          <p className={styles.message}>
            {tradera.message ?? "Tradera-anrop är tillfälligt begränsade."}
            {typeof tradera.retryAfterSeconds === "number" && (
              <>Prova igen om {formatDurationSv(tradera.retryAfterSeconds)}.</>
            )}
          </p>
        ) : tradera.auctions.length === 0 ? (
          <p className={styles.message}>
            Inga matchande auktioner för {set.set_num}.
          </p>
        ) : (
          <TraderaList auctions={tradera.auctions} nowIso={nowIso} />
        )}
        <small className={styles.muted}>
          {tradera.cached ? "Visas från cache" : "Hämtad live"}{" "}
          {new Date(tradera.fetchedAt).toLocaleString("sv-SE")}
        </small>
      </section>
    </div>
  );
}
