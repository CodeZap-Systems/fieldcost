import { SERVER_FALLBACK_USER_ID, normalizeUserId } from "./userIdentity";

export function resolveServerUserId(provided?: string | null) {
  return normalizeUserId(provided, SERVER_FALLBACK_USER_ID);
}
