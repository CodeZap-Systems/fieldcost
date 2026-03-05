const DEFAULT_ADMIN_UUID = "11111111-1111-1111-1111-111111111111";
const DEFAULT_SUBCONTRACTOR_UUID = "22222222-2222-2222-2222-222222222222";

const sanitize = (value?: string | null) => value?.trim() || undefined;

export const DEFAULT_DEMO_USER_ID = sanitize(process.env.NEXT_PUBLIC_DEMO_USER_ID) || DEFAULT_ADMIN_UUID;
export const DEMO_ADMIN_USER_ID = sanitize(process.env.NEXT_PUBLIC_DEMO_ADMIN_USER_ID) || DEFAULT_DEMO_USER_ID;
export const DEMO_SUBCONTRACTOR_USER_ID = sanitize(process.env.NEXT_PUBLIC_DEMO_SUBCONTRACTOR_USER_ID) || DEFAULT_SUBCONTRACTOR_UUID;

const DEMO_ALIAS_MAP: Record<string, string> = {
	demo: DEFAULT_DEMO_USER_ID,
	"demo-admin": DEMO_ADMIN_USER_ID,
	"demo-subcontractor": DEMO_SUBCONTRACTOR_USER_ID,
};

const DEMO_USER_IDS = new Set([DEFAULT_DEMO_USER_ID, DEMO_ADMIN_USER_ID, DEMO_SUBCONTRACTOR_USER_ID].filter(Boolean));
const DEMO_FIXTURES_ENABLED = (process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES ?? "true").toLowerCase() === "true";

function resolveUserId(candidate?: string | null) {
	const trimmed = candidate?.trim();
	if (!trimmed) return undefined;
	return DEMO_ALIAS_MAP[trimmed.toLowerCase()] || trimmed;
}

export function normalizeUserId(candidate?: string | null, fallback = DEFAULT_DEMO_USER_ID) {
	return resolveUserId(candidate) ?? fallback;
}

export const SERVER_FALLBACK_USER_ID = normalizeUserId(process.env.DEMO_USER_ID, DEFAULT_DEMO_USER_ID);

export function isDemoUserId(candidate?: string | null) {
	const resolved = resolveUserId(candidate);
	if (!resolved) return false;
	return DEMO_USER_IDS.has(resolved);
}

export function canUseDemoFixtures(candidate?: string | null) {
	return DEMO_FIXTURES_ENABLED && isDemoUserId(candidate);
}
