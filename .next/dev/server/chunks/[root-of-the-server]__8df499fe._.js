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
"[project]/lib/invoicePdfGenerator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateInvoicesPdf",
    ()=>generateInvoicesPdf
]);
/**
 * Professional Invoice PDF Generator
 * Generates high-quality, separately formatted invoices
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/pdf-lib/es/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pdf-lib/es/api/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$StandardFonts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pdf-lib/es/api/StandardFonts.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pdf-lib/es/api/colors.js [app-route] (ecmascript)");
;
const DEFAULT_COMPANY = {
    name: 'FieldCost',
    currency: 'ZAR'
};
const COLORS = {
    primary: [
        51,
        102,
        153
    ],
    secondary: [
        102,
        102,
        102
    ],
    accent: [
        204,
        0,
        0
    ],
    border: [
        200,
        200,
        200
    ],
    text: [
        0,
        0,
        0
    ],
    lightText: [
        100,
        100,
        100
    ]
};
const MEASUREMENTS = {
    pageWidth: 595,
    pageHeight: 842,
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 40,
    marginRight: 40,
    contentWidth: 515,
    lineHeight: 14
};
async function generateInvoicesPdf(invoices, company = DEFAULT_COMPANY) {
    const pdf = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PDFDocument"].create();
    const fontRegular = await pdf.embedFont(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$StandardFonts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StandardFonts"].Helvetica);
    const fontBold = await pdf.embedFont(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$StandardFonts$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StandardFonts"].HelveticaBold);
    // Create a separate page for each invoice
    for (const invoice of invoices){
        const page = pdf.addPage([
            MEASUREMENTS.pageWidth,
            MEASUREMENTS.pageHeight
        ]);
        await renderInvoicePage(page, invoice, company, fontRegular, fontBold);
    }
    const bytes = await pdf.save();
    return Buffer.from(bytes);
}
/**
 * Render a single invoice page
 */ async function renderInvoicePage(page, invoice, company, fontRegular, fontBold) {
    const { pageWidth, pageHeight, marginTop, marginLeft, marginRight, contentWidth } = MEASUREMENTS;
    let yPosition = pageHeight - marginTop;
    const drawText = (text, options)=>{
        const font = options?.bold ? fontBold : fontRegular;
        const color = options?.color || COLORS.text;
        const fontSize = options?.fontSize || 10;
        const textColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(color[0] / 255, color[1] / 255, color[2] / 255);
        let xPos = marginLeft;
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        if (options?.align === 'center') {
            xPos = (pageWidth - textWidth) / 2;
        } else if (options?.align === 'right') {
            xPos = pageWidth - marginRight - textWidth;
        }
        page.drawText(text, {
            x: xPos,
            y: yPosition - (options?.yOffset || 0),
            size: fontSize,
            font,
            color: textColor
        });
        yPosition -= fontSize + 4;
    };
    const drawLine = (thickness = 1, color = COLORS.border)=>{
        const lineColor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(color[0] / 255, color[1] / 255, color[2] / 255);
        page.drawLine({
            start: {
                x: marginLeft,
                y: yPosition
            },
            end: {
                x: pageWidth - marginRight,
                y: yPosition
            },
            thickness,
            color: lineColor
        });
        yPosition -= thickness + 8;
    };
    // Header Section
    drawText(company.name, {
        fontSize: 24,
        bold: true,
        color: COLORS.primary
    });
    yPosition -= 4;
    if (company.email) drawText(company.email, {
        fontSize: 9,
        color: COLORS.lightText
    });
    if (company.phone) drawText(company.phone, {
        fontSize: 9,
        color: COLORS.lightText
    });
    if (company.address1) drawText(company.address1, {
        fontSize: 9,
        color: COLORS.lightText
    });
    if (company.address2) drawText(company.address2, {
        fontSize: 9,
        color: COLORS.lightText
    });
    yPosition -= 12;
    drawLine(2, COLORS.primary);
    // Invoice Title and Meta
    page.drawText('INVOICE', {
        x: marginLeft,
        y: yPosition,
        size: 16,
        font: fontBold,
        color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(COLORS.primary[0] / 255, COLORS.primary[1] / 255, COLORS.primary[2] / 255)
    });
    const metaX = pageWidth - marginRight - 150;
    const metaLineHeight = 12;
    let metaY = yPosition;
    const drawMeta = (label, value)=>{
        page.drawText(label, {
            x: metaX,
            y: metaY,
            size: 9,
            font: fontBold,
            color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(COLORS.secondary[0] / 255, COLORS.secondary[1] / 255, COLORS.secondary[2] / 255)
        });
        page.drawText(value, {
            x: metaX + 70,
            y: metaY,
            size: 10,
            font: fontBold,
            color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(COLORS.text[0] / 255, COLORS.text[1] / 255, COLORS.text[2] / 255)
        });
        metaY -= metaLineHeight;
    };
    drawMeta('Invoice #:', invoice.invoiceNumber || `#${invoice.id}`);
    drawMeta('Issued:', invoice.issuedOn || new Date().toISOString().split('T')[0]);
    if (invoice.dueOn) drawMeta('Due:', invoice.dueOn);
    yPosition -= 50;
    drawLine();
    // Bill To Section
    drawText('BILL TO', {
        fontSize: 11,
        bold: true,
        color: COLORS.primary
    });
    if (invoice.customer?.name) {
        drawText(invoice.customer.name, {
            fontSize: 11,
            bold: true
        });
    }
    if (invoice.customer?.email) {
        drawText(invoice.customer.email, {
            fontSize: 9,
            color: COLORS.lightText
        });
    }
    if (invoice.reference) {
        yPosition -= 4;
        drawText(`Reference: ${invoice.reference}`, {
            fontSize: 9,
            color: COLORS.lightText
        });
    }
    yPosition -= 8;
    drawLine();
    // Line Items Table Header
    const colWidths = {
        desc: 250,
        qty: 60,
        rate: 80,
        total: 85
    };
    const tableStartY = yPosition;
    const tableHeaderY = yPosition;
    page.drawText('Description', {
        x: marginLeft,
        y: tableHeaderY,
        size: 10,
        font: fontBold,
        color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(1, 1, 1)
    });
    page.drawText('Qty', {
        x: marginLeft + colWidths.desc,
        y: tableHeaderY,
        size: 10,
        font: fontBold,
        color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(1, 1, 1)
    });
    page.drawText('Rate', {
        x: marginLeft + colWidths.desc + colWidths.qty,
        y: tableHeaderY,
        size: 10,
        font: fontBold,
        color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(1, 1, 1)
    });
    page.drawText('Total', {
        x: marginLeft + colWidths.desc + colWidths.qty + colWidths.rate,
        y: tableHeaderY,
        size: 10,
        font: fontBold,
        color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(1, 1, 1)
    });
    yPosition -= 16;
    drawLine(1, COLORS.primary);
    // Line Items
    const formatter = new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: company.currency || 'ZAR'
    });
    for (const item of invoice.lineItems || []){
        const qty = item.quantity || 0;
        const rate = item.rate || 0;
        const total = item.total || qty * rate;
        page.drawText(item.name || 'Line Item', {
            x: marginLeft,
            y: yPosition,
            size: 9,
            font: fontRegular,
            color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(COLORS.text[0] / 255, COLORS.text[1] / 255, COLORS.text[2] / 255)
        });
        page.drawText(String(qty), {
            x: marginLeft + colWidths.desc,
            y: yPosition,
            size: 9,
            font: fontRegular,
            color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(COLORS.text[0] / 255, COLORS.text[1] / 255, COLORS.text[2] / 255)
        });
        page.drawText(formatter.format(rate), {
            x: marginLeft + colWidths.desc + colWidths.qty,
            y: yPosition,
            size: 9,
            font: fontRegular,
            color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(COLORS.text[0] / 255, COLORS.text[1] / 255, COLORS.text[2] / 255)
        });
        page.drawText(formatter.format(total), {
            x: marginLeft + colWidths.desc + colWidths.qty + colWidths.rate,
            y: yPosition,
            size: 9,
            font: fontBold,
            color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(COLORS.text[0] / 255, COLORS.text[1] / 255, COLORS.text[2] / 255)
        });
        yPosition -= 14;
        // Item details if available
        if (item.project) {
            page.drawText(`Project: ${item.project}`, {
                x: marginLeft + 10,
                y: yPosition,
                size: 8,
                font: fontRegular,
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(COLORS.lightText[0] / 255, COLORS.lightText[1] / 255, COLORS.lightText[2] / 255)
            });
            yPosition -= 10;
        }
        if (item.note) {
            page.drawText(`Note: ${item.note}`, {
                x: marginLeft + 10,
                y: yPosition,
                size: 8,
                font: fontRegular,
                color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(COLORS.lightText[0] / 255, COLORS.lightText[1] / 255, COLORS.lightText[2] / 255)
            });
            yPosition -= 10;
        }
    }
    yPosition -= 4;
    drawLine(1, COLORS.primary);
    // Totals Section
    const totalLabelX = marginLeft + colWidths.desc + colWidths.qty + colWidths.rate - 30;
    page.drawText('TOTAL:', {
        x: totalLabelX,
        y: yPosition,
        size: 14,
        font: fontBold,
        color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(COLORS.primary[0] / 255, COLORS.primary[1] / 255, COLORS.primary[2] / 255)
    });
    page.drawText(formatter.format(invoice.amount || 0), {
        x: marginLeft + colWidths.desc + colWidths.qty + colWidths.rate,
        y: yPosition,
        size: 14,
        font: fontBold,
        color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(COLORS.primary[0] / 255, COLORS.primary[1] / 255, COLORS.primary[2] / 255)
    });
    yPosition -= 28;
    // Footer Notes
    if (invoice.description) {
        drawLine(1, COLORS.border);
        drawText(invoice.description, {
            fontSize: 9,
            color: COLORS.lightText
        });
    }
    // Footer
    yPosition = MEASUREMENTS.marginBottom + 20;
    drawLine(1, COLORS.border);
    const footerText = `Generated by FieldCost • ${new Date().toLocaleDateString()} • Thank you for your business!`;
    page.drawText(footerText, {
        x: marginLeft,
        y: yPosition,
        size: 8,
        font: fontRegular,
        color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(COLORS.lightText[0] / 255, COLORS.lightText[1] / 255, COLORS.lightText[2] / 255)
    });
    if (company.bankDetails) {
        page.drawText(company.bankDetails, {
            x: marginLeft,
            y: yPosition - 10,
            size: 7,
            font: fontRegular,
            color: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$lib$2f$es$2f$api$2f$colors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rgb"])(COLORS.lightText[0] / 255, COLORS.lightText[1] / 255, COLORS.lightText[2] / 255)
        });
    }
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseServer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseServer.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$serverUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/serverUser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoicePdfGenerator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/invoicePdfGenerator.ts [app-route] (ecmascript)");
;
;
;
;
;
const INVOICE_SELECT = "*, customer:customers(id, name, email, user_id), line_items:invoice_line_items(*)";
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
async function buildPdf(invoices, company) {
    // Convert database rows to InvoiceData format for professional PDF generation
    const invoiceData = invoices.map((inv)=>({
            id: inv.id,
            invoiceNumber: inv.invoice_number || `#${inv.id}`,
            issuedOn: formatDate(inv.issued_on || inv.created_at),
            dueOn: formatDate(inv.due_on),
            reference: inv.reference || undefined,
            description: inv.description || undefined,
            amount: inv.amount || 0,
            currency: company?.default_currency || "ZAR",
            customer: inv.customer ? {
                id: inv.customer.id,
                name: inv.customer.name,
                email: inv.customer.email || undefined
            } : undefined,
            lineItems: (inv.line_items || []).map((line)=>({
                    id: line.id,
                    name: line.name || "Line Item",
                    quantity: line.quantity || 0,
                    rate: line.rate || 0,
                    total: line.total || (line.rate || 0) * (line.quantity || 0),
                    project: line.project || undefined,
                    note: line.note || undefined
                }))
        }));
    // Convert company profile to CompanyProfile format
    const companyProfile = {
        name: company?.name || "FieldCost",
        email: company?.email || undefined,
        phone: company?.phone || undefined,
        address1: company?.address_line1 || undefined,
        address2: company?.address_line2 || undefined,
        currency: company?.default_currency || "ZAR"
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoicePdfGenerator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateInvoicesPdf"])(invoiceData, companyProfile);
}
async function GET(req) {
    try {
        const userId = await resolveUserId(req);
        const { searchParams } = new URL(req.url);
        const format = (searchParams.get("format") || "ledger").toLowerCase();
        const idsParam = searchParams.get("ids");
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
        const pdfBuffer = await buildPdf(invoiceRows, companyRow);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"](new Uint8Array(pdfBuffer), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="invoices-professional.pdf"`
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

//# sourceMappingURL=%5Broot-of-the-server%5D__8df499fe._.js.map