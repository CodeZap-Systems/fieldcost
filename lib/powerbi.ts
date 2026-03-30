// Set these with your actual Azure/Power BI values
const tenantId = process.env.PBI_TENANT_ID!;
const clientId = process.env.PBI_CLIENT_ID!;
const clientSecret = process.env.PBI_CLIENT_SECRET!;
const groupId = process.env.PBI_GROUP_ID!; // Power BI workspace ID
type PushRowsParams = {
  datasetId: string;
  tableName: string;
  rows: any[];
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
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  if (!res.ok) throw new Error(`Failed to get Power BI token: ${res.statusText}`);
  const data = await res.json();
  return data.access_token;
}

export async function pushRowsToPowerBI({ datasetId, tableName, rows }: PushRowsParams) {
  const token = await getPowerBIAccessToken();
  const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/tables/${tableName}/rows`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rows }),
  });
  if (!res.ok) throw new Error(`Failed to push rows to Power BI: ${res.statusText}`);
}
