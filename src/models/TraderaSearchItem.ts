export type TraderaSearchItem = {
  Id?: string | number;
  ShortDescription?: string;
  LongDescription?: string;
  ItemUrl?: string;
  ThumbnailLink?: string;
  ImageLinks?: {
    ImageLink?:
      | { Url?: string; Format?: string }
      | { Url?: string; Format?: string }[];
  };
  EndDate?: string;
  MaxBid?: string | number;
  BuyItNowPrice?: string | number;
};
