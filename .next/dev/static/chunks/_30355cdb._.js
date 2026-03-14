(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/supabaseClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://mukaeylwmzztycajibhy.supabase.co") || 'https://mukaeylwmzztycajibhy.supabase.co';
const supabaseAnonKey = ("TURBOPACK compile-time value", "sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg") || 'sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg';
// Configure storage for session persistence
const storage = {
    getItem: (key)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return localStorage.getItem(key);
    },
    setItem: (key, value)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        localStorage.setItem(key, value);
    },
    removeItem: (key)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        localStorage.removeItem(key);
    }
};
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        storage,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/userIdentity.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const DEFAULT_ADMIN_UUID = "11111111-1111-1111-1111-111111111111";
const DEFAULT_SUBCONTRACTOR_UUID = "22222222-2222-2222-2222-222222222222";
// Consistent UUIDs generated from demoUserUUIDs.ts using UUID v5
const DEMO_USER_UUID = "e66081a8-af72-5722-8cce-e3a996196ad2";
const DEMO_LIVE_TEST_UUID = "55a13a79-7825-5e24-bd4b-11babbc6288c";
const DEMO_ADMIN_TEST_UUID = "e2ba61b5-99c6-51f2-868b-32a20082bd86";
const DEMO_DIAGNOSTIC_USER_UUID = "53c8c879-8f4f-5b96-b23f-93e50f2ac41c";
const sanitize = (value)=>value?.trim() || undefined;
const DEFAULT_DEMO_USER_ID = sanitize(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_DEMO_USER_ID) || DEFAULT_ADMIN_UUID;
const DEMO_ADMIN_USER_ID = sanitize(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_DEMO_ADMIN_USER_ID) || DEFAULT_DEMO_USER_ID;
const DEMO_SUBCONTRACTOR_USER_ID = sanitize(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_DEMO_SUBCONTRACTOR_USER_ID) || DEFAULT_SUBCONTRACTOR_UUID;
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
const DEMO_FIXTURES_ENABLED = (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_ENABLE_DEMO_FIXTURES ?? "true").toLowerCase() === "true";
function resolveUserId(candidate) {
    const trimmed = candidate?.trim();
    if (!trimmed) return undefined;
    return DEMO_ALIAS_MAP[trimmed.toLowerCase()] || trimmed;
}
function normalizeUserId(candidate, fallback = DEFAULT_DEMO_USER_ID) {
    return resolveUserId(candidate) ?? fallback;
}
const SERVER_FALLBACK_USER_ID = normalizeUserId(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.DEMO_USER_ID, DEFAULT_DEMO_USER_ID);
function isDemoUserId(candidate) {
    const resolved = resolveUserId(candidate);
    if (!resolved) return false;
    return DEMO_USER_IDS.has(resolved);
}
function canUseDemoFixtures(candidate) {
    return DEMO_FIXTURES_ENABLED && isDemoUserId(candidate);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/companySwitcher.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACTIVE_COMPANY_STORAGE_KEY",
    ()=>ACTIVE_COMPANY_STORAGE_KEY,
    "persistActiveCompanyId",
    ()=>persistActiveCompanyId,
    "readActiveCompanyId",
    ()=>readActiveCompanyId
]);
const ACTIVE_COMPANY_STORAGE_KEY = "fieldcostActiveCompanyId";
function readActiveCompanyId() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const value = window.localStorage.getItem(ACTIVE_COMPANY_STORAGE_KEY);
    return value && value.trim().length ? value : null;
}
function persistActiveCompanyId(id) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (id && id.trim().length) {
        window.localStorage.setItem(ACTIVE_COMPANY_STORAGE_KEY, id.trim());
    } else {
        window.localStorage.removeItem(ACTIVE_COMPANY_STORAGE_KEY);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/demoConstants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Demo Company Constants
 * Centralized configuration for demo/live environment identification
 */ // Demo company ID - represents the shared demo workspace with sample data
__turbopack_context__.s([
    "DEMO_COMPANY_ID",
    ()=>DEMO_COMPANY_ID,
    "DEMO_MODE_CONFIG",
    ()=>DEMO_MODE_CONFIG,
    "LIVE_MODE_CONFIG",
    ()=>LIVE_MODE_CONFIG,
    "getEnvironmentLabel",
    ()=>getEnvironmentLabel,
    "isDemoCompany",
    ()=>isDemoCompany
]);
const DEMO_COMPANY_ID = "8";
const DEMO_MODE_CONFIG = {
    badgeLabel: "Demo Mode",
    badgeColor: "orange",
    bannerMessage: "You're exploring the Demo Workspace. Changes will not affect a real company.",
    bannerHelper: "This is sample data to help you explore the product.",
    tooltipText: "You are viewing a demo workspace with sample data."
};
const LIVE_MODE_CONFIG = {
    badgeLabel: null,
    badgeColor: null,
    bannerMessage: null
};
function isDemoCompany(companyId) {
    return companyId === DEMO_COMPANY_ID;
}
function getEnvironmentLabel(companyId, companyName) {
    if (isDemoCompany(companyId)) {
        return DEMO_MODE_CONFIG.badgeLabel;
    }
    return companyName || "My Workspace";
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/SageNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SageNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/userIdentity.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companySwitcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/companySwitcher.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/demoConstants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
// Menu icons as components
const MenuIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-lg",
        children: "☰"
    }, void 0, false, {
        fileName: "[project]/app/components/SageNav.tsx",
        lineNumber: 11,
        columnNumber: 24
    }, ("TURBOPACK compile-time value", void 0));
_c = MenuIcon;
const CloseIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-lg",
        children: "✕"
    }, void 0, false, {
        fileName: "[project]/app/components/SageNav.tsx",
        lineNumber: 12,
        columnNumber: 25
    }, ("TURBOPACK compile-time value", void 0));
_c1 = CloseIcon;
const LogoutIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-lg",
        children: "⎚"
    }, void 0, false, {
        fileName: "[project]/app/components/SageNav.tsx",
        lineNumber: 13,
        columnNumber: 26
    }, ("TURBOPACK compile-time value", void 0));
_c2 = LogoutIcon;
const ChevronRightIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-sm",
        children: "›"
    }, void 0, false, {
        fileName: "[project]/app/components/SageNav.tsx",
        lineNumber: 14,
        columnNumber: 32
    }, ("TURBOPACK compile-time value", void 0));
_c3 = ChevronRightIcon;
// Navigation sections with icons
const NAV_SECTIONS = [
    {
        label: "Workspace",
        icon: "🏠",
        links: [
            {
                href: "/",
                text: "Home",
                icon: "🏠"
            },
            {
                href: "/dashboard",
                text: "Dashboard",
                icon: "📊"
            }
        ]
    },
    {
        label: "Operations",
        icon: "📋",
        links: [
            {
                href: "/dashboard/projects",
                text: "Projects",
                icon: "📁"
            },
            {
                href: "/dashboard/customers",
                text: "Customers",
                icon: "👥"
            },
            {
                href: "/dashboard/items",
                text: "Inventory",
                icon: "📦"
            },
            {
                href: "/dashboard/invoices",
                text: "Invoices",
                icon: "💰"
            }
        ]
    },
    {
        label: "Tasks",
        icon: "✓",
        links: [
            {
                href: "/dashboard/tasks",
                text: "View Tasks",
                icon: "✓"
            }
        ]
    },
    {
        label: "Demo",
        icon: "🎬",
        links: [
            {
                href: "/auth/demo-login",
                text: "Try Demo",
                icon: "🎬"
            }
        ]
    },
    {
        label: "Account",
        icon: "👤",
        links: [
            {
                href: "/auth/login",
                text: "Login",
                icon: "🔓"
            },
            {
                href: "/auth/register",
                text: "Register",
                icon: "📝"
            },
            {
                href: "/dashboard/setup-company",
                text: "Setup Company",
                icon: "⚙️"
            }
        ]
    }
];
function SageNav() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [role, setRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [demoUserId, setDemoUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [companies, setCompanies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeCompanyId, setActiveCompanyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [expandedSections, setExpandedSections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Workspace": true,
        "Operations": true
    });
    // Check authentication on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SageNav.useEffect": ()=>{
            const checkAuth = {
                "SageNav.useEffect.checkAuth": async ()=>{
                    try {
                        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                        if (data?.session?.user) {
                            setUser(data.session.user);
                            setRole(data.session.user.user_metadata?.role || null);
                        }
                    } catch (err) {
                        console.warn("Failed to check session:", err);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["SageNav.useEffect.checkAuth"];
            checkAuth();
        }
    }["SageNav.useEffect"], []);
    // Load demo user state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SageNav.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const stored = window.localStorage.getItem("demoUserId");
            setDemoUserId(stored ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeUserId"])(stored) : null);
        }
    }["SageNav.useEffect"], []);
    // Load companies
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SageNav.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            setActiveCompanyId((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companySwitcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readActiveCompanyId"])());
        }
    }["SageNav.useEffect"], []);
    // Fetch companies data
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SageNav.useEffect": ()=>{
            let ignore = false;
            const params = new URLSearchParams();
            const targetId = activeCompanyId ?? (("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companySwitcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readActiveCompanyId"])() : "TURBOPACK unreachable");
            if (targetId) params.set("company_id", targetId);
            const query = params.toString();
            fetch(`/api/company${query ? `?${query}` : ""}`).then({
                "SageNav.useEffect": (res)=>res.ok ? res.json() : Promise.reject(new Error("Failed to load companies"))
            }["SageNav.useEffect"]).then({
                "SageNav.useEffect": (payload)=>{
                    if (ignore) return;
                    const list = Array.isArray(payload?.companies) ? payload.companies : payload?.company ? [
                        payload.company
                    ] : [];
                    const normalized = list.map({
                        "SageNav.useEffect.normalized": (entry)=>({
                                id: entry?.id ? String(entry.id) : "",
                                name: entry?.name || "Untitled company"
                            })
                    }["SageNav.useEffect.normalized"]).filter({
                        "SageNav.useEffect.normalized": (entry)=>entry.id
                    }["SageNav.useEffect.normalized"]);
                    setCompanies(normalized);
                    const resolvedId = payload?.company?.id ? String(payload.company.id) : normalized[0]?.id ?? null;
                    if (resolvedId && resolvedId !== activeCompanyId) {
                        setActiveCompanyId(resolvedId);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companySwitcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistActiveCompanyId"])(resolvedId);
                    }
                }
            }["SageNav.useEffect"]).catch({
                "SageNav.useEffect": (err)=>{
                    console.warn("Failed to load companies:", err);
                }
            }["SageNav.useEffect"]);
            return ({
                "SageNav.useEffect": ()=>{
                    ignore = true;
                }
            })["SageNav.useEffect"];
        }
    }["SageNav.useEffect"], [
        activeCompanyId
    ]);
    const handleLogout = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
            localStorage.removeItem("demoSession");
            localStorage.removeItem("demoUserId");
            router.push("/auth/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };
    const toggleSection = (label)=>{
        setExpandedSections((prev)=>({
                ...prev,
                [label]: !prev[label]
            }));
    };
    const handleCompanySelect = (companyId)=>{
        setActiveCompanyId(companyId);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companySwitcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistActiveCompanyId"])(companyId);
    };
    // Filter sections based on auth state
    const visibleSections = NAV_SECTIONS.filter((section)=>{
        if (section.label === "Account" && user) {
            return false; // Hide Account links if logged in
        }
        if (section.label === "Demo" && user) {
            return false; // Hide Demo links if logged in
        }
        if (section.label === "Operations" && !user) {
            return false; // Hide Operations if not logged in
        }
        if (section.label === "Tasks" && !user) {
            return false; // Hide Tasks if not logged in
        }
        if (section.label === "Workspace" && !user) {
            return false; // Hide Dashboard link if not logged in
        }
        return true;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: `bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen ${sidebarOpen ? "w-64" : "w-20"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between p-4 border-b border-gray-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `flex items-center gap-2 ${!sidebarOpen && "hidden"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm",
                                children: "FC"
                            }, void 0, false, {
                                fileName: "[project]/app/components/SageNav.tsx",
                                lineNumber: 197,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold text-gray-900 text-sm",
                                        children: "FieldCost"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/SageNav.tsx",
                                        lineNumber: 201,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-500",
                                        children: "MVP"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/SageNav.tsx",
                                        lineNumber: 202,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/SageNav.tsx",
                                lineNumber: 200,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/SageNav.tsx",
                        lineNumber: 196,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setSidebarOpen(!sidebarOpen),
                        className: "p-1 hover:bg-gray-100 rounded",
                        title: sidebarOpen ? "Close sidebar" : "Open sidebar",
                        children: sidebarOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CloseIcon, {}, void 0, false, {
                            fileName: "[project]/app/components/SageNav.tsx",
                            lineNumber: 210,
                            columnNumber: 28
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuIcon, {}, void 0, false, {
                            fileName: "[project]/app/components/SageNav.tsx",
                            lineNumber: 210,
                            columnNumber: 44
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/SageNav.tsx",
                        lineNumber: 205,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/SageNav.tsx",
                lineNumber: 195,
                columnNumber: 9
            }, this),
            user && companies.length > 0 && sidebarOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-b border-gray-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2",
                        children: "Active Workspace"
                    }, void 0, false, {
                        fileName: "[project]/app/components/SageNav.tsx",
                        lineNumber: 217,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: activeCompanyId || "",
                        onChange: (e)=>handleCompanySelect(e.target.value),
                        className: "w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-900 hover:bg-gray-50",
                        children: companies.map((company)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: company.id,
                                children: [
                                    company.name,
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDemoCompany"])(company.id) ? " [DEMO]" : ""
                                ]
                            }, company.id, true, {
                                fileName: "[project]/app/components/SageNav.tsx",
                                lineNumber: 226,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/SageNav.tsx",
                        lineNumber: 220,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/SageNav.tsx",
                lineNumber: 216,
                columnNumber: 11
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex-1 overflow-y-auto p-4 space-y-2",
                children: visibleSections.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>toggleSection(section.label),
                                className: `w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded transition-colors ${!sidebarOpen && "justify-center"}`,
                                title: !sidebarOpen ? section.label : undefined,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-lg",
                                        children: section.icon
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/SageNav.tsx",
                                        lineNumber: 247,
                                        columnNumber: 17
                                    }, this),
                                    sidebarOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex-1 text-left",
                                                children: section.label
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/SageNav.tsx",
                                                lineNumber: 250,
                                                columnNumber: 21
                                            }, this),
                                            section.links.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-gray-400 transform transition-transform ${expandedSections[section.label] ? "rotate-90" : ""}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChevronRightIcon, {}, void 0, false, {
                                                    fileName: "[project]/app/components/SageNav.tsx",
                                                    lineNumber: 257,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/SageNav.tsx",
                                                lineNumber: 252,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/SageNav.tsx",
                                lineNumber: 240,
                                columnNumber: 15
                            }, this),
                            expandedSections[section.label] && sidebarOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1 ml-8",
                                children: section.links.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: link.href,
                                        className: `block px-3 py-2 text-sm rounded transition-colors ${pathname === link.href ? "bg-indigo-100 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mr-2",
                                                children: link.icon
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/SageNav.tsx",
                                                lineNumber: 277,
                                                columnNumber: 23
                                            }, this),
                                            link.text
                                        ]
                                    }, link.href, true, {
                                        fileName: "[project]/app/components/SageNav.tsx",
                                        lineNumber: 268,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/components/SageNav.tsx",
                                lineNumber: 266,
                                columnNumber: 17
                            }, this),
                            expandedSections[section.label] && !sidebarOpen && section.links.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1 flex flex-col items-center",
                                children: section.links.slice(0, 2).map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: link.href,
                                        className: `p-2 rounded text-lg transition-colors ${pathname === link.href ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"}`,
                                        title: link.text,
                                        children: link.icon
                                    }, link.href, false, {
                                        fileName: "[project]/app/components/SageNav.tsx",
                                        lineNumber: 288,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/components/SageNav.tsx",
                                lineNumber: 286,
                                columnNumber: 17
                            }, this)
                        ]
                    }, section.label, true, {
                        fileName: "[project]/app/components/SageNav.tsx",
                        lineNumber: 238,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/components/SageNav.tsx",
                lineNumber: 236,
                columnNumber: 9
            }, this),
            sidebarOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-gray-200 p-4 space-y-2",
                children: [
                    user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-3 py-2 text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-gray-600 truncate",
                                        children: "Signed in as"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/SageNav.tsx",
                                        lineNumber: 311,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-medium text-gray-900 truncate",
                                        children: user.email
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/SageNav.tsx",
                                        lineNumber: 312,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/SageNav.tsx",
                                lineNumber: 310,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleLogout,
                                className: "w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LogoutIcon, {}, void 0, false, {
                                        fileName: "[project]/app/components/SageNav.tsx",
                                        lineNumber: 318,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Logout"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/SageNav.tsx",
                                        lineNumber: 319,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/SageNav.tsx",
                                lineNumber: 314,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true),
                    !user && !isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/auth/login",
                        className: "block px-3 py-2 text-sm text-center bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors",
                        children: "Sign In"
                    }, void 0, false, {
                        fileName: "[project]/app/components/SageNav.tsx",
                        lineNumber: 324,
                        columnNumber: 15
                    }, this),
                    isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 py-2 text-xs text-gray-500 text-center",
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/app/components/SageNav.tsx",
                        lineNumber: 332,
                        columnNumber: 15
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/SageNav.tsx",
                lineNumber: 307,
                columnNumber: 11
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/SageNav.tsx",
        lineNumber: 189,
        columnNumber: 5
    }, this);
}
_s(SageNav, "S4n2lZ6jE6as8aCEVkL0F4twddI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c4 = SageNav;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "MenuIcon");
__turbopack_context__.k.register(_c1, "CloseIcon");
__turbopack_context__.k.register(_c2, "LogoutIcon");
__turbopack_context__.k.register(_c3, "ChevronRightIcon");
__turbopack_context__.k.register(_c4, "SageNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/ClientNavWrapper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ClientNavWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SageNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/SageNav.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ClientNavWrapper() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const showNav = !pathname?.startsWith('/auth');
    return showNav ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SageNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/app/components/ClientNavWrapper.tsx",
        lineNumber: 10,
        columnNumber: 20
    }, this) : null;
}
_s(ClientNavWrapper, "xbyQPtUVMO7MNj7WjJlpdWqRcTo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = ClientNavWrapper;
var _c;
__turbopack_context__.k.register(_c, "ClientNavWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/AuthErrorBoundary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthErrorBoundary",
    ()=>AuthErrorBoundary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function AuthErrorBoundary({ children }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthErrorBoundary.useEffect": ()=>{
            // Set up global error handlers for auth errors
            const handleAuthError = {
                "AuthErrorBoundary.useEffect.handleAuthError": async (error)=>{
                    if (!error) return;
                    const errorMsg = error?.message?.toLowerCase() || '';
                    // Handle refresh token errors
                    if (errorMsg.includes('refresh token') || errorMsg.includes('invalid refresh token') || errorMsg.includes('session')) {
                        console.error('[AuthErrorBoundary] Caught auth error:', error.message);
                        // Clear all auth storage
                        try {
                            localStorage.removeItem('supabase.auth.token');
                            localStorage.removeItem('sb-mukaeylwmzztycajibhy-auth-token');
                            sessionStorage.clear();
                            // Sign out
                            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signOut().catch({
                                "AuthErrorBoundary.useEffect.handleAuthError": ()=>{
                                // Session already invalid - that's ok
                                }
                            }["AuthErrorBoundary.useEffect.handleAuthError"]);
                            // Redirect to login
                            router.push('/auth/login?error=session_expired');
                        } catch (err) {
                            console.error('[AuthErrorBoundary] Cleanup failed:', err);
                            router.push('/auth/login');
                        }
                    }
                }
            }["AuthErrorBoundary.useEffect.handleAuthError"];
            // Listen for auth state changes
            const { data: { subscription } } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange({
                "AuthErrorBoundary.useEffect": async (event, session)=>{
                    if (event === 'SIGNED_OUT') {
                        console.log('[AuthErrorBoundary] User signed out');
                        router.push('/auth/login');
                    }
                }
            }["AuthErrorBoundary.useEffect"]);
            // Set up global error listener
            const originalConsoleError = console.error;
            console.error = ({
                "AuthErrorBoundary.useEffect": (...args)=>{
                    originalConsoleError(...args);
                    // Check if the error is auth-related
                    const errorStr = JSON.stringify(args[0]);
                    if (errorStr.includes('refresh token') || errorStr.includes('Invalid Refresh Token')) {
                        handleAuthError(args[0]);
                    }
                }
            })["AuthErrorBoundary.useEffect"];
            return ({
                "AuthErrorBoundary.useEffect": ()=>{
                    subscription?.unsubscribe();
                    console.error = originalConsoleError;
                }
            })["AuthErrorBoundary.useEffect"];
        }
    }["AuthErrorBoundary.useEffect"], [
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(AuthErrorBoundary, "vQduR7x+OPXj6PSmJyFnf+hU7bg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthErrorBoundary;
var _c;
__turbopack_context__.k.register(_c, "AuthErrorBoundary");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_30355cdb._.js.map