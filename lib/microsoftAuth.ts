/**
 * Microsoft Azure / Entra ID SSO Configuration
 *
 * Tenant:  CodeZap Directory
 * Tenant ID: 373eea82-ea0c-408c-8c4b-7e9c83045ade
 * Domain:  codezap.co.za
 *
 * Setup steps:
 * 1. Go to Azure Portal → App registrations → New registration
 *    - Name: FieldCost
 *    - Supported account types: Accounts in this organizational directory only
 *      (CodeZap Directory – Single tenant)
 *    - Redirect URI (Web): https://<your-domain>/auth/callback
 * 2. Copy the Application (client) ID and add it to NEXT_PUBLIC_AZURE_CLIENT_ID
 * 3. In Supabase Dashboard → Authentication → Providers → Azure:
 *    - Enable Azure provider
 *    - Paste the Azure Client ID
 *    - Create a client secret in Azure (Certificates & secrets) and paste it here
 *    - Set the Azure Tenant URL to:
 *      https://login.microsoftonline.com/373eea82-ea0c-408c-8c4b-7e9c83045ade/v2.0
 *      (This locks auth to the CodeZap Directory only)
 */

export const AZURE_TENANT_ID =
  process.env.NEXT_PUBLIC_AZURE_TENANT_ID ?? '373eea82-ea0c-408c-8c4b-7e9c83045ade';

export const AZURE_TENANT_DOMAIN =
  process.env.NEXT_PUBLIC_AZURE_TENANT_DOMAIN ?? 'codezap.co.za';

export const AZURE_CLIENT_ID =
  process.env.NEXT_PUBLIC_AZURE_CLIENT_ID ?? '';

/** Tenant-specific Microsoft login authority */
export const AZURE_AUTHORITY =
  `https://login.microsoftonline.com/${AZURE_TENANT_ID}/v2.0`;

/**
 * Options to pass to supabase.auth.signInWithOAuth for Microsoft/Azure SSO.
 *
 * - `scopes`: request OpenID Connect + email + profile from Microsoft
 * - `queryParams.domain_hint`: skips the account picker and routes directly
 *   to the CodeZap organisational identity provider
 * - `queryParams.prompt`: 'select_account' lets users pick a Microsoft account
 *   if they have multiple (remove or set to 'none' to use the last session)
 */
export function getMicrosoftSSOOptions(redirectTo?: string) {
  return {
    scopes: 'openid profile email',
    redirectTo: redirectTo ?? undefined,
    queryParams: {
      domain_hint: AZURE_TENANT_DOMAIN,
      prompt: 'select_account',
    },
  };
}
