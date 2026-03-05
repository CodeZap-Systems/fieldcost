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
function normalizeUserId(candidate, fallback = DEFAULT_DEMO_USER_ID) {
    const trimmed = candidate?.trim();
    if (!trimmed) return fallback;
    return DEMO_ALIAS_MAP[trimmed.toLowerCase()] || trimmed;
}
const SERVER_FALLBACK_USER_ID = normalizeUserId(process.env.DEMO_USER_ID, DEFAULT_DEMO_USER_ID);
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
;
;
;
;
;
const INVOICE_SELECT = '*, customer:customers(id, name, email)';
const VALID_STATUSES = new Set([
    'draft',
    'sent',
    'paid',
    'overdue'
]);
const sanitize = (value)=>{
    if (typeof value !== 'string') return '';
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
    return trimmed.length === 3 ? trimmed : 'ZAR';
};
const normalizeStatus = (value)=>{
    const status = sanitize(value).toLowerCase();
    return VALID_STATUSES.has(status) ? status : 'sent';
};
function prepareLineItems(lines, userId) {
    if (!Array.isArray(lines)) return {
        lines: [],
        total: 0
    };
    const normalized = [];
    for (const raw of lines){
        if (!raw) continue;
        const quantity = Number(raw.quantity ?? raw['qty']);
        const rate = Number(raw.rate);
        if (!(Number.isFinite(quantity) && quantity > 0)) continue;
        const safeRate = Number.isFinite(rate) ? rate : 0;
        const itemId = raw.itemId ?? raw.item_id;
        const lineName = sanitize(raw.name) || sanitize(raw.itemName);
        if (!lineName) continue;
        const total = Number.isFinite(Number(raw.total)) ? Number(raw.total) : Number((quantity * safeRate).toFixed(2));
        let parsedItemId = null;
        if (typeof itemId === 'number' && Number.isFinite(itemId)) {
            parsedItemId = itemId;
        } else if (typeof itemId === 'string' && itemId.trim()) {
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
    const suffix = userId.replace(/-/g, '').slice(0, 4).toUpperCase() || '0000';
    const stamp = Date.now().toString(36).toUpperCase();
    return `FC-${suffix}-${stamp}`;
};
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
        console.error('attachInvoiceLines error:', error);
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
const canMutateInvoices = (role)=>{
    if (!role) return true; // allow demo / local testing when no role assigned
    return role === 'admin' || role === 'demo' || role === 'subcontractor';
};
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveServerUserId"])(searchParams.get('user_id'));
        const query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoices').select(INVOICE_SELECT).order('id', {
            ascending: false
        });
        const finalQuery = userId ? query.eq('user_id', userId) : query;
        const { data, error } = await finalQuery;
        if (error) {
            console.error('GET /api/invoices error:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 500
            });
        }
        const hydrated = await attachInvoiceLines(data ?? [], userId);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(hydrated);
    } catch (err) {
        console.error('GET /api/invoices exception:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unexpected error'
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        // Restrict to admin only
        const { data: userData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        const user = userData?.user;
        if (!canMutateInvoices(user?.user_metadata?.role)) {
            console.warn('POST /api/invoices forbidden for role:', user?.user_metadata?.role);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'You do not have permission to create invoices.'
            }, {
                status: 403
            });
        }
        const body = await req.json();
        const userId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveServerUserId"])(body.user_id);
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
        const customerId = await resolveCustomerId(userId, body);
        if (!customerId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Customer selection is required to create an invoice.'
            }, {
                status: 400
            });
        }
        const reference = sanitize(body.reference);
        const issuedOn = normalizeDateInput(body.issued_on) ?? new Date().toISOString().slice(0, 10);
        const dueOn = normalizeDateInput(body.due_on);
        const status = normalizeStatus(body.status);
        const currency = sanitizeCurrency(body.currency);
        const { lines, total: lineTotal } = prepareLineItems(body.lines, userId);
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
            invoice_number: sanitize(body.invoice_number) || generateInvoiceNumber(userId),
            issued_on: issuedOn,
            due_on: dueOn,
            status,
            currency,
            user_id: userId
        };
        const inserted = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoices').insert([
            payload
        ]).select('*');
        if (inserted.error) {
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
                invoice_id: invoice.id
            }));
        const { error: lineError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoice_line_items').insert(linePayload);
        if (lineError) {
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
        if (!canMutateInvoices(user?.user_metadata?.role)) {
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
        const wantsCustomerChange = body.customer_id !== undefined || body.customerId !== undefined || typeof body.customer === 'string';
        const updateFields = {};
        if (body.amount !== undefined) updateFields.amount = Number(body.amount) || 0;
        if (body.description !== undefined) updateFields.description = body.description;
        if (body.reference !== undefined) updateFields.reference = sanitize(body.reference) || null;
        if (body.invoice_number !== undefined) updateFields.invoice_number = sanitize(body.invoice_number) || null;
        if (body.currency !== undefined) updateFields.currency = sanitizeCurrency(body.currency);
        if (body.status !== undefined) updateFields.status = normalizeStatus(body.status);
        if (body.issued_on !== undefined) updateFields.issued_on = normalizeDateInput(body.issued_on);
        if (body.due_on !== undefined) updateFields.due_on = normalizeDateInput(body.due_on);
        let newLines = null;
        if (Array.isArray(body.lines)) {
            const prepared = prepareLineItems(body.lines, userId);
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
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoices').update(updateFields).eq('id', id).eq('user_id', userId).select('*').maybeSingle();
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
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoice_line_items').delete().eq('invoice_id', id).eq('user_id', userId);
            const linePayload = newLines.map((line)=>({
                    ...line,
                    invoice_id: id
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
        const { data: refreshed, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoices').select(INVOICE_SELECT).eq('id', id).eq('user_id', userId).maybeSingle();
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
async function DELETE(req) {
    try {
        // Restrict to admin only
        const { data: userData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        const user = userData?.user;
        if (!canMutateInvoices(user?.user_metadata?.role)) {
            console.warn('DELETE /api/invoices forbidden for role:', user?.user_metadata?.role);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'You do not have permission to delete invoices.'
            }, {
                status: 403
            });
        }
        const { id, user_id: incomingUserId } = await req.json();
        const userId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveServerUserId"])(incomingUserId);
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from('invoices').delete().eq('id', id).eq('user_id', userId);
        if (error) {
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

//# sourceMappingURL=%5Broot-of-the-server%5D__6a82835c._.js.map