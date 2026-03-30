import { AZURE_TENANT_ID } from "./microsoftAuth";

// Power BI uses the same Azure tenant as SSO (CodeZap Directory).
// PBI_TENANT_ID can override if a separate Power BI tenant is needed.
const tenantId = process.env.PBI_TENANT_ID ?? AZURE_TENANT_ID;
const clientId = process.env.PBI_CLIENT_ID!;
const clientSecret = process.env.PBI_CLIENT_SECRET!;
const groupId = process.env.PBI_GROUP_ID!; // Power BI workspace ID
type PushRowsParams = {
  datasetId: string;
  tableName: string;
  rows: Record<string, unknown>[];
};

async function getPowerBIAccessToken() {
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://analysis.windows.net/powerbi/api/.default",
  });
  const res = await fetch(url, {
    method: "POST",
    body: params,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

export async function pushRowsToPowerBI({ datasetId, tableName, rows }: PushRowsParams) {
  const token = await getPowerBIAccessToken();
  const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/tables/${tableName}/rows`;
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rows }),
  });
}
