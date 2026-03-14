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
"[project]/lib/registrationStore.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "markRegistrationConfirmed",
    ()=>markRegistrationConfirmed,
    "recordRegistration",
    ()=>recordRegistration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dataStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dataStore.ts [app-route] (ecmascript)");
;
const FILE_NAME = 'registrations.json';
async function recordRegistration(entry) {
    const store = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dataStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readStore"])(FILE_NAME, {});
    store[entry.email.toLowerCase()] = entry;
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dataStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeStore"])(FILE_NAME, store);
    return entry;
}
async function markRegistrationConfirmed(email) {
    const store = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dataStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readStore"])(FILE_NAME, {});
    const key = email.toLowerCase();
    const existing = store[key];
    if (!existing) {
        return null;
    }
    const updated = {
        ...existing,
        status: 'confirmed',
        confirmedAt: new Date().toISOString()
    };
    store[key] = updated;
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dataStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeStore"])(FILE_NAME, store);
    return updated;
}
}),
"[project]/app/api/registrations/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$registrationStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/registrationStore.ts [app-route] (ecmascript)");
;
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://mukaeylwmzztycajibhy.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg");
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const sanitize = (value)=>{
    if (typeof value !== "string") return "";
    return value.trim();
};
function createAnonClient() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: false
        }
    });
}
const dynamic = "force-dynamic";
async function POST(req) {
    try {
        const body = await req.json();
        const email = sanitize(body?.email).toLowerCase();
        const password = sanitize(body?.password);
        const role = body?.role === "subcontractor" ? "subcontractor" : "admin";
        const companyName = sanitize(body?.companyName);
        if (!email || !password) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Email and password are required."
            }, {
                status: 400
            });
        }
        if (!companyName) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Company name is required."
            }, {
                status: 400
            });
        }
        // Validate password minimum length (Supabase requires at least 6 characters)
        if (password.length < 6) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Password must be at least 6 characters long."
            }, {
                status: 400
            });
        }
        // Validate email format
        if (!email.includes("@")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Please enter a valid email address."
            }, {
                status: 400
            });
        }
        const client = createAnonClient();
        const registrationEntry = {
            email,
            companyName,
            role,
            status: "pending",
            registeredAt: new Date().toISOString()
        };
        console.log("Attempting to sign up user:", {
            email,
            companyName,
            role
        });
        const { data, error } = await client.auth.signUp({
            email,
            password,
            options: {
                data: {
                    role,
                    companyName,
                    companyOnboarded: false
                },
                emailRedirectTo: `${siteUrl}/auth/callback?verified=1`
            }
        });
        if (error) {
            console.error("Supabase auth error:", error);
            const message = error.message?.toLowerCase() ?? "";
            if (message.includes("rate limit")) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$registrationStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["recordRegistration"])(registrationEntry);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: true,
                    message: "We already sent a confirmation email recently. Please check your inbox or wait a minute before trying again."
                }, {
                    status: 200
                });
            }
            if (message.includes("already registered") || message.includes("user already exists")) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "This email is already registered. Please log in instead."
                }, {
                    status: 400
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message || "Registration failed."
            }, {
                status: 400
            });
        }
        console.log("Supabase sign up successful for:", email);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$registrationStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["recordRegistration"])(registrationEntry);
        // Note: Supabase automatically sends verification emails via configured SMTP
        // If emails aren't being sent, please check Supabase project settings
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Registration successful! A verification email has been sent to " + email + ". Please check your inbox and click the verification link to confirm your account."
        });
    } catch (error) {
        console.error("POST /api/registrations error:", error);
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        console.error("Full error details:", {
            error
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: `Unable to process registration: ${errorMsg}`
        }, {
            status: 500
        });
    }
}
async function PATCH(req) {
    try {
        const body = await req.json();
        const email = sanitize(body?.email).toLowerCase();
        if (!email) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Email is required."
            }, {
                status: 400
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$registrationStore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["markRegistrationConfirmed"])(email);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        console.error("PATCH /api/registrations", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unable to update registration."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f9f25225._.js.map