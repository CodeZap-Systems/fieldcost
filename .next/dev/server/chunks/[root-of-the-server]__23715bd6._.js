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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/app/api/admin/migrate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
;
;
;
// Create admin client with service role (unrestricted)
const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://mukaeylwmzztycajibhy.supabase.co") || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '', {
    db: {
        schema: 'public'
    }
});
async function POST(request) {
    try {
        // Security: Only allow from localhost or verified sources
        const origin = request.headers.get('origin');
        const host = request.headers.get('host');
        if (("TURBOPACK compile-time value", "development") === 'production' && !origin?.includes('localhost')) //TURBOPACK unreachable
        ;
        console.log('[MIGRATION] Starting table creation...');
        // Read SQL file from project root
        const sqlPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'COPY_TO_SUPABASE.sql');
        const sqlContent = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(sqlPath, 'utf-8');
        // Split into statements
        const statements = sqlContent.split(';').map((s)=>s.trim()).filter((s)=>s && !s.startsWith('--'));
        console.log(`[MIGRATION] Found ${statements.length} statements`);
        let successCount = 0;
        let failedStatements = [];
        // Execute each statement
        for(let i = 0; i < statements.length; i++){
            const stmt = statements[i];
            try {
                // Execute through supabase admin client
                let error = null;
                let data = null;
                try {
                    const result = await supabaseAdmin.rpc('exec_batch', {
                        queries: [
                            stmt
                        ]
                    });
                    error = result.error;
                    data = result.data;
                } catch (rpcErr) {
                    error = rpcErr;
                }
                if (error) {
                    failedStatements.push(`Statement ${i + 1}: ${stmt.substring(0, 50)}`);
                    console.log(`[MIGRATION] ✗ Statement ${i + 1} failed:`, error?.message || error);
                } else {
                    successCount++;
                    if (stmt.includes('CREATE TABLE')) {
                        const match = stmt.match(/CREATE TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
                        console.log(`[MIGRATION] ✓ Created table: ${match?.[1] || 'unknown'}`);
                    }
                }
            } catch (err) {
                failedStatements.push(`Statement ${i + 1}: ${err.message}`);
                console.error(`[MIGRATION] Error on statement ${i + 1}:`, err.message);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: failedStatements.length === 0,
            message: `Migration completed. ${successCount}/${statements.length} statements executed`,
            successCount,
            totalStatements: statements.length,
            failedStatements,
            nextStep: 'Run: node seed-quotes-orders.mjs'
        });
    } catch (error) {
        console.error('[MIGRATION] Fatal error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message,
            suggestion: 'Use Supabase web console to execute SQL manually'
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        status: 'Migration endpoint ready',
        method: 'POST',
        description: 'Executes COPY_TO_SUPABASE.sql to create tables',
        usage: 'curl -X POST http://localhost:3000/api/admin/migrate'
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__23715bd6._.js.map