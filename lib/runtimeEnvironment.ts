/**
 * Runtime Environment Detection
 * Determines whether app is running in staging, production, or development
 */

export type EnvironmentType = "development" | "staging" | "production";

/**
 * Determine current runtime environment
 */
export function getRuntimeEnvironment(): EnvironmentType {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV;

  if (env === "staging") {
    return "staging";
  } else if (env === "production" || process.env.VERCEL_ENV === "production") {
    return "production";
  }

  return "development";
}

/**
 * Check if currently in staging environment
 */
export function isStagingEnvironment(): boolean {
  return getRuntimeEnvironment() === "staging";
}

/**
 * Check if currently in production environment
 */
export function isProductionEnvironment(): boolean {
  return getRuntimeEnvironment() === "production";
}

/**
 * Resolve Supabase configuration based on environment
 */
export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface SupabaseServerConfig {
  url: string;
  serviceRoleKey: string;
}

export function resolveSupabasePublicConfig(): SupabaseConfig {
  const env = getRuntimeEnvironment();

  if (env === "staging") {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING || "",
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING || "",
    };
  }

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  };
}

export function resolveSupabaseServerConfig(): SupabaseServerConfig {
  const env = getRuntimeEnvironment();

  if (env === "staging") {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING || "",
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY_STAGING || "",
    };
  }

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  };
}
