module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/supabaseClient.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://mukaeylwmzztycajibhy.supabase.co") || 'https://mukaeylwmzztycajibhy.supabase.co';
const supabaseAnonKey = ("TURBOPACK compile-time value", "sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg") || 'sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg';
// Configure storage for session persistence
const storage = {
    getItem: (key)=>{
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
    },
    setItem: (key, value)=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    },
    removeItem: (key)=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }
};
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        storage,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});
}),
"[project]/lib/supabaseServer.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabaseServer",
    ()=>supabaseServer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://mukaeylwmzztycajibhy.supabase.co") || "https://mukaeylwmzztycajibhy.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ("TURBOPACK compile-time value", "sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg") || "sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg";
const supabaseServer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        persistSession: false
    }
});
}),
"[project]/lib/userIdentity.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_DEMO_USER_ID",
    ()=>DEFAULT_DEMO_USER_ID,
    "DEMO_ADMIN_USER_ID",
    ()=>DEMO_ADMIN_USER_ID,
    "DEMO_SUBCONTRACTOR_USER_ID",
    ()=>DEMO_SUBCONTRACTOR_USER_ID,
    "SERVER_FALLBACK_USER_ID",
    ()=>SERVER_FALLBACK_USER_ID,
    "canUseDemoFixtures",
    ()=>canUseDemoFixtures,
    "isDemoUserId",
    ()=>isDemoUserId,
    "normalizeUserId",
    ()=>normalizeUserId
]);
const DEFAULT_ADMIN_UUID = "11111111-1111-1111-1111-111111111111";
const DEFAULT_SUBCONTRACTOR_UUID = "22222222-2222-2222-2222-222222222222";
// Consistent UUIDs generated from demoUserUUIDs.ts using UUID v5
const DEMO_USER_UUID = "e66081a8-af72-5722-8cce-e3a996196ad2";
const DEMO_LIVE_TEST_UUID = "55a13a79-7825-5e24-bd4b-11babbc6288c";
const DEMO_ADMIN_TEST_UUID = "e2ba61b5-99c6-51f2-868b-32a20082bd86";
const DEMO_DIAGNOSTIC_USER_UUID = "53c8c879-8f4f-5b96-b23f-93e50f2ac41c";
const sanitize = (value)=>value?.trim() || undefined;
const DEFAULT_DEMO_USER_ID = sanitize(process.env.NEXT_PUBLIC_DEMO_USER_ID) || DEFAULT_ADMIN_UUID;
const DEMO_ADMIN_USER_ID = sanitize(process.env.NEXT_PUBLIC_DEMO_ADMIN_USER_ID) || DEFAULT_DEMO_USER_ID;
const DEMO_SUBCONTRACTOR_USER_ID = sanitize(process.env.NEXT_PUBLIC_DEMO_SUBCONTRACTOR_USER_ID) || DEFAULT_SUBCONTRACTOR_UUID;
const DEMO_ALIAS_MAP = {
    demo: DEMO_USER_UUID,
    "demo-admin": DEMO_ADMIN_TEST_UUID,
    "demo-subcontractor": DEMO_SUBCONTRACTOR_USER_ID,
    "demo-live-test": DEMO_LIVE_TEST_UUID,
    "demo-diagnostic-user": DEMO_DIAGNOSTIC_USER_UUID
};
const DEMO_USER_IDS = new Set([
    DEFAULT_DEMO_USER_ID,
    DEMO_ADMIN_USER_ID,
    DEMO_SUBCONTRACTOR_USER_ID
].filter(Boolean));
const DEMO_FIXTURES_ENABLED = (process.env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES ?? "true").toLowerCase() === "true";
function resolveUserId(candidate) {
    const trimmed = candidate?.trim();
    if (!trimmed) return undefined;
    return DEMO_ALIAS_MAP[trimmed.toLowerCase()] || trimmed;
}
function normalizeUserId(candidate, fallback = DEFAULT_DEMO_USER_ID) {
    return resolveUserId(candidate) ?? fallback;
}
const SERVER_FALLBACK_USER_ID = normalizeUserId(process.env.DEMO_USER_ID, DEFAULT_DEMO_USER_ID);
function isDemoUserId(candidate) {
    const resolved = resolveUserId(candidate);
    if (!resolved) return false;
    return DEMO_USER_IDS.has(resolved);
}
function canUseDemoFixtures(candidate) {
    return DEMO_FIXTURES_ENABLED && isDemoUserId(candidate);
}
}),
"[project]/lib/serverUser.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resolveServerUserId",
    ()=>resolveServerUserId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/userIdentity.ts [app-route] (ecmascript)");
