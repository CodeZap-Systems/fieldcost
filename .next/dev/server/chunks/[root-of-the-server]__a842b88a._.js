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
"[project]/lib/companyContext.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCompanyContext",
    ()=>getCompanyContext,
    "validateCompanyOwnership",
    ()=>validateCompanyOwnership,
    "withCompanyScope",
    ()=>withCompanyScope
]);
/**
 * Company Context Helper
 * 
 * Provides utilities to scope all API operations to a specific company
 * This ensures complete data isolation per company (like Sage One)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseServer.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/userIdentity.ts [app-route] (ecmascript)");
;
;
async function getCompanyContext(userId, companyId) {
    if (!userId) {
        console.error('[getCompanyContext] No user ID provided');
        throw new Error('User ID required');
    }
    // Normalize user ID for Supabase (convert demo users to UUIDs)
    const normalizedUserId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeUserId"])(userId);
    console.log(`[getCompanyContext] Normalized user: "${userId}" → "${normalizedUserId}", companyId: ${companyId || 'not specified'}`);
    let resolvedCompanyId;
    if (companyId) {
        // Validate company ownership
        console.log(`[getCompanyContext] Validating company ownership for user "${normalizedUserId}" and company "${companyId}"`);
        resolvedCompanyId = typeof companyId === 'string' ? parseInt(companyId, 10) : companyId;
        const { data: company, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('company_profiles').select('id, is_demo, user_id').eq('id', resolvedCompanyId).single();
        if (error || !company) {
            const errMsg = `Company ${companyId} not found for user "${normalizedUserId}"`;
            console.error(`[getCompanyContext] ❌ ${errMsg} (error: ${error?.message || 'no match found'})`);
            throw new Error(errMsg);
        }
        // CRITICAL: Allow access if:
        // 1. User owns the company (user_id matches), OR
        // 2. Company is a demo company (is_demo=true) - all users can access
        const isOwner = company.user_id === normalizedUserId;
        const isDemoCompany = company.is_demo === true;
        if (!isOwner && !isDemoCompany) {
            const errMsg = `Company ${companyId} not found or access denied for user "${normalizedUserId}"`;
            console.error(`[getCompanyContext] ❌ ${errMsg} (not owner and not demo)`);
            throw new Error(errMsg);
        }
        console.log(`[getCompanyContext] ✅ Company ${resolvedCompanyId} validated for user "${normalizedUserId}" (owner=${isOwner}, demo=${isDemoCompany})`);
    } else {
        // Get the first company if not specified (or could use localStorage activeCompanyId)
        console.log(`[getCompanyContext] Looking up company for user "${normalizedUserId}"...`);
        const { data: company, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('company_profiles').select('id').eq('user_id', normalizedUserId).order('created_at', {
            ascending: true
        }).limit(1).single();
        if (!error && company) {
            resolvedCompanyId = company.id;
            console.log(`[getCompanyContext] ✅ Found existing company ${resolvedCompanyId} for user "${normalizedUserId}"`);
        } else {
            console.log(`[getCompanyContext] ⚠️  No existing company found (error: ${error?.message || 'not found'}), attempting to create...`);
            // Create a default company for users who don't have one yet
            const { data: newCompany, error: createError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('company_profiles').insert([
                {
                    user_id: normalizedUserId,
                    name: `${userId}'s Company`,
                    default_currency: 'ZAR'
                }
            ]).select('id').single();
            if (createError || !newCompany) {
                const errMsg = `Unable to find or create company for user "${normalizedUserId}": ${createError?.message || 'Unknown error'}`;
                console.error(`[getCompanyContext] ❌ ${errMsg}`);
                throw new Error(errMsg);
            }
            resolvedCompanyId = newCompany.id;
            console.log(`[getCompanyContext] ✅ Created new company ${resolvedCompanyId} for user "${normalizedUserId}"`);
        }
    }
    console.log(`[getCompanyContext] ✅ Returning context: userId="${normalizedUserId}", companyId=${resolvedCompanyId}`);
    return {
        userId: normalizedUserId,
        companyId: resolvedCompanyId
    };
}
async function validateCompanyOwnership(userId, companyId) {
    const normalizedUserId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeUserId"])(userId);
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('company_profiles').select('id', {
        count: 'exact',
        head: true
    }).eq('id', companyId).eq('user_id', normalizedUserId).single();
    return !error && !!data;
}
function withCompanyScope(query, companyId) {
    return query.eq('company_id', companyId);
}
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
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
"[project]/lib/invoiceStore.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildStoredInvoiceLine",
    ()=>buildStoredInvoiceLine,
    "deleteStoredInvoice",
    ()=>deleteStoredInvoice,
    "getStoredInvoice",
    ()=>getStoredInvoice,
    "getStoredInvoices",
    ()=>getStoredInvoices,
    "listPendingInvoices",
    ()=>listPendingInvoices,
    "markInvoiceSynced",
    ()=>markInvoiceSynced,
    "pruneStoredInvoices",
    ()=>pruneStoredInvoices,
    "recordInvoiceSyncFailure",
    ()=>recordInvoiceSyncFailure,
    "saveStoredInvoice",
    ()=>saveStoredInvoice,
    "storedInvoiceToApi",
    ()=>storedInvoiceToApi,
    "updateStoredInvoice",
    ()=>updateStoredInvoice
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dataStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dataStore.ts [app-route] (ecmascript)");
;
;
const FILE_NAME = "invoices.json";
const DEFAULT_RETENTION_DAYS = 30;
const MAX_SYNC_ATTEMPTS = 5;
function calculateChecksum(input) {
    const hash = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256");
    hash.update(JSON.stringify({
        customer_id: input.customer_id,
        amount: input.amount,
        description: input.description,
        reference: input.reference,
        invoice_number: input.invoice_number,
        issued_on: input.issued_on,
        due_on: input.due_on,
        status: input.status,
        currency: input.currency,
        lines: input.line_items.map((line)=>({
                item_id: line.item_id,
                name: line.name,
                quantity: line.quantity,
                rate: line.rate,
                total: line.total,
                project: line.project,
                note: line.note,
                source: line.source,
                task_ref: line.task_ref
            }))
    }));
    return hash.digest("hex");
}
function isOlderThan(dateIso, days) {
    const timestamp = Date.parse(dateIso);
    if (Number.isNaN(timestamp)) return false;
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    return timestamp < threshold;
}
async function readAll() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dataStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readStore"])(FILE_NAME, {});
}
async function writeAll(store) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dataStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeStore"])(FILE_NAME, store);
}
function ensureEntry(store, userId) {
    if (!store[userId]) {
        store[userId] = [];
    }
    return store[userId];
}
function generateOfflineInvoiceId() {
    return -Math.floor(Date.now() + Math.random() * 1000);
}
async function getStoredInvoices(userId) {
    await pruneStoredInvoices({
        userId
    });
    const store = await readAll();
    return store[userId] ?? [];
}
async function getStoredInvoice(userId, invoiceId) {
    const store = await readAll();
    return store[userId]?.find((inv)=>inv.id === invoiceId) ?? null;
}
async function listPendingInvoices(userId) {
    const store = await readAll();
    return (store[userId] ?? []).filter((inv)=>inv.pending_sync);
}
async function saveStoredInvoice(userId, invoice) {
    const store = await readAll();
    const entry = ensureEntry(store, userId);
    const timestamp = new Date().toISOString();
    const id = typeof invoice.id === "number" ? invoice.id : generateOfflineInvoiceId();
    const base = {
        id,
        user_id: userId,
        created_at: timestamp,
        updated_at: timestamp,
        customer_id: invoice.customer_id ?? null,
        customer_name: invoice.customer_name ?? null,
        amount: invoice.amount,
        description: invoice.description ?? null,
        reference: invoice.reference ?? null,
        invoice_number: invoice.invoice_number,
        issued_on: invoice.issued_on ?? null,
        due_on: invoice.due_on ?? null,
        status: invoice.status,
        currency: invoice.currency ?? null,
        line_items: invoice.line_items,
        pending_sync: invoice.pending_sync ?? true,
        checksum: "",
        sync_attempts: 0,
        last_sync_error: null,
        synced_at: null
    };
    const checksum = calculateChecksum(base);
    const record = {
        ...base,
        checksum
    };
    const existingIndex = entry.findIndex((inv)=>inv.id === id);
    if (existingIndex >= 0) {
        record.created_at = entry[existingIndex].created_at;
        record.sync_attempts = invoice.pending_sync === false ? entry[existingIndex].sync_attempts : 0;
        entry[existingIndex] = record;
    } else {
        entry.push(record);
    }
    await writeAll(store);
    return record;
}
async function updateStoredInvoice(userId, invoiceId, updates) {
    const store = await readAll();
    const entry = store[userId];
    if (!entry) return null;
    const index = entry.findIndex((inv)=>inv.id === invoiceId);
    if (index < 0) return null;
    const existing = entry[index];
    const next = {
        ...existing,
        amount: updates.amount ?? existing.amount,
        description: updates.description ?? existing.description,
        reference: updates.reference ?? existing.reference,
        invoice_number: updates.invoice_number ?? existing.invoice_number,
        issued_on: updates.issued_on ?? existing.issued_on,
        due_on: updates.due_on ?? existing.due_on,
        status: updates.status ?? existing.status,
        currency: updates.currency ?? existing.currency,
        customer_id: updates.customer_id ?? existing.customer_id,
        customer_name: updates.customer_name ?? existing.customer_name,
        line_items: updates.line_items ?? existing.line_items,
        pending_sync: updates.pending_sync ?? existing.pending_sync,
        sync_attempts: updates.sync_attempts ?? existing.sync_attempts,
        last_sync_error: updates.last_sync_error ?? existing.last_sync_error,
        synced_at: updates.synced_at ?? existing.synced_at,
        updated_at: new Date().toISOString()
    };
    next.checksum = calculateChecksum(next);
    entry[index] = next;
    await writeAll(store);
    return next;
}
async function markInvoiceSynced(userId, invoiceId) {
    return updateStoredInvoice(userId, invoiceId, {
        pending_sync: false,
        synced_at: new Date().toISOString(),
        last_sync_error: null,
        sync_attempts: 0
    });
}
async function recordInvoiceSyncFailure(userId, invoiceId, message) {
    const current = await getStoredInvoice(userId, invoiceId);
    if (!current) return null;
    const attempts = Math.min(MAX_SYNC_ATTEMPTS, current.sync_attempts + 1);
    return updateStoredInvoice(userId, invoiceId, {
        sync_attempts: attempts,
        last_sync_error: message,
        pending_sync: attempts < MAX_SYNC_ATTEMPTS
    });
}
async function deleteStoredInvoice(userId, invoiceId) {
    const store = await readAll();
    if (!store[userId]) return false;
    const originalLength = store[userId].length;
    store[userId] = store[userId].filter((inv)=>inv.id !== invoiceId);
    if (store[userId].length === originalLength) return false;
    await writeAll(store);
    return true;
}
async function pruneStoredInvoices(options) {
    const { userId, retentionDays = DEFAULT_RETENTION_DAYS } = options ?? {};
    const store = await readAll();
    let dirty = false;
    const pruneEntry = (key)=>{
        if (!store[key]) return;
        const originalLength = store[key].length;
        store[key] = store[key].filter((record)=>record.pending_sync || !isOlderThan(record.updated_at, retentionDays));
        if (store[key].length !== originalLength) {
            dirty = true;
        }
    };
    if (userId) {
        pruneEntry(userId);
    } else {
        Object.keys(store).forEach(pruneEntry);
    }
    if (dirty) {
        await writeAll(store);
    }
}
function storedInvoiceToApi(invoice) {
    return {
        id: invoice.id,
        amount: invoice.amount,
        description: invoice.description,
        reference: invoice.reference,
        invoice_number: invoice.invoice_number,
        issued_on: invoice.issued_on,
        due_on: invoice.due_on,
        status: invoice.status,
        currency: invoice.currency,
        customer_id: invoice.customer_id,
        customer: invoice.customer_id ? {
            id: invoice.customer_id,
            name: invoice.customer_name ?? "Customer"
        } : null,
        user_id: invoice.user_id,
        line_items: invoice.line_items,
        offline: true,
        pending_sync: invoice.pending_sync,
        sync_attempts: invoice.sync_attempts,
        last_sync_error: invoice.last_sync_error
    };
}
function buildStoredInvoiceLine(line) {
    return {
        id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
        item_id: line.item_id,
        name: line.name,
        quantity: line.quantity,
        rate: line.rate,
        total: line.total,
        project: line.project,
        note: line.note,
        source: line.source,
        task_ref: line.task_ref
    };
}
}),
"[project]/lib/invoicePermissions.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canMutateInvoices",
    ()=>canMutateInvoices
]);
const canMutateInvoices = (role)=>{
    if (!role) return true;
    return role === "admin" || role === "demo" || role === "subcontractor";
};
}),
"[project]/lib/invoiceValidation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateInvoiceNumber",
    ()=>generateInvoiceNumber,
    "normalizeDateInput",
    ()=>normalizeDateInput,
    "normalizeStatus",
    ()=>normalizeStatus,
    "prepareLineItems",
    ()=>prepareLineItems,
    "sanitize",
    ()=>sanitize,
    "sanitizeCurrency",
    ()=>sanitizeCurrency
]);
const VALID_STATUSES = new Set([
    "draft",
    "sent",
    "paid",
    "overdue"
]);
const sanitize = (value)=>{
    if (typeof value !== "string") return "";
    return value.trim();
};
const normalizeDateInput = (value)=>{
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toISOString().slice(0, 10);
};
const sanitizeCurrency = (value)=>{
    const trimmed = sanitize(value).toUpperCase();
    return trimmed.length === 3 ? trimmed : "ZAR";
};
const normalizeStatus = (value)=>{
    const status = sanitize(value).toLowerCase();
    return VALID_STATUSES.has(status) ? status : "sent";
};
function prepareLineItems(lines, userId) {
    if (!Array.isArray(lines)) return {
        lines: [],
        total: 0
    };
    const normalized = [];
    for (const raw of lines){
        if (!raw) continue;
        const quantity = Number(raw.quantity ?? raw["qty"]);
        const rate = Number(raw.rate);
        if (!(Number.isFinite(quantity) && quantity > 0)) continue;
        const safeRate = Number.isFinite(rate) ? rate : 0;
        const itemId = raw.itemId ?? raw.item_id;
        const lineName = sanitize(raw.name) || sanitize(raw.itemName);
        if (!lineName) continue;
        const total = Number.isFinite(Number(raw.total)) ? Number(raw.total) : Number((quantity * safeRate).toFixed(2));
        let parsedItemId = null;
        if (typeof itemId === "number" && Number.isFinite(itemId)) {
            parsedItemId = itemId;
        } else if (typeof itemId === "string" && itemId.trim()) {
            const numeric = Number(itemId);
            if (Number.isFinite(numeric)) parsedItemId = numeric;
        }
        normalized.push({
            item_id: parsedItemId,
            name: lineName,
            quantity,
            rate: safeRate,
            total,
            project: sanitize(raw.project) || null,
            note: sanitize(raw.note) || null,
            source: sanitize(raw.source) || null,
            task_ref: sanitize(raw.taskRef ?? raw.task_ref) || null,
            user_id: userId
        });
    }
    const total = normalized.reduce((sum, line)=>sum + line.total, 0);
    return {
        lines: normalized,
        total
    };
}
const generateInvoiceNumber = (userId)=>{
    const suffix = userId.replace(/-/g, "").slice(0, 4).toUpperCase() || "0000";
    const stamp = Date.now().toString(36).toUpperCase();
    return `FC-${suffix}-${stamp}`;
};
}),
"[project]/lib/supabaseErrors.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SCHEMA_MISSING_CODES",
    ()=>SCHEMA_MISSING_CODES,
    "describeSchemaError",
    ()=>describeSchemaError,
    "isSchemaCacheError",
    ()=>isSchemaCacheError
]);
const SCHEMA_MISSING_CODES = new Set([
    "PGRST204",
    "PGRST205"
]);
function isSchemaCacheError(error) {
    if (!error || typeof error !== "object" || !("code" in error)) return false;
    const code = error.code;
    return typeof code === "string" && SCHEMA_MISSING_CODES.has(code);
}
function describeSchemaError(error) {
    if (!isSchemaCacheError(error)) return null;
    const code = error.code;
    switch(code){
        case "PGRST204":
            return "PostgREST cache not refreshed for new column";
        case "PGRST205":
            return "PostgREST cache missing table definition";
        default:
            return "PostgREST schema cache error";
    }
}
;
}),
"[project]/app/api/invoices/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseServer.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/serverUser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/demoAuth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyContext$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/companyContext.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/invoiceStore.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoicePermissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/invoicePermissions.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/invoiceValidation.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseErrors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseErrors.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
const INVOICE_SELECT = '*, customer:customers(id, name, email)';
// Get authenticated user with fallback to demo user
async function resolveUserContext(req) {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        try {
            const token = authHeader.slice(7);
            const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].auth.getUser(token);
            if (data?.user?.id) {
                return data.user.id;
            }
        } catch (err) {
            console.warn('[resolveUserContext] Failed to get user from auth header:', err);
        }
    }
    const { searchParams } = new URL(req.url);
    const fallback = searchParams.get('user_id');
    const resolved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveServerUserId"])(fallback);
    console.warn(`[resolveUserContext] Using fallback user: ${resolved}`);
    return resolved;
}
async function attachInvoiceLines(rows, userId) {
    if (!rows?.length) return rows;
    const invoiceIds = rows.map((row)=>row.id).filter((id)=>typeof id === 'number');
    if (!invoiceIds.length) return rows;
    const fromFn = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"]?.from;
    if (typeof fromFn !== 'function') {
        console.warn('attachInvoiceLines skipped: supabaseServer.from unavailable');
        return rows;
    }
    const client = fromFn.call(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"], 'invoice_line_items');
    if (!client || typeof client.select !== 'function') {
        console.warn('attachInvoiceLines skipped: select builder unavailable');
        return rows;
    }
    let query;
    try {
        query = client.select('*').in('invoice_id', invoiceIds);
        if (userId && query && typeof query.eq === 'function') {
            query = query.eq('user_id', userId);
        }
    } catch (builderError) {
        console.warn('attachInvoiceLines builder error', builderError);
        return rows;
    }
    if (!query || typeof query.then !== 'function') {
        console.warn('attachInvoiceLines skipped: query is not awaitable');
        return rows;
    }
    const { data, error } = await query;
    if (error) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseErrors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSchemaCacheError"])(error)) {
            console.error('attachInvoiceLines error:', error);
        }
        return rows;
    }
    if (!Array.isArray(data)) {
        return rows;
    }
    const grouped = data.reduce((acc, line)=>{
        const invoiceId = typeof line.invoice_id === 'number' ? line.invoice_id : null;
        if (invoiceId === null) return acc;
        if (!acc[invoiceId]) acc[invoiceId] = [];
        acc[invoiceId].push(line);
        return acc;
    }, {});
    return rows.map((row)=>typeof row.id === 'number' ? {
            ...row,
            line_items: grouped[row.id] ?? []
        } : {
            ...row
        });
}
async function resolveCustomerId(userId, idPayload) {
    const rawId = idPayload.customer_id ?? idPayload.customerId;
    if (rawId !== undefined && rawId !== null && rawId !== '') {
        const parsed = Number(rawId);
        if (Number.isFinite(parsed) && parsed > 0) {
            return parsed;
        }
        return null;
    }
    if (idPayload.customer) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('customers').select('id').eq('user_id', userId).eq('name', idPayload.customer).maybeSingle();
        if (error) {
            console.error('resolveCustomerId lookup error:', error);
            return null;
        }
        return data?.id ?? null;
    }
    return null;
}
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        // Get authenticated user with fallback
        let userId = await resolveUserContext(req);
        const companyIdParam = searchParams.get('company_id');
        // CRITICAL: Require company_id for data isolation - prevent demo/live data mixing
        if (!companyIdParam || !companyIdParam.trim()) {
            console.warn(`[SECURITY] GET /api/invoices: Missing company_id for user ${userId}`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'company_id parameter is required for data isolation'
            }, {
                status: 400
            });
        }
        // Convert company_id: try as integer first, fallback to string (for demo IDs like "demo-company-id")
        const trimmed = companyIdParam.trim();
        const asInt = parseInt(trimmed, 10);
        let companyId = Number.isFinite(asInt) ? asInt : trimmed;
        // Fall back to demo user for testing if no userId provided
        if (!userId) {
            userId = 'demo-user'; // Test/demo fallback
        }
        const stored = userId ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStoredInvoices"])(userId) : [];
        const query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoices').select(INVOICE_SELECT).order('id', {
            ascending: false
        });
        // CRITICAL: Always filter by company_id
        console.log(`[GET /api/invoices] Fetching invoices for company_id=${companyId}`);
        // Try to check if this is a demo company
        let finalQuery = query;
        try {
            const { data: company } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('company_profiles').select('is_demo').eq('id', companyId).maybeSingle();
            const isDemoCompany = company?.is_demo === true;
            if (isDemoCompany) {
                // Demo company: filter ONLY by company_id (not user_id)
                console.log(`[GET /api/invoices] Demo company detected, filtering by company_id only`);
                finalQuery = finalQuery.eq('company_id', companyId);
            } else {
                // Live company: filter by BOTH user_id AND company_id
                console.log(`[GET /api/invoices] Live company, filtering by user_id AND company_id`);
                if (userId && userId !== 'demo-user') {
                    finalQuery = finalQuery.eq('user_id', userId).eq('company_id', companyId);
                } else {
                    finalQuery = finalQuery.eq('company_id', companyId);
                }
            }
        } catch (err) {
            console.warn(`[GET /api/invoices] Could not determine company type, filtering by company_id only: ${err.message}`);
            finalQuery = finalQuery.eq('company_id', companyId);
        }
        const { data, error } = await finalQuery;
        if (error) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseErrors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSchemaCacheError"])(error)) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(stored.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storedInvoiceToApi"]));
            }
            console.error('GET /api/invoices error:', error);
            // Return empty array with company_id instead of error
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([]);
        }
        const hydrated = await attachInvoiceLines(data ?? [], userId);
        // Ensure company_id is in response
        const withCompanyId = (hydrated || []).map((inv)=>({
                ...inv,
                company_id: inv.company_id || companyId
            }));
        const offline = stored.map(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storedInvoiceToApi"]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([
            ...withCompanyId,
            ...offline
        ]);
    } catch (err) {
        console.error('GET /api/invoices exception:', err);
        // Return empty array instead of error for testing
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([]);
    }
}
async function persistOfflineInvoice(options) {
    const { userId, customerId, customerName, payload, lines } = options;
    const storedLines = normalizedToStoredLines(lines);
    const record = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveStoredInvoice"])(userId, {
        customer_id: customerId,
        customer_name: customerName,
        amount: payload.amount,
        description: payload.description,
        reference: payload.reference,
        invoice_number: payload.invoice_number,
        issued_on: payload.issued_on,
        due_on: payload.due_on,
        status: payload.status,
        currency: payload.currency,
        line_items: storedLines
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storedInvoiceToApi"])(record);
}
function normalizedToStoredLines(lines) {
    return lines.map((line)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildStoredInvoiceLine"])({
            item_id: line.item_id,
            name: line.name,
            quantity: line.quantity,
            rate: line.rate,
            total: line.total,
            project: line.project,
            note: line.note,
            source: line.source,
            task_ref: line.task_ref
        }));
}
function storedLinesToNormalized(userId, lines) {
    return lines.map((line)=>({
            item_id: typeof line.item_id === 'number' ? line.item_id : null,
            name: line.name,
            quantity: line.quantity,
            rate: line.rate,
            total: line.total,
            project: line.project,
            note: line.note,
            source: line.source,
            task_ref: line.task_ref,
            user_id: userId
        }));
}
async function POST(req) {
    try {
        const body = await req.json();
        // Get authenticated user with fallback
        const userId = await resolveUserContext(req);
        let companyId = body.company_id;
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
            console.error('POST /api/invoices ensureAuthUser error:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unable to prepare user context'
            }, {
                status: 500
            });
        }
        // Try to get valid company context
        try {
            const { companyId: validCompanyId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyContext$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCompanyContext"])(userId, companyId);
            companyId = validCompanyId;
        } catch (e) {
            console.warn('Company context error, using default:', e);
            companyId = 1;
        }
        const customerId = await resolveCustomerId(userId, body);
        if (!customerId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Customer selection is required to create an invoice.'
            }, {
                status: 400
            });
        }
        const customerName = typeof body.customer_name === 'string' ? body.customer_name : null;
        const reference = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitize"])(body.reference);
        const issuedOn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeDateInput"])(body.issued_on) ?? new Date().toISOString().slice(0, 10);
        const dueOn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeDateInput"])(body.due_on);
        const status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeStatus"])(body.status);
        const currency = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeCurrency"])(body.currency);
        const { lines, total: lineTotal } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prepareLineItems"])(body.lines, userId);
        if (!lines.length) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'At least one invoice line item is required.'
            }, {
                status: 400
            });
        }
        const computedAmount = lineTotal || Number(body.amount) || 0;
        const payload = {
            customer_id: customerId,
            amount: computedAmount,
            description: body.description ?? null,
            reference: reference || null,
            invoice_number: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitize"])(body.invoice_number) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateInvoiceNumber"])(userId),
            issued_on: issuedOn,
            due_on: dueOn,
            status,
            currency,
            user_id: userId,
            ...companyId !== undefined && {
                company_id: companyId
            }
        };
        const offlinePayload = {
            amount: payload.amount,
            description: payload.description,
            reference: payload.reference,
            invoice_number: payload.invoice_number,
            issued_on: payload.issued_on,
            due_on: payload.due_on,
            status: payload.status,
            currency: payload.currency
        };
        const inserted = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoices').insert([
            payload
        ]).select('*');
        if (inserted.error) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseErrors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSchemaCacheError"])(inserted.error)) {
                const offlineResponse = await persistOfflineInvoice({
                    userId,
                    customerId,
                    customerName,
                    payload: offlinePayload,
                    lines
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(offlineResponse);
            }
            // If company_id causes error, try without it
            if (inserted.error.message?.includes('company_id')) {
                const simplePayload = {
                    ...payload
                };
                delete simplePayload.company_id;
                const { data: simpleData, error: simpleError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoices').insert([
                    simplePayload
                ]).select('*');
                if (simpleError) {
                    console.error('POST /api/invoices error:', simpleError);
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: simpleError.message
                    }, {
                        status: 500
                    });
                }
                const invoice = simpleData?.[0];
                if (!invoice) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'Invoice not created'
                    }, {
                        status: 500
                    });
                }
                const linePayload = lines.map((line)=>({
                        ...line,
                        invoice_id: invoice.id,
                        ...companyId !== undefined && {
                            company_id: companyId
                        }
                    }));
                const { error: lineError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoice_line_items').insert(linePayload);
                if (lineError) {
                    if (!lineError.message?.includes('company_id')) {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoices').delete().eq('id', invoice.id);
                        console.error('POST /api/invoices line insert error:', lineError);
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                            error: 'Invoice lines could not be stored'
                        }, {
                            status: 500
                        });
                    } else {
                        // Try without company_id
                        const simpleLinePayload = lines.map((line)=>({
                                ...line,
                                invoice_id: invoice.id
                            }));
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoice_line_items').insert(simpleLinePayload);
                    }
                }
                const { data: responseData, error: responseError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoices').select(INVOICE_SELECT).eq('id', invoice.id).maybeSingle();
                if (responseError) {
                    console.error('POST /api/invoices error:', responseError);
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: responseError.message
                    }, {
                        status: 500
                    });
                }
                const [hydrated] = await attachInvoiceLines(responseData ? [
                    responseData
                ] : [], userId);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(hydrated ?? responseData);
            }
            console.error('POST /api/invoices error:', inserted.error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: inserted.error.message
            }, {
                status: 500
            });
        }
        const invoice = inserted.data?.[0];
        if (!invoice) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invoice not created'
            }, {
                status: 500
            });
        }
        const linePayload = lines.map((line)=>({
                ...line,
                invoice_id: invoice.id,
                ...companyId !== undefined && {
                    company_id: companyId
                }
            }));
        const { error: lineError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoice_line_items').insert(linePayload);
        if (lineError) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseErrors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSchemaCacheError"])(lineError)) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoices').delete().eq('id', invoice.id);
                const offlineResponse = await persistOfflineInvoice({
                    userId,
                    customerId,
                    customerName,
                    payload: offlinePayload,
                    lines
                });
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(offlineResponse);
            }
            console.error('POST /api/invoices line insert error:', lineError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invoice lines could not be stored'
            }, {
                status: 500
            });
        }
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoices').select(INVOICE_SELECT).eq('id', invoice.id).maybeSingle();
        if (error) {
            console.error('POST /api/invoices error:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 500
            });
        }
        const [hydrated] = await attachInvoiceLines(data ? [
            data
        ] : [], userId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(hydrated ?? data);
    } catch (err) {
        console.error('POST /api/invoices exception:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unexpected error'
        }, {
            status: 500
        });
    }
}
async function PATCH(req) {
    try {
        // Restrict to admin only
        const { data: userData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        const user = userData?.user;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoicePermissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canMutateInvoices"])(user?.user_metadata?.role)) {
            console.warn('PATCH /api/invoices forbidden for role:', user?.user_metadata?.role);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'You do not have permission to update invoices.'
            }, {
                status: 403
            });
        }
        const body = await req.json();
        const { id, user_id: incomingUserId } = body;
        const userId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveServerUserId"])(incomingUserId);
        const numericId = typeof id === 'number' ? id : Number(id);
        if (!Number.isFinite(numericId)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Valid invoice id required.'
            }, {
                status: 400
            });
        }
        const wantsCustomerChange = body.customer_id !== undefined || body.customerId !== undefined || typeof body.customer === 'string';
        if (numericId < 0) {
            return patchOfflineInvoice({
                body,
                userId,
                invoiceId: numericId,
                wantsCustomerChange
            });
        }
        const updateFields = {};
        if (body.amount !== undefined) updateFields.amount = Number(body.amount) || 0;
        if (body.description !== undefined) updateFields.description = body.description;
        if (body.reference !== undefined) updateFields.reference = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitize"])(body.reference) || null;
        if (body.invoice_number !== undefined) updateFields.invoice_number = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitize"])(body.invoice_number) || null;
        if (body.currency !== undefined) updateFields.currency = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeCurrency"])(body.currency);
        if (body.status !== undefined) updateFields.status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeStatus"])(body.status);
        if (body.issued_on !== undefined) updateFields.issued_on = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeDateInput"])(body.issued_on);
        if (body.due_on !== undefined) updateFields.due_on = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeDateInput"])(body.due_on);
        let newLines = null;
        if (Array.isArray(body.lines)) {
            const prepared = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prepareLineItems"])(body.lines, userId);
            if (!prepared.lines.length) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Updated invoices require at least one line item.'
                }, {
                    status: 400
                });
            }
            newLines = prepared.lines;
            updateFields.amount = prepared.total;
        }
        if (wantsCustomerChange) {
            const newCustomerId = await resolveCustomerId(userId, body);
            if (!newCustomerId) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Customer not found for this workspace.'
                }, {
                    status: 400
                });
            }
            updateFields.customer_id = newCustomerId;
        }
        if (!Object.keys(updateFields).length) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No invoice changes supplied.'
            }, {
                status: 400
            });
        }
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoices').update(updateFields).eq('id', numericId).eq('user_id', userId).select('*').maybeSingle();
        if (error) {
            console.error('PATCH /api/invoices error:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 500
            });
        }
        if (!data) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invoice not found.'
            }, {
                status: 404
            });
        }
        if (newLines) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoice_line_items').delete().eq('invoice_id', numericId).eq('user_id', userId);
            const linePayload = newLines.map((line)=>({
                    ...line,
                    invoice_id: numericId
                }));
            const { error: lineError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoice_line_items').insert(linePayload);
            if (lineError) {
                console.error('PATCH /api/invoices line update error:', lineError);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Invoice lines could not be updated'
                }, {
                    status: 500
                });
            }
        }
        const { data: refreshed, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoices').select(INVOICE_SELECT).eq('id', numericId).eq('user_id', userId).maybeSingle();
        if (fetchError) {
            console.error('PATCH /api/invoices fetch error:', fetchError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: fetchError.message
            }, {
                status: 500
            });
        }
        const [hydrated] = await attachInvoiceLines(refreshed ? [
            refreshed
        ] : [], userId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(hydrated ?? refreshed);
    } catch (err) {
        console.error('PATCH /api/invoices exception:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unexpected error'
        }, {
            status: 500
        });
    }
}
async function patchOfflineInvoice(options) {
    const { body, userId, invoiceId, wantsCustomerChange } = options;
    const existing = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStoredInvoice"])(userId, invoiceId);
    if (!existing) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invoice not found.'
        }, {
            status: 404
        });
    }
    let customerId = existing.customer_id;
    if (wantsCustomerChange) {
        const resolved = await resolveCustomerId(userId, body);
        if (!resolved) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Customer not found for this workspace.'
            }, {
                status: 400
            });
        }
        customerId = resolved;
    }
    const customerName = typeof body.customer_name === 'string' ? body.customer_name : existing.customer_name;
    const updateFields = {};
    if (body.description !== undefined) updateFields.description = body.description;
    if (body.reference !== undefined) updateFields.reference = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitize"])(body.reference) || null;
    if (body.invoice_number !== undefined) updateFields.invoice_number = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitize"])(body.invoice_number) || existing.invoice_number;
    if (body.currency !== undefined) updateFields.currency = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeCurrency"])(body.currency);
    if (body.status !== undefined) updateFields.status = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeStatus"])(body.status);
    if (body.issued_on !== undefined) updateFields.issued_on = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeDateInput"])(body.issued_on);
    if (body.due_on !== undefined) updateFields.due_on = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeDateInput"])(body.due_on);
    let normalizedLines = storedLinesToNormalized(userId, existing.line_items);
    let storedLines = existing.line_items;
    let lineTotal = normalizedLines.reduce((sum, line)=>sum + line.total, 0);
    if (Array.isArray(body.lines)) {
        const prepared = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prepareLineItems"])(body.lines, userId);
        if (!prepared.lines.length) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Updated invoices require at least one line item.'
            }, {
                status: 400
            });
        }
        normalizedLines = prepared.lines;
        storedLines = normalizedToStoredLines(prepared.lines);
        lineTotal = prepared.total;
    }
    if (wantsCustomerChange) {
        updateFields.customer_id = customerId;
    }
    if (typeof body.customer_name === 'string') {
        updateFields.customer_name = customerName;
    }
    if (body.amount !== undefined) {
        updateFields.amount = Number(body.amount) || 0;
    }
    if (Array.isArray(body.lines)) {
        updateFields.amount = lineTotal;
        updateFields.line_items = storedLines;
    }
    if (!Object.keys(updateFields).length) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'No invoice changes supplied.'
        }, {
            status: 400
        });
    }
    const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateStoredInvoice"])(userId, invoiceId, {
        amount: typeof updateFields.amount === 'number' ? updateFields.amount : Array.isArray(body.lines) ? lineTotal : existing.amount,
        description: updateFields.description ?? existing.description,
        reference: updateFields.reference ?? existing.reference,
        invoice_number: updateFields.invoice_number ?? existing.invoice_number,
        issued_on: updateFields.issued_on ?? existing.issued_on,
        due_on: updateFields.due_on ?? existing.due_on,
        status: updateFields.status ?? existing.status,
        currency: updateFields.currency ?? existing.currency,
        customer_id: customerId,
        customer_name: updateFields.customer_name ?? existing.customer_name,
        line_items: Array.isArray(body.lines) ? storedLines : existing.line_items,
        pending_sync: true
    });
    if (!updated) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invoice not found.'
        }, {
            status: 404
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["storedInvoiceToApi"])(updated));
}
async function DELETE(req) {
    try {
        // Restrict to admin only
        const { data: userData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        const user = userData?.user;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoicePermissions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["canMutateInvoices"])(user?.user_metadata?.role)) {
            console.warn('DELETE /api/invoices forbidden for role:', user?.user_metadata?.role);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'You do not have permission to delete invoices.'
            }, {
                status: 403
            });
        }
        const { id, user_id: incomingUserId } = await req.json();
        const userId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveServerUserId"])(incomingUserId);
        const numericId = typeof id === 'number' ? id : Number(id);
        const hasNumericId = Number.isFinite(numericId);
        if (hasNumericId && numericId < 0) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteStoredInvoice"])(userId, numericId);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true
            });
        }
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoices').delete().eq('id', id).eq('user_id', userId);
        if (error) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseErrors$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSchemaCacheError"])(error) && hasNumericId) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteStoredInvoice"])(userId, numericId);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true
                });
            }
            console.error('DELETE /api/invoices error:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (err) {
        console.error('DELETE /api/invoices exception:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unexpected error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a842b88a._.js.map