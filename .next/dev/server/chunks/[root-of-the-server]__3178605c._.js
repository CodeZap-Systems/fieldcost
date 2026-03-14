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
"[project]/app/api/orders/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
/**
 * Purchase Orders API Route
 * Handles CRUD operations for purchase orders using Invoice pattern
 * Reuses invoice logic but with order-specific fields (vendor, delivery_date, status: draft/confirmed/delivered)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseServer.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/serverUser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoAuth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/demoAuth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyContext$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/companyContext.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/invoiceValidation.ts [app-route] (ecmascript)");
;
;
;
;
;
;
const ORDER_SELECT = '*';
const VALID_ORDER_STATUSES = new Set([
    'draft',
    'confirmed',
    'delivered',
    'cancelled'
]);
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
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        // Get authenticated user with fallback
        const userId = await resolveUserContext(req);
        const companyIdParam = searchParams.get('company_id');
        if (!companyIdParam || !companyIdParam.trim()) {
            console.warn(`[SECURITY] GET /api/orders: Missing company_id for user ${userId}`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'company_id parameter is required for data isolation'
            }, {
                status: 400
            });
        }
        const trimmed = companyIdParam.trim();
        const asInt = parseInt(trimmed, 10);
        let companyId = Number.isFinite(asInt) ? asInt : trimmed;
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('orders').select(ORDER_SELECT).order('id', {
            ascending: false
        });
        // Apply company filter
        query = query.eq('company_id', companyId);
        // For non-demo companies, also filter by user_id
        // For demo companies, allow all users to see shared demo data
        const isDemoCompany = companyId === 8 || companyId === '8';
        if (userId && !isDemoCompany) {
            query = query.eq('user_id', userId);
        }
        // Apply status filter if provided
        const statusFilter = searchParams.get('status');
        if (statusFilter && VALID_ORDER_STATUSES.has(statusFilter.toLowerCase())) {
            query = query.eq('status', statusFilter.toLowerCase());
        }
        // Apply date range filter
        const fromDate = searchParams.get('from');
        const toDate = searchParams.get('to');
        if (fromDate) {
            query = query.gte('created_at', `${fromDate}T00:00:00`);
        }
        if (toDate) {
            query = query.lte('created_at', `${toDate}T23:59:59`);
        }
        // Apply search filter
        const searchTerm = searchParams.get('search');
        if (searchTerm) {
            query = query.or(`reference.ilike.%${searchTerm}%,vendor_name.ilike.%${searchTerm}%`);
        }
        const { data, error } = await query;
        if (error) {
            console.error('GET /api/orders error:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([], {
                status: 500
            });
        }
        // Attach line items to orders
        const orderIds = (data || []).map((o)=>o.id).filter((id)=>typeof id === 'number');
        let lineItems = [];
        if (orderIds.length > 0) {
            const { data: lines } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('order_line_items').select('*').in('order_id', orderIds);
            lineItems = lines || [];
        }
        const grouped = {};
        lineItems.forEach((line)=>{
            const orderId = line.order_id;
            if (!grouped[orderId]) grouped[orderId] = [];
            grouped[orderId].push(line);
        });
        const orders = (data || []).map((order)=>({
                ...order,
                line_items: grouped[order.id] || []
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(orders);
    } catch (err) {
        console.error('GET /api/orders exception:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: String(err)
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const body = await req.json();
        const { customerId, vendorId, vendorName, lines, deliveryDate } = body;
        // Get authenticated user
        const { data: { user }, error: authError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].auth.getUser();
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const userId = user.id;
        const companyId = body.company_id;
        if (!customerId && !vendorId && !vendorName) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Vendor or customer is required'
            }, {
                status: 400
            });
        }
        if (!companyId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Company ID required'
            }, {
                status: 400
            });
        }
        // Ensure user is authenticated
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
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unable to prepare user context'
            }, {
                status: 500
            });
        }
        // Validate company access
        let validCompanyId;
        try {
            const { companyId: validated } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companyContext$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCompanyContext"])(userId, companyId);
            validCompanyId = validated;
        } catch (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Company access denied'
            }, {
                status: 403
            });
        }
        // Prepare line items
        const { lines: normalizedLines, total } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prepareLineItems"])(lines || [], userId);
        const referenceNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitize"])(body.reference) || `PO-${Date.now()}`;
        const deliveryDateValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeDateInput"])(deliveryDate) || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const orderPayload = {
            customer_id: customerId || null,
            vendor_id: vendorId || null,
            vendor_name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitize"])(vendorName) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitize"])(body.vendor_name) || null,
            amount: body.amount || total,
            description: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoiceValidation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitize"])(body.description) || null,
            reference: referenceNumber,
            po_number: `PO-${Date.now().toString(36).toUpperCase()}`,
            status: 'draft',
            delivery_date: deliveryDateValue,
            user_id: userId,
            company_id: validCompanyId
        };
        // Create order
        const { data: insertedOrder, error: orderError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('orders').insert([
            orderPayload
        ]).select().single();
        if (orderError) {
            console.error('POST /api/orders insert error:', orderError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: orderError.message
            }, {
                status: 500
            });
        }
        // Add line items
        if (normalizedLines.length > 0 && insertedOrder?.id) {
            const linePayload = normalizedLines.map((line)=>({
                    ...line,
                    order_id: insertedOrder.id,
                    company_id: validCompanyId
                }));
            const { error: lineError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('order_line_items').insert(linePayload);
            if (lineError) {
                console.error('POST /api/orders line items error:', lineError);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...insertedOrder,
            line_items: normalizedLines
        }, {
            status: 201
        });
    } catch (err) {
        console.error('POST /api/orders exception:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: String(err)
        }, {
            status: 400
        });
    }
}
async function PATCH(req) {
    try {
        const body = await req.json();
        const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].auth.getUser();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const { status, cancellation_reason, received_quantities, ...updateFields } = body;
        if (status && !VALID_ORDER_STATUSES.has(status)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid status'
            }, {
                status: 400
            });
        }
        const updatePayload = {
            ...updateFields
        };
        if (status) {
            updatePayload.status = status;
            if (status === 'cancelled' && cancellation_reason) {
                updatePayload.cancellation_reason = cancellation_reason;
            }
        }
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('orders').update(updatePayload).eq('id', body.id).eq('user_id', user.id).select().single();
        if (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 500
            });
        }
        if (!data) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Order not found'
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data);
    } catch (err) {
        console.error('PATCH /api/orders exception:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: String(err)
        }, {
            status: 400
        });
    }
}
async function DELETE(req) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].auth.getUser();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        // Check order status before deletion
        const { data: order } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('orders').select('status').eq('id', id).eq('user_id', user.id).single();
        if (!order) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Order not found'
            }, {
                status: 404
            });
        }
        if (order.status !== 'draft') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Can only delete draft orders'
            }, {
                status: 403
            });
        }
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('orders').delete().eq('id', id).eq('user_id', user.id);
        if (error) {
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
        console.error('DELETE /api/orders exception:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: String(err)
        }, {
            status: 400
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3178605c._.js.map