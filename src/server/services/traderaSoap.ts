import { TraderaSearchItem } from "@/models/TraderaSearchItem";
import { XMLParser } from "fast-xml-parser";
import "server-only";

const DEFAULT_CATEGORY_ID = 180405; // LEGO-set category ID on Tradera

// Convert set number to its base form (e.g. "8009-1" -> "8009")
function toBaseSetNumber(value: string): string {
  const base = value.split("-")[0]?.trim();
  return base || value.trim();
}

/**
 * Builds a SOAP envelope for Tradera SearchService.Search.
 */
function buildSearchEnvelope(params: {
  appId: string;
  appKey: string;
  query: string;
  categoryId: number;
}) {
  const { appId, appKey, query, categoryId } = params;
  const searchWords = toBaseSetNumber(query);

  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
               xmlns:xsd="http://www.w3.org/2001/XMLSchema"
               xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Header>
    <!-- Application authentication (required for SearchService) -->
    <AuthenticationHeader xmlns="http://api.tradera.com">
      <AppId>${appId}</AppId>
      <AppKey>${appKey}</AppKey>
    </AuthenticationHeader>
  </soap:Header>

  <soap:Body>
    <!-- Search request -->
   <SearchAdvanced xmlns="http://api.tradera.com">
  <request>
    <SearchWords>${searchWords}</SearchWords>
    <CategoryId>${categoryId}</CategoryId>
    <SearchInDescription>true</SearchInDescription>
    <ItemsPerPage>20</ItemsPerPage>
    <PageNumber>1</PageNumber>
    <OrderBy>Relevance</OrderBy>
    <OnlyItemsWithThumbnail>true</OnlyItemsWithThumbnail>
  </request>
</SearchAdvanced>
  </soap:Body>
</soap:Envelope>`;
}

/**
 * Calls Tradera SearchService.Search and returns the raw SOAP XML response as a string.
 */
export async function traderaSearchRawXml(query: string): Promise<string> {
  // Read credentials from environment variables.
  const appId = process.env.TRADERA_APP_ID;
  const appKey = process.env.TRADERA_APP_KEY;

  if (!appId || !appKey) {
    throw new Error("Missing TRADERA_APP_ID / TRADERA_APP_KEY in env");
  }

  // Build SOAP request body.
  const xml = buildSearchEnvelope({
    appId,
    appKey,
    query,
    categoryId: DEFAULT_CATEGORY_ID,
  });

  // Send SOAP request to Tradera SearchService endpoint.
  const res = await fetch("https://api.tradera.com/v3/searchservice.asmx", {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: "http://api.tradera.com/SearchAdvanced",
    },
    body: xml,
  });

  // Read response as raw XML text.
  const text = await res.text();

  // If Tradera returns an error, include part of the SOAP fault in the error message
  // to make debugging easier.
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from Tradera: ${text.slice(0, 2000)}`);
  }

  return text;
}

const xmlParser = new XMLParser({
  ignoreAttributes: true,
});

// Helper so we can handle "one item" vs "many items" consistently.
function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export async function traderaSearchItems(
  query: string
): Promise<TraderaSearchItem[]> {
  const xml = await traderaSearchRawXml(query);
  const obj = xmlParser.parse(xml);

  // SOAP often uses prefixed keys like "soap:Envelope"
  const envelope = obj["soap:Envelope"] ?? obj["Envelope"];
  const body = envelope?.["soap:Body"] ?? envelope?.["Body"];

  const searchResponse = body?.SearchAdvancedResponse;
  const searchResult = searchResponse?.SearchAdvancedResult;

  const rawItems = searchResult?.Items;

  const maybeWrapped =
    rawItems && typeof rawItems === "object" && "Item" in rawItems
      ? (rawItems as { Item?: TraderaSearchItem | TraderaSearchItem[] }).Item
      : (rawItems as TraderaSearchItem | TraderaSearchItem[] | undefined);

  return toArray<TraderaSearchItem>(maybeWrapped);
}
