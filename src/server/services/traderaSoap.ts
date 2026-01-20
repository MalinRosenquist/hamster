import "server-only";

/**
 * Builds a SOAP envelope for Tradera SearchService.Search.
 * Note: The "sandbox" parameter is currently NOT used in the XML (kept for future use).
 */
function buildSearchEnvelope(params: {
  appId: string;
  appKey: string;
  query: string;
  sandbox: boolean;
}) {
  const { appId, appKey, query } = params;

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
      <categoryId>0</categoryId>
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