;
function resolveServerUserId(provided) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeUserId"])(provided, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SERVER_FALLBACK_USER_ID"]);
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/demoAuth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EnsureAuthUserError",
    ()=>EnsureAuthUserError,
    "ensureAuthUser",
    ()=>ensureAuthUser
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseServer.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/userIdentity.ts [app-route] (ecmascript)");
;
;
;
const DEMO_LABELS = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEMO_ADMIN_USER_ID"]]: "demo-admin",
    [__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEMO_SUBCONTRACTOR_USER_ID"]]: "demo-subcontractor"
};
function slugify(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "demo";
}
class EnsureAuthUserError extends Error {
    statusCode;
    constructor(message, statusCode = 500){
        super(message);
        this.statusCode = statusCode;
        this.name = "EnsureAuthUserError";
    }
}
async function ensureAuthUser(userId) {
    const normalized = userId?.trim();
    if (!normalized) {
        console.log('[ensureAuthUser] No user ID provided, returning undefined');
        return undefined;
    }
    // For demo users, skip auth verification if service role key is missing
    // Demo users are for testing only and don't require strict auth validation
    const isDemoUser = normalized === "demo" || normalized.startsWith("demo-");
    console.log(`[ensureAuthUser] Processing user: "${normalized}" (isDemoUser: ${isDemoUser})`);
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn(`[ensureAuthUser] Missing SUPABASE_SERVICE_ROLE_KEY (isDemoUser: ${isDemoUser})`);
        if (isDemoUser) {
            // For demo users, allow operation to proceed without auth verification
            console.warn(`[ensureAuthUser] Demo user "${normalized}" proceeding without auth verification`);
            return undefined;
        }
        // For real users, authentication is required
        const err = "Supabase service role key (SUPABASE_SERVICE_ROLE_KEY) is required. Add it to your environment variables.";
        console.error(`[ensureAuthUser] Error for non-demo user: ${err}`);
        throw new EnsureAuthUserError(err);
    }
    // Normalize user ID for Supabase (convert demo users to UUIDs)
    const supabaseUserId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeUserId"])(normalized);
    console.log(`[ensureAuthUser] Normalized user ID: "${normalized}" → "${supabaseUserId}"`);
    console.log(`[ensureAuthUser] Looking up auth user by ID: "${supabaseUserId}"`);
    const lookup = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].auth.admin.getUserById(supabaseUserId);
    if (lookup.data?.user) {
        console.log(`[ensureAuthUser] Found existing user: "${supabaseUserId}"`);
        return lookup.data.user;
    }
    if (lookup.error) {
        console.log(`[ensureAuthUser] Lookup error: ${lookup.error.message}`);
        if (!/user not found/i.test(lookup.error.message)) {
            const errMsg = `Unable to verify Supabase auth user: ${lookup.error.message}`;
            console.error(`[ensureAuthUser] ${errMsg}`);
            throw new EnsureAuthUserError(errMsg);
        }
    }
    const alias = DEMO_LABELS[normalized] || `demo-${normalized.slice(0, 8)}`;
    const email = `${slugify(alias)}@fieldcost.demo`;
    console.log(`[ensureAuthUser] Creating new demo user: "${normalized}" with UUID "${supabaseUserId}" (alias: "${alias}", email: "${email}")`);
    const created = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].auth.admin.createUser({
        id: supabaseUserId,
        email,
        email_confirm: true,
        password: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomUUID"])(),
        user_metadata: {
            label: alias,
            isDemo: true
        },
        app_metadata: {
            provider: "demo-seed"
        }
    });
    if (created.error) {
        const errMsg = `Unable to create demo auth user: ${created.error.message}`;
        console.error(`[ensureAuthUser] ${errMsg}`);
        throw new EnsureAuthUserError(errMsg);
    }
    console.log(`[ensureAuthUser] Successfully created user: "${supabaseUserId}"`);
    return created.data.user;
}
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[project]/lib/dataStore.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "readStore",
    ()=>readStore,
    "writeStore",
    ()=>writeStore
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
;
;
const DATA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), 'data');
async function ensureDir() {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].mkdir(DATA_DIR, {
        recursive: true
    });
}
async function getFilePath(fileName) {
    await ensureDir();
    return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(DATA_DIR, fileName);
}
async function readStore(fileName, fallback) {
    try {
        const filePath = await getFilePath(fileName);
        const payload = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].readFile(filePath, 'utf-8');
        return JSON.parse(payload);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return fallback;
        }
        throw error;
    }
}
async function writeStore(fileName, value) {
    const filePath = await getFilePath(fileName);
    await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"].writeFile(filePath, JSON.stringify(value, null, 2), 'utf-8');
}
}),
"[project]/lib/companyProfileStore.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getStoredCompanyProfile",
    ()=>getStoredCompanyProfile,
    "getStoredCompanyProfiles",
    ()=>getStoredCompanyProfiles,
    "replaceStoredCompanyProfiles",
    ()=>replaceStoredCompanyProfiles,
    "saveStoredCompanyProfile",
    ()=>saveStoredCompanyProfile,
    "setActiveStoredCompanyProfile",
    ()=>setActiveStoredCompanyProfile
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dataStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dataStore.ts [app-route] (ecmascript)");
;
;
const FILE_NAME = "company-profiles.json";
async function readAll() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dataStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readStore"])(FILE_NAME, {});
}
async function writeAll(store) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dataStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeStore"])(FILE_NAME, store);
}
function isStoreEntry(value) {
    return Boolean(value && typeof value === "object" && "profiles" in value && Array.isArray(value.profiles));
}
function normalizeStoredProfile(payload, userId) {
    return {
        id: typeof payload?.id === "string" && payload.id.trim().length ? payload.id : (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
        user_id: payload?.user_id ?? userId,
        name: payload?.name ?? "Untitled company",
        email: payload?.email ?? null,
        phone: payload?.phone ?? null,
        address_line1: payload?.address_line1 ?? null,
        address_line2: payload?.address_line2 ?? null,
        city: payload?.city ?? null,
        province: payload?.province ?? null,
        postal_code: payload?.postal_code ?? null,
        country: payload?.country ?? null,
        logo_url: payload?.logo_url ?? null,
        logo_external_url: payload?.logo_external_url ?? null,
        invoice_template: payload?.invoice_template ?? "standard",
        default_currency: payload?.default_currency ?? "ZAR",
        erp_targets: Array.isArray(payload?.erp_targets) ? payload.erp_targets.map((value)=>`${value}`.trim()).filter(Boolean) : [],
        reference: payload?.reference ?? null,
        updated_at: payload?.updated_at ?? new Date().toISOString()
    };
}
function upgradeEntry(value, userId) {
    if (isStoreEntry(value)) {
        const normalizedProfiles = value.profiles.map((profile)=>normalizeStoredProfile(profile, userId));
        const activeCandidate = value.activeCompanyId;
        const resolvedActive = activeCandidate && normalizedProfiles.some((profile)=>profile.id === activeCandidate) ? activeCandidate : normalizedProfiles[0]?.id ?? null;
        return {
            activeCompanyId: resolvedActive,
            profiles: normalizedProfiles
        };
    }
    if (value && typeof value === "object") {
        const normalized = normalizeStoredProfile(value, userId);
        return {
            activeCompanyId: normalized.id,
            profiles: [
                normalized
            ]
        };
    }
    return {
        activeCompanyId: null,
        profiles: []
    };
}
function ensureEntry(store, userId) {
    const existing = store[userId];
    if (isStoreEntry(existing)) {
        return existing;
    }
    if (existing) {
        const upgraded = upgradeEntry(existing, userId);
        store[userId] = upgraded;
        return upgraded;
    }
    const created = {
        activeCompanyId: null,
        profiles: []
    };
    store[userId] = created;
    return created;
}
async function getStoredCompanyProfile(userId) {
    const entry = await getStoredCompanyProfiles(userId);
    if (entry.activeCompanyId) {
        const active = entry.profiles.find((profile)=>profile.id === entry.activeCompanyId);
        if (active) return active;
    }
    return entry.profiles[0] ?? null;
}
async function getStoredCompanyProfiles(userId) {
    const store = await readAll();
    const entry = store[userId];
    if (isStoreEntry(entry)) {
        return entry;
    }
    if (entry) {
        const upgraded = upgradeEntry(entry, userId);
        store[userId] = upgraded;
        await writeAll(store);
        return upgraded;
    }
    return {
        activeCompanyId: null,
        profiles: []
    };
}
async function saveStoredCompanyProfile(profile, options = {}) {
    const store = await readAll();
    const entry = ensureEntry(store, profile.user_id);
    const idx = entry.profiles.findIndex((existing)=>existing.id === profile.id);
    if (idx >= 0) {
        entry.profiles[idx] = profile;
    } else {
        entry.profiles.push(profile);
    }
    if (options.setActive || !entry.activeCompanyId) {
        entry.activeCompanyId = profile.id;
    }
    await writeAll(store);
    return profile;
}
async function replaceStoredCompanyProfiles(userId, profiles, activeCompanyId) {
    const store = await readAll();
    store[userId] = {
        profiles,
        activeCompanyId: activeCompanyId ?? profiles[0]?.id ?? null
    };
    await writeAll(store);
    return store[userId];
}
async function setActiveStoredCompanyProfile(userId, companyId) {
    const store = await readAll();
    const entry = ensureEntry(store, userId);
    entry.activeCompanyId = companyId;
    await writeAll(store);
}
}),
"[project]/app/api/company/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseServer.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/serverUser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/demoAuth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/userIdentity.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/companyProfileStore.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
const TEMPLATE_OPTIONS = new Set([
    "standard",
    "detailed"
]);
const ERP_OPTIONS = new Set([
    "sage-bca-sa",
    "xero",
    "quickbooks"
]);
const sanitize = (value)=>{
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
};
async function resolveUserContext(req, provided) {
    // Try to get user from Authorization header first
    const authHeader = req.headers.get("authorization");
    let authUserId = null;
    if (authHeader?.startsWith("Bearer ")) {
        try {
            const token = authHeader.slice(7);
            const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].auth.getUser(token);
            if (data?.user?.id) {
                authUserId = data.user.id;
                console.log(`[resolveUserContext] ✅ Got authenticated user: ${authUserId}`);
                return {
                    userId: authUserId
                };
            }
        } catch (err) {
            console.warn("[resolveUserContext] ⚠️  Failed to get user from Authorization header:", err);
        }
    }
    // Fallback: Use provided or query parameter
    const { searchParams } = new URL(req.url);
    const fallback = provided ?? searchParams.get("user_id");
    const resolved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveServerUserId"])(fallback);
    console.warn(`[resolveUserContext] ⚠️  No auth header, using fallback user: ${resolved}`);
    return {
        userId: resolved
    };
}
function isMissingTableError(error) {
    return Boolean(error && typeof error === "object" && "code" in error && error.code === "PGRST205");
}
function coerceCompanyId(value) {
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.length) return trimmed;
    }
    return null;
}
function normalizeProfile(payload, userId) {
    const id = coerceCompanyId(payload?.id) ?? (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
    return {
        id,
        user_id: userId,
        name: payload?.name ?? "",
        email: payload?.email ?? null,
        phone: payload?.phone ?? null,
        address_line1: payload?.address_line1 ?? null,
        address_line2: payload?.address_line2 ?? null,
        city: payload?.city ?? null,
        province: payload?.province ?? null,
        postal_code: payload?.postal_code ?? null,
        country: payload?.country ?? null,
        logo_url: payload?.logo_url ?? null,
        logo_external_url: payload?.logo_external_url ?? null,
        invoice_template: payload?.invoice_template ?? "standard",
        default_currency: payload?.default_currency ?? "ZAR",
        erp_targets: Array.isArray(payload?.erp_targets) ? payload.erp_targets : [],
        updated_at: payload?.updated_at ?? new Date().toISOString(),
        is_demo: payload?.is_demo === true
    };
}
async function GET(req) {
    const url = new URL(req.url);
    const requestedCompanyId = coerceCompanyId(url.searchParams.get("company_id"));
    let userId;
    try {
        ({ userId } = await resolveUserContext(req));
        const isDemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDemoUserId"])(userId);
        // Get user's own companies
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from("company_profiles").select("*").eq("user_id", userId).order("updated_at", {
            ascending: false
        });
        if (error && !isMissingTableError(error)) {
            console.error("GET /api/company error", error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 500
            });
        }
        let list = Array.isArray(data) ? data : data ? [
            data
        ] : [];
        // CRITICAL: Only fetch demo companies for demo users (not authenticated users)
        let demoCompaniesData = [];
        if (isDemo) {
            try {
                const { data: demoCompanies, error: demoError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from("company_profiles").select("*").eq("is_demo", true).order("name", {
                    ascending: true
                });
                if (!demoError && Array.isArray(demoCompanies)) {
                    demoCompaniesData = demoCompanies;
                }
            } catch (err) {
                console.warn("[GET /api/company] Could not fetch demo companies:", err);
            }
        }
        // If user has no companies, create a default one using registered company name
        if (!list.length && !isDemo) {
            console.log(`Auto-creating default company for user ${userId}`);
            // Try to get registered company name from auth user metadata
            let registeredCompanyName = "My Company"; // Default fallback
            try {
                const { data: authData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
                if (authData?.user?.user_metadata?.companyName) {
                    registeredCompanyName = authData.user.user_metadata.companyName;
                }
            } catch (err) {
                console.warn("Could not fetch auth metadata for company name:", err);
            }
            const defaultCompany = normalizeProfile({
                id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
                user_id: userId,
                name: registeredCompanyName,
                email: null,
                invoice_template: "standard",
                default_currency: "ZAR"
            }, userId);
            const { data: created, error: createError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from("company_profiles").insert([
                defaultCompany
            ]).select().single();
            if (!createError && created) {
                const createdNormalized = normalizeProfile(created, userId);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["replaceStoredCompanyProfiles"])(userId, [
                    createdNormalized
                ], createdNormalized.id);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    company: createdNormalized,
                    companies: [
                        createdNormalized
                    ]
                });
            }
        }
        // Combine user's companies with demo companies ONLY for demo users
        const allCompanies = isDemo ? [
            ...list,
            ...demoCompaniesData
        ] : list;
        if (allCompanies.length) {
            const normalized = allCompanies.map((entry)=>normalizeProfile(entry, userId));
            console.log(`[GET /api/company] userId=${userId}, isDemo=${isDemo}, allCompanies=${JSON.stringify(normalized.map((c)=>({
                    id: c.id,
                    name: c.name,
                    is_demo: c.is_demo
                })))}`);
            // Separate owned companies from demo companies
            const ownedCompanies = normalized.filter((p)=>!p.is_demo);
            const demoCompanies = normalized.filter((p)=>p.is_demo === true);
            console.log(`[GET /api/company] ownedCompanies=${JSON.stringify(ownedCompanies.map((c)=>({
                    id: c.id,
                    name: c.name
                })))}, demoCompanies=${JSON.stringify(demoCompanies.map((c)=>({
                    id: c.id,
                    name: c.name
                })))}`);
            // CRITICAL: ALWAYS put owned (non-demo) companies FIRST for ALL users
            // This ensures live companies are preferred as default selection
            const validList = [
                ...ownedCompanies,
                ...demoCompanies
            ];
            const stored = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStoredCompanyProfiles"])(userId);
            // Get preferred company ID - but never default to demo company for authenticated users
            let preferredId = requestedCompanyId || stored.activeCompanyId || null;
            console.log(`[GET /api/company] requestedCompanyId=${requestedCompanyId}, stored.activeCompanyId=${stored.activeCompanyId}, preferredId=${preferredId}`);
            // For authenticated users, validate that preferred company is NOT a demo company
            if (!isDemo && preferredId) {
                const preferred = normalized.find((p)=>p.id === preferredId);
                if (preferred?.is_demo) {
                    // Ignore demo company preference for authenticated users
                    console.log(`[GET /api/company] Ignoring demo company preference for authenticated user`);
                    preferredId = null;
                }
            }
            const active = preferredId ? normalized.find((profile)=>profile.id === preferredId && (!isDemo ? !profile.is_demo : true)) ?? validList[0] : validList[0] ?? null;
            console.log(`[GET /api/company] FINAL SELECTION: active=${JSON.stringify({
                id: active?.id,
                name: active?.name,
                is_demo: active?.is_demo
            })}`);
            if (active) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["replaceStoredCompanyProfiles"])(userId, validList, active.id);
            } else {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["replaceStoredCompanyProfiles"])(userId, validList, null);
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                company: active ?? null,
                companies: validList
            });
        }
        // Fallback to localStorage
        const fallback = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStoredCompanyProfiles"])(userId);
        if (fallback.profiles.length) {
            const fallbackPreferredId = requestedCompanyId || fallback.activeCompanyId || null;
            // Remove demo companies from fallback for authenticated users
            const fallbackProfiles = isDemo ? fallback.profiles : fallback.profiles.filter((p)=>!p.is_demo);
            // Validate preferred company is not demo for authenticated users
            let validPreferredId = fallbackPreferredId;
            if (!isDemo && validPreferredId) {
                const preferred = fallbackProfiles.find((p)=>p.id === validPreferredId);
                if (!preferred?.id) {
                    validPreferredId = null;
                }
            }
            const fallbackActive = validPreferredId ? fallbackProfiles.find((profile)=>profile.id === validPreferredId) ?? fallbackProfiles[0] : fallbackProfiles[0] ?? null;
            if (fallbackActive) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setActiveStoredCompanyProfile"])(userId, fallbackActive.id);
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                company: fallbackActive ?? null,
                companies: fallbackProfiles
            });
        }
        // No companies anywhere - this shouldn't happen for non-demo users now
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            company: null,
            companies: []
        });
    } catch (err) {
        console.error("GET /api/company exception", err);
        if (isMissingTableError(err)) {
            const fallback = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStoredCompanyProfiles"])(userId);
            const fallbackPreferredId = url.searchParams.get("company_id") || fallback.activeCompanyId || fallback.profiles[0]?.id || null;
            const fallbackActive = fallbackPreferredId ? fallback.profiles.find((profile)=>profile.id === fallbackPreferredId) ?? fallback.profiles[0] : fallback.profiles[0] ?? null;
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                company: fallbackActive ?? null,
                companies: fallback.profiles
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unexpected error"
        }, {
            status: 500
        });
    }
}
async function PUT(req) {
    let body = null;
    try {
        body = await req.json();
        const { userId } = await resolveUserContext(req, typeof body?.user_id === 'string' ? body.user_id : null);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureAuthUser"])(userId);
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EnsureAuthUserError"]) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: error.message
                }, {
                    status: error.statusCode
                });
            }
            console.error("PUT /api/company ensureAuthUser error", error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unable to verify user context"
            }, {
                status: 500
            });
        }
        const name = sanitize(body?.name);
        if (!name) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Company name is required"
            }, {
                status: 400
            });
        }
        const erpTargets = Array.isArray(body?.erp_targets) ? body.erp_targets.map((value)=>`${value}`.trim().toLowerCase()).filter((value)=>ERP_OPTIONS.has(value)) : [];
        const invoiceTemplate = TEMPLATE_OPTIONS.has(`${body?.invoice_template}`.toLowerCase()) ? `${body.invoice_template}`.toLowerCase() : "standard";
        const payload = {
            user_id: userId,
            name,
            email: sanitize(body?.email),
            phone: sanitize(body?.phone),
            address_line1: sanitize(body?.address_line1),
            address_line2: sanitize(body?.address_line2),
            city: sanitize(body?.city),
            province: sanitize(body?.province),
            postal_code: sanitize(body?.postal_code),
            country: sanitize(body?.country) ?? "South Africa",
            logo_url: sanitize(body?.logo_url),
            logo_external_url: sanitize(body?.logo_external_url),
            invoice_template: invoiceTemplate,
            default_currency: sanitize(body?.default_currency)?.toUpperCase() ?? "ZAR",
            erp_targets: erpTargets,
            updated_at: new Date().toISOString()
        };
        const requestedCompanyId = coerceCompanyId(body?.id ?? body?.company_id);
        let savedProfile = null;
        let missingTable = false;
        if (requestedCompanyId) {
            const numericId = Number(requestedCompanyId);
            if (Number.isFinite(numericId)) {
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from("company_profiles").update(payload).eq("id", numericId).eq("user_id", userId).select("*").maybeSingle();
                if (error) {
                    if (isMissingTableError(error)) {
                        missingTable = true;
                    } else {
                        console.error("PUT /api/company error", error);
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                            error: error.message
                        }, {
                            status: 500
                        });
                    }
                } else if (data) {
                    savedProfile = normalizeProfile(data, userId);
                }
            }
        }
        if (!savedProfile && !missingTable) {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from("company_profiles").insert([
                payload
            ]).select("*").maybeSingle();
            if (error) {
                if (isMissingTableError(error)) {
                    missingTable = true;
                } else {
                    console.error("PUT /api/company insert error", error);
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: error.message
                    }, {
                        status: 500
                    });
                }
            } else if (data) {
                savedProfile = normalizeProfile(data, userId);
            }
        }
        if (missingTable || !savedProfile) {
            const fallbackProfile = normalizeProfile({
                ...payload,
                id: requestedCompanyId
            }, userId);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveStoredCompanyProfile"])(fallbackProfile, {
                setActive: true
            });
            const fallback = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStoredCompanyProfiles"])(userId);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                company: fallbackProfile,
                companies: fallback.profiles
            });
        }
        const { data: listData, error: listError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from("company_profiles").select("*").eq("user_id", userId).order("updated_at", {
            ascending: false
        });
        if (listError && !isMissingTableError(listError)) {
            console.error("PUT /api/company list error", listError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: listError.message
            }, {
                status: 500
            });
        }
        if (listError) {
            const fallback = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStoredCompanyProfiles"])(userId);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveStoredCompanyProfile"])(savedProfile, {
                setActive: true
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                company: savedProfile,
                companies: fallback.profiles
            });
        }
        const normalizedList = Array.isArray(listData) ? listData.map((entry)=>normalizeProfile(entry, userId)) : [];
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["replaceStoredCompanyProfiles"])(userId, normalizedList, savedProfile.id);
        if (userId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].auth.admin.updateUserById(userId, {
                user_metadata: {
                    companyOnboarded: true
                }
            }).catch((err)=>console.warn("/api/company metadata update", err?.message ?? err));
        }
        const activeResponse = normalizedList.find((profile)=>profile.id === savedProfile?.id) ?? savedProfile;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            company: activeResponse,
            companies: normalizedList
        });
    } catch (err) {
        console.error("PUT /api/company exception", err);
        if (isMissingTableError(err) && body) {
            const { userId } = await resolveUserContext(req, typeof body?.user_id === 'string' ? body.user_id : null);
            const fallbackPayload = normalizeProfile(body, userId);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveStoredCompanyProfile"])(fallbackPayload, {
                setActive: true
            });
            const fallback = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStoredCompanyProfiles"])(userId);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                company: fallbackPayload,
                companies: fallback.profiles
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unexpected error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3a5ffccb._.js.map