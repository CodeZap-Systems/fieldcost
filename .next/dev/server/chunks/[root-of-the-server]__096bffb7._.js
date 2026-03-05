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
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

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
"[project]/app/api/invoices/export/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdfkit$2f$js$2f$pdfkit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pdfkit/js/pdfkit.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseServer.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/serverUser.ts [app-route] (ecmascript)");
;
;
;
;
;
const INVOICE_SELECT = "*, customer:customers(id, name, email, user_id), line_items:invoice_line_items(*)";
const TEMPLATE_OPTIONS = new Set([
    "standard",
    "detailed"
]);
const numberFormatter = (currency = "ZAR")=>new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency
    });
const formatDate = (value)=>{
    if (!value) return "";
    try {
        return new Date(value).toISOString().slice(0, 10);
    } catch  {
        return value;
    }
};
async function resolveUserId(req) {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
    if (data?.user?.id) return data.user.id;
    const { searchParams } = new URL(req.url);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveServerUserId"])(searchParams.get("user_id"));
}
function buildCsv(rows) {
    const escape = (value)=>{
        if (value.includes("\"") || value.includes(",") || value.includes("\n")) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    };
    return rows.map((row)=>row.map((col)=>escape(col ?? "")).join(",")).join("\n");
}
function buildLedgerRows(invoices) {
    const header = [
        "Issued Date",
        "Client",
        "Reference",
        "Invoice Number",
        "Total"
    ];
    const rows = invoices.map((inv)=>[
            formatDate(inv.issued_on || inv.created_at),
            inv.customer?.name || "",
            inv.reference || "",
            inv.invoice_number || `#${inv.id}`,
            `${inv.amount ?? 0}`
        ]);
    return [
        header,
        ...rows
    ];
}
function buildLineRows(invoices) {
    const header = [
        "Invoice Number",
        "Client",
        "Line Item",
        "Quantity",
        "Rate",
        "Total",
        "Project",
        "Note"
    ];
    const rows = [];
    invoices.forEach((inv)=>{
        (inv.line_items || []).forEach((line)=>{
            rows.push([
                inv.invoice_number || `#${inv.id}`,
                inv.customer?.name || "",
                line.name || "",
                `${line.quantity ?? 0}`,
                `${line.rate ?? 0}`,
                `${line.total ?? 0}`,
                line.project || "",
                line.note || ""
            ]);
        });
    });
    return [
        header,
        ...rows
    ];
}
async function buildPdf(invoices, company, template) {
    const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdfkit$2f$js$2f$pdfkit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
        size: "A4",
        margin: 50
    });
    const chunks = [];
    doc.on("data", (chunk)=>chunks.push(chunk));
    const formatter = numberFormatter(company?.default_currency || "ZAR");
    invoices.forEach((inv, index)=>{
        if (index) doc.addPage();
        doc.fontSize(18).text(company?.name || "FieldCost", {
            continued: false
        });
        doc.fontSize(10).fillColor("gray");
        if (company?.email) doc.text(company.email);
        if (company?.phone) doc.text(company.phone);
        if (company?.address_line1) doc.text(company.address_line1);
        if (company?.address_line2) doc.text(company.address_line2);
        doc.moveDown();
        doc.fillColor("black");
        doc.fontSize(12).text(`Invoice #: ${inv.invoice_number || `#${inv.id}`}`);
        doc.text(`Issued: ${formatDate(inv.issued_on)}`);
        doc.text(`Due: ${formatDate(inv.due_on)}`);
        doc.text(`Reference: ${inv.reference || ""}`);
        doc.moveDown();
        doc.fontSize(12).text("Bill To:", {
            underline: true
        });
        doc.fontSize(11).text(inv.customer?.name || "");
        if (inv.customer?.email) doc.text(inv.customer.email);
        doc.moveDown();
        doc.fontSize(11).text("Line items:", {
            underline: true
        });
        doc.moveDown(0.3);
        (inv.line_items || []).forEach((line)=>{
            const rate = line.rate ?? 0;
            const quantity = line.quantity ?? 0;
            const total = line.total ?? rate * quantity;
            doc.fontSize(11).text(`${line.name ?? "Line item"} — ${quantity} x ${formatter.format(rate)} = ${formatter.format(total)}`);
            if (line.project) doc.fontSize(9).fillColor("gray").text(`Project: ${line.project}`);
            if (line.note && template === "detailed") doc.fontSize(9).fillColor("gray").text(`Note: ${line.note}`);
            doc.fillColor("black");
            doc.moveDown(0.2);
        });
        doc.moveDown();
        doc.fontSize(14).text(`Total: ${formatter.format(inv.amount ?? 0)}`, {
            align: "right"
        });
        if (template === "detailed" && inv.description) {
            doc.moveDown();
            doc.fontSize(10).text(inv.description, {
                width: 500
            });
        }
    });
    doc.end();
    return await new Promise((resolve)=>doc.on("end", ()=>resolve(Buffer.concat(chunks))));
}
async function GET(req) {
    try {
        const userId = await resolveUserId(req);
        const { searchParams } = new URL(req.url);
        const format = (searchParams.get("format") || "ledger").toLowerCase();
        const idsParam = searchParams.get("ids");
        const template = TEMPLATE_OPTIONS.has((searchParams.get("template") || "standard").toLowerCase()) ? searchParams.get("template") : "standard";
        const ids = idsParam ? idsParam.split(",").map((value)=>Number(value.trim())).filter((value)=>Number.isFinite(value)) : [];
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from("invoices").select(INVOICE_SELECT).eq("user_id", userId).order("issued_on", {
            ascending: false
        });
        if (ids.length) {
            query = query.in("id", ids);
        }
        const { data: invoices, error } = await query;
        if (error) {
            console.error("GET /api/invoices/export query error", error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 500
            });
        }
        const { data: company } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseServer"].from("company_profiles").select("*").eq("user_id", userId).maybeSingle();
        const invoiceRows = Array.isArray(invoices) ? invoices : [];
        const companyRow = company ?? null;
        if (format === "ledger") {
            const csv = buildCsv(buildLedgerRows(invoiceRows));
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](csv, {
                headers: {
                    "Content-Type": "text/csv",
                    "Content-Disposition": `attachment; filename="invoices-ledger.csv"`
                }
            });
        }
        if (format === "lines") {
            const csv = buildCsv(buildLineRows(invoiceRows));
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](csv, {
                headers: {
                    "Content-Type": "text/csv",
                    "Content-Disposition": `attachment; filename="invoices-line-items.csv"`
                }
            });
        }
        const pdfBuffer = await buildPdf(invoiceRows, companyRow, template);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="invoices-${template}.pdf"`
            }
        });
    } catch (err) {
        console.error("GET /api/invoices/export exception", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unable to export invoices"
        }, {
            status: 500
        });
    }
}
const runtime = "nodejs";
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__096bffb7._.js.map