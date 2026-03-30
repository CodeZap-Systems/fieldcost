import axios from "axios";

// Set these with your actual Azure/Power BI values
const tenantId = process.env.PBI_TENANT_ID!;
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
  const res = await axios.post(url, params);
  return res.data.access_token;
}

export async function pushRowsToPowerBI({ datasetId, tableName, rows }: PushRowsParams) {
  const token = await getPowerBIAccessToken();
  const url = `https://api.powerbi.com/v1.0/myorg/groups/${groupId}/datasets/${datasetId}/tables/${tableName}/rows`;
  await axios.post(
    url,
    { rows },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}
