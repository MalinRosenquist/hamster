import "server-only";
import { getSetBySetNum } from "@/server/services/setService";
import { getThemeById } from "@/server/services/themeService";
import { getTraderaAuctionsBySetNum } from "@/server/services/traderaService";

export async function getItemDetail(setNum: string) {
  const set = await getSetBySetNum(setNum);

  const [theme, tradera] = await Promise.all([
    getThemeById(set.theme_id).catch(() => null),
    getTraderaAuctionsBySetNum(set.set_num),
  ]);

  return {
    set,
    themeName: theme?.name ?? String(set.theme_id),
    tradera,
  };
}
