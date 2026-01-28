import Image from "next/image";
import styles from "./TraderaList.module.scss";
import { TraderaAuction } from "@/models/TraderaAuction";
import GavelIcon from "@/components/Icons/GavelIcon";
import MoneyIcon from "../Icons/MoneyIcon";
import { formatAuctionEndTime } from "@/lib/time";

type TraderaListProps = {
  auctions: TraderaAuction[];
  nowIso: string;
};

export default function TraderaList({ auctions, nowIso }: TraderaListProps) {
  const formatPrice = (value: number | null | undefined) => {
    if (value == null || value === 0) return "Inte möjligt";

    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ul data-testid="tradera-list" className={styles.traderaList}>
      {auctions.map((a) => (
        <li data-testid={`tradera-list-item-${a.id}`} key={a.id}>
          <div className={styles.traderaCard}>
            <div className={styles.imgContainer}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.imgLink}
              >
                {a.thumbnailUrl ? (
                  <Image
                    src={a.thumbnailUrl}
                    className={styles.image}
                    alt={a.title}
                    width={200}
                    height={150}
                  />
                ) : (
                  <Image src="/icons/no_photo.svg" alt="" width={200} height={150} />
                )}
              </a>
            </div>
            <div className={styles.info}>
              <h3 className={styles.title}>{a.title}</h3>
              <dl className={styles.meta}>
                <dt className={styles.metaLabel}>
                  <GavelIcon aria-hidden="true" focusable="false" />
                  Maxbud
                </dt>
                <dd className={styles.metaValue}>{formatPrice(a.maxBid)}</dd>

                <dt className={styles.metaLabel}>
                  <MoneyIcon aria-hidden="true" focusable="false" />
                  Köp nu
                </dt>
                <dd className={styles.metaValue}>{formatPrice(a.buyItNowPrice)}</dd>
              </dl>
              {a.endDate ? (
                <span className={styles.endDate}>
                  {formatAuctionEndTime({ endIso: a.endDate, nowIso }).text}
                </span>
              ) : (
                <span className={styles.endDate}>Slutdatum saknas</span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
