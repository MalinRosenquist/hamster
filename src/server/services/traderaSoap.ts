import { TraderaSearchItem } from "@/models/TraderaSearchItem";
import { XMLParser } from "fast-xml-parser";
import "server-only";

const DEFAULT_CATEGORY_ID = 1804;

/**
 * Builds a SOAP envelope for Tradera SearchService.Search.
 * Note: The "sandbox" parameter is currently NOT used in the XML (kept for future use).
 */
function buildSearchEnvelope(params: {
  appId: string;
  appKey: string;
  query: string;
  sandbox: boolean;
  categoryId: number;
}) {
  const { appId, appKey, query, categoryId } = params;

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
    <Search xmlns="http://api.tradera.com">
      <query>${query}</query>
      <categoryId>${categoryId}</categoryId>
      <pageNumber>1</pageNumber>
      <orderBy>Relevance</orderBy>
    </Search>
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
    sandbox: true,
    categoryId: DEFAULT_CATEGORY_ID,
  });

  // Send SOAP request to Tradera SearchService endpoint.
  const res = await fetch("https://api.tradera.com/v3/searchservice.asmx", {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: "http://api.tradera.com/Search",
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

export async function TraderaSearchItems(
  query: string
): Promise<TraderaSearchItem[]> {
  const xml = await traderaSearchRawXml(query);
  const obj = xmlParser.parse(xml);

  // SOAP often uses prefixed keys like "soap:Envelope"
  const envelope = obj["soap:Envelope"] ?? obj["Envelope"];
  const body = envelope?.["soap:Body"] ?? envelope?.["Body"];

  console.log("TOP KEYS:", Object.keys(obj));
  console.log("ENVELOPE KEYS:", envelope ? Object.keys(envelope) : null);

  console.log("BODY KEYS:", body ? Object.keys(body) : null);

  const searchResponse = body?.SearchResponse;
  const searchResult = searchResponse?.SearchResult;
  console.log("RAW Items value:", searchResult?.Items);

  console.log(
    "SEARCHRESPONSE KEYS:",
    searchResponse ? Object.keys(searchResponse) : null
  );
  console.log("SEARCHRESULT KEYS:", searchResult ? Object.keys(searchResult) : null);

  const rawItems = searchResult?.Items;

  const maybeWrapped =
    rawItems && typeof rawItems === "object" && "Item" in rawItems
      ? (rawItems as { Item?: TraderaSearchItem | TraderaSearchItem[] }).Item
      : (rawItems as TraderaSearchItem | TraderaSearchItem[] | undefined);

  return toArray<TraderaSearchItem>(maybeWrapped);
}
