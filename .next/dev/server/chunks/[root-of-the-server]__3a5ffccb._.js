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
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
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
const sanitize = (value)=>value?.trim() || undefined;
const DEFAULT_DEMO_USER_ID = sanitize(process.env.NEXT_PUBLIC_DEMO_USER_ID) || DEFAULT_ADMIN_UUID;
const DEMO_ADMIN_USER_ID = sanitize(process.env.NEXT_PUBLIC_DEMO_ADMIN_USER_ID) || DEFAULT_DEMO_USER_ID;
const DEMO_SUBCONTRACTOR_USER_ID = sanitize(process.env.NEXT_PUBLIC_DEMO_SUBCONTRACTOR_USER_ID) || DEFAULT_SUBCONTRACTOR_UUID;
const DEMO_ALIAS_MAP = {
    demo: DEFAULT_DEMO_USER_ID,
    "demo-admin": DEMO_ADMIN_USER_ID,
    "demo-subcontractor": DEMO_SUBCONTRACTOR_USER_ID
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
    if (!normalized) return undefined;
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new EnsureAuthUserError("Supabase service role key (SUPABASE_SERVICE_ROLE_KEY) is required to seed demo accounts. Add it to your .env.local file.");
    }
    const lookup = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].auth.admin.getUserById(normalized);
    if (lookup.data?.user) return lookup.data.user;
    if (lookup.error && !/user not found/i.test(lookup.error.message)) {
        throw new EnsureAuthUserError(`Unable to verify Supabase auth user: ${lookup.error.message}`);
    }
    const alias = DEMO_LABELS[normalized] || `demo-${normalized.slice(0, 8)}`;
    const email = `${slugify(alias)}@fieldcost.demo`;
    const created = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].auth.admin.createUser({
        id: normalized,
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
        throw new EnsureAuthUserError(`Unable to create demo auth user: ${created.error.message}`);
    }
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/companyProfileStore.ts [app-route] (ecmascript)");
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
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
    if (error) {
        console.warn("/api/company supabase auth lookup warning", error.message);
    }
    const authUserId = data?.user?.id;
    if (authUserId) {
        return {
            userId: authUserId
        };
    }
    const { searchParams } = new URL(req.url);
    const fallback = provided ?? searchParams.get("user_id");
    return {
        userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveServerUserId"])(fallback)
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
        updated_at: payload?.updated_at ?? new Date().toISOString()
    };
}
async function GET(req) {
    const url = new URL(req.url);
    const requestedCompanyId = coerceCompanyId(url.searchParams.get("company_id"));
    let userId;
    try {
        ({ userId } = await resolveUserContext(req));
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
        const list = Array.isArray(data) ? data : data ? [
            data
        ] : [];
        if (list.length) {
            const normalized = list.map((entry)=>normalizeProfile(entry, userId));
            const stored = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStoredCompanyProfiles"])(userId);
            const preferredId = requestedCompanyId || stored.activeCompanyId || normalized[0]?.id || null;
            const active = preferredId ? normalized.find((profile)=>profile.id === preferredId) ?? normalized[0] : normalized[0] ?? null;
            if (active) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["replaceStoredCompanyProfiles"])(userId, normalized, active.id);
            } else {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["replaceStoredCompanyProfiles"])(userId, normalized, null);
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                company: active ?? null,
                companies: normalized
            });
        }
        const fallback = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStoredCompanyProfiles"])(userId);
        const fallbackPreferredId = requestedCompanyId || fallback.activeCompanyId || fallback.profiles[0]?.id || null;
        const fallbackActive = fallbackPreferredId ? fallback.profiles.find((profile)=>profile.id === fallbackPreferredId) ?? fallback.profiles[0] : fallback.profiles[0] ?? null;
        if (fallbackActive) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setActiveStoredCompanyProfile"])(userId, fallbackActive.id);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            company: fallbackActive ?? null,
            companies: fallback.profiles
        });
    } catch (err) {
        console.error("GET /api/company exception", err);
        if (isMissingTableError(err)) {
            const fallback = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyProfileStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStoredCompanyProfiles"])(userId);
            const fallbackPreferredId = requestedCompanyId || fallback.activeCompanyId || fallback.profiles[0]?.id || null;
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
        const { userId } = await resolveUserContext(req, body?.user_id);
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
            const { userId } = await resolveUserContext(req, body?.user_id);
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