module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

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
"[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-ssr] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://mukaeylwmzztycajibhy.supabase.co") || 'https://mukaeylwmzztycajibhy.supabase.co';
const supabaseAnonKey = ("TURBOPACK compile-time value", "sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg") || 'sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg';
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
}),
"[project]/lib/userIdentity.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/lib/companySwitcher.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const value = undefined;
}
function persistActiveCompanyId(id) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
}),
"[project]/lib/demoConstants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
const DEMO_COMPANY_ID = "demo-company-id";
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
}),
"[project]/app/components/EnvironmentBadge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EnvironmentBadge",
    ()=>EnvironmentBadge,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/demoConstants.ts [app-ssr] (ecmascript)");
"use client";
;
;
function EnvironmentBadge({ companyId, className = "", showTooltip = true }) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDemoCompany"])(companyId)) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500 text-white text-xs font-semibold tracking-wide ${className}`,
        title: showTooltip ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_MODE_CONFIG"].tooltipText : undefined,
        role: "note",
        "aria-label": "Demo mode indicator",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-1.5 h-1.5 rounded-full bg-white opacity-80 flex-shrink-0"
            }, void 0, false, {
                fileName: "[project]/app/components/EnvironmentBadge.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_MODE_CONFIG"].badgeLabel
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/EnvironmentBadge.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = EnvironmentBadge;
}),
"[project]/app/components/SelectableCompanySwitcher.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SelectableCompanySwitcher",
    ()=>SelectableCompanySwitcher,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/demoConstants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$EnvironmentBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/EnvironmentBadge.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function SelectableCompanySwitcher({ companies, activeCompanyId, onSwitchCompany, isLoading = false, showBadge = true }) {
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const buttonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Find active company
    const activeCompany = companies.find((c)=>c.id === activeCompanyId);
    const isActiveDemoCompany = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDemoCompany"])(activeCompanyId);
    // Close dropdown when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return ()=>{
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [
        isOpen
    ]);
    // Keyboard navigation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function handleKeyDown(e) {
            if (!isOpen) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsOpen(true);
                }
                return;
            }
            if (e.key === "Escape") {
                setIsOpen(false);
                buttonRef.current?.focus();
            }
        }
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            return ()=>{
                document.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [
        isOpen
    ]);
    function handleCompanySelect(companyId) {
        onSwitchCompany(companyId);
        setIsOpen(false);
    }
    // Separate demo and real companies
    const demoCompanies = companies.filter((c)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDemoCompany"])(c.id));
    const liveCompanies = companies.filter((c)=>!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDemoCompany"])(c.id));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "relative w-full max-w-xs",
        role: "application",
        "aria-label": "Company switcher",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                ref: buttonRef,
                onClick: ()=>setIsOpen(!isOpen),
                disabled: isLoading,
                className: "w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-left text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-between gap-2",
                "aria-haspopup": "listbox",
                "aria-expanded": isOpen,
                "aria-label": activeCompany ? `Switch workspace: ${activeCompany.name}` : "Switch workspace",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-2 flex-1 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate",
                                children: activeCompany?.name || "Select workspace"
                            }, void 0, false, {
                                fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                lineNumber: 122,
                                columnNumber: 11
                            }, this),
                            showBadge && activeCompany && isActiveDemoCompany && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$EnvironmentBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EnvironmentBadge"], {
                                companyId: activeCompanyId,
                                className: "flex-shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: `w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`,
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M19 14l-7 7m0 0l-7-7m7 7V3"
                        }, void 0, false, {
                            fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden",
                role: "listbox",
                children: [
                    demoCompanies.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-3 py-2 bg-gray-50 border-b border-gray-100",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-semibold text-gray-500 uppercase tracking-wide",
                                    children: "Demo"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                    lineNumber: 161,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                lineNumber: 160,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: demoCompanies.map((company)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleCompanySelect(company.id),
                                        className: `w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between gap-2 ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDemoCompany"])(activeCompanyId) && activeCompanyId === company.id ? "bg-blue-50 text-blue-700 border-l-2 border-blue-500" : "text-gray-700 hover:bg-gray-50"}`,
                                        role: "option",
                                        "aria-selected": (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDemoCompany"])(activeCompanyId) && activeCompanyId === company.id,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium",
                                                        children: company.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                                        lineNumber: 183,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-500",
                                                        children: "Try product with sample data"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                                        lineNumber: 184,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                                lineNumber: 182,
                                                columnNumber: 21
                                            }, this),
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDemoCompany"])(activeCompanyId) && activeCompanyId === company.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5 text-blue-500 flex-shrink-0",
                                                fill: "currentColor",
                                                viewBox: "0 0 20 20",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    fillRule: "evenodd",
                                                    d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                                    clipRule: "evenodd"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                                    lineNumber: 195,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                                lineNumber: 190,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, company.id, true, {
                                        fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                        lineNumber: 167,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                lineNumber: 165,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true),
                    liveCompanies.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-3 py-2 bg-gray-50 border-t border-gray-100",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-semibold text-gray-500 uppercase tracking-wide",
                                    children: "Your Workspaces"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                    lineNumber: 212,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                lineNumber: 211,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: liveCompanies.map((company)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleCompanySelect(company.id),
                                        className: `w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between gap-2 ${!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDemoCompany"])(activeCompanyId) && activeCompanyId === company.id ? "bg-blue-50 text-blue-700 border-l-2 border-blue-500" : "text-gray-700 hover:bg-gray-50"}`,
                                        role: "option",
                                        "aria-selected": !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDemoCompany"])(activeCompanyId) && activeCompanyId === company.id,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex-1 min-w-0",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-medium",
                                                    children: company.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                                    lineNumber: 234,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                                lineNumber: 233,
                                                columnNumber: 21
                                            }, this),
                                            !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDemoCompany"])(activeCompanyId) && activeCompanyId === company.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5 text-blue-500 flex-shrink-0",
                                                fill: "currentColor",
                                                viewBox: "0 0 20 20",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    fillRule: "evenodd",
                                                    d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                                    clipRule: "evenodd"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                                lineNumber: 238,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, company.id, true, {
                                        fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                        lineNumber: 218,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                                lineNumber: 216,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true),
                    companies.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-4 py-8 text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-500",
                            children: isLoading ? "Loading workspaces..." : "No workspaces available"
                        }, void 0, false, {
                            fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                            lineNumber: 259,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                        lineNumber: 258,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
                lineNumber: 153,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/SelectableCompanySwitcher.tsx",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = SelectableCompanySwitcher;
}),
"[project]/app/components/AppNav.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/userIdentity.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companySwitcher$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/companySwitcher.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SelectableCompanySwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/SelectableCompanySwitcher.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$EnvironmentBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/EnvironmentBadge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/demoConstants.ts [app-ssr] (ecmascript)");
"use client";
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
const MANAGEMENT_SECTIONS = [
    {
        label: "Projects",
        links: [
            {
                href: "/dashboard/projects",
                text: "View Projects"
            },
            {
                href: "/dashboard/projects?page=add",
                text: "Add Project"
            },
            {
                href: "/dashboard/projects?page=reports",
                text: "Project Reports"
            }
        ]
    },
    {
        label: "Customers",
        links: [
            {
                href: "/dashboard/customers",
                text: "View Customers"
            },
            {
                href: "/dashboard/customers?page=add",
                text: "Add Customer"
            },
            {
                href: "/dashboard/customers?page=reports",
                text: "Customer Reports"
            }
        ]
    },
    {
        label: "Items",
        links: [
            {
                href: "/dashboard/items",
                text: "View Items"
            },
            {
                href: "/dashboard/items?page=add",
                text: "Add Item"
            },
            {
                href: "/dashboard/items?page=reports",
                text: "Item Reports"
            }
        ]
    },
    {
        label: "Tasks",
        links: [
            {
                href: "/dashboard/tasks",
                text: "View Tasks"
            },
            {
                href: "/dashboard/tasks?page=add",
                text: "Add Task"
            },
            {
                href: "/dashboard/tasks?page=reports",
                text: "Task Reports"
            }
        ]
    },
    {
        label: "Invoices",
        links: [
            {
                href: "/dashboard/invoices",
                text: "View Invoices"
            },
            {
                href: "/dashboard/invoices?page=add",
                text: "Add Invoice"
            },
            {
                href: "/dashboard/invoices?page=reports",
                text: "Invoice Reports"
            }
        ]
    }
];
const FIELD_SECTIONS = [
    {
        label: "Projects",
        links: [
            {
                href: "/dashboard/projects",
                text: "Projects"
            }
        ]
    },
    {
        label: "Tasks",
        links: [
            {
                href: "/dashboard/tasks",
                text: "Tasks"
            }
        ]
    }
];
const PRIMARY_LINKS = [
    {
        href: "/",
        label: "Home"
    },
    {
        href: "/dashboard",
        label: "Dashboard"
    }
];
const AUTH_LINKS = [
    {
        href: "/auth/register",
        label: "Register"
    },
    {
        href: "/auth/login",
        label: "Login"
    },
    {
        href: "/dashboard/setup-company",
        label: "Setup Company"
    }
];
const DEMO_SWITCHES = [
    {
        id: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_ADMIN_USER_ID"],
        label: "Demo admin view",
        helper: "Operations"
    },
    {
        id: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_SUBCONTRACTOR_USER_ID"],
        label: "Demo crew view",
        helper: "Field"
    }
];
function AppNav() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [role, setRole] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(null);
    const [demoUserId, setDemoUserId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(null);
    const [companies, setCompanies] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState([]);
    const [activeCompanyId, setActiveCompanyId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(null);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser().then(({ data })=>{
            setRole(data?.user?.user_metadata?.role || null);
        });
    }, []);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const stored = undefined;
    }, []);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }, []);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        let ignore = false;
        const params = new URLSearchParams();
        const targetId = activeCompanyId ?? (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null);
        if (targetId) params.set("company_id", targetId);
        const query = params.toString();
        fetch(`/api/company${query ? `?${query}` : ""}`).then((res)=>res.ok ? res.json() : Promise.reject(new Error("Failed to load companies"))).then((payload)=>{
            if (ignore) return;
            const list = Array.isArray(payload?.companies) ? payload.companies : payload?.company ? [
                payload.company
            ] : [];
            const normalized = list.map((entry)=>({
                    id: entry?.id ? String(entry.id) : "",
                    name: entry?.name || "Untitled company"
                })).filter((entry)=>entry.id);
            setCompanies(normalized);
            const resolvedId = payload?.company?.id ? String(payload.company.id) : normalized[0]?.id ?? null;
            if (resolvedId && resolvedId !== activeCompanyId) {
                setActiveCompanyId(resolvedId);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companySwitcher$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persistActiveCompanyId"])(resolvedId);
            } else if (!resolvedId && activeCompanyId) {
                setActiveCompanyId(null);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companySwitcher$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persistActiveCompanyId"])(null);
            }
        }).catch(()=>undefined);
        return ()=>{
            ignore = true;
        };
    }, [
        activeCompanyId
    ]);
    function handleDemoSwitch(targetId) {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }
    function handleCompanySelect(companyId) {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }
    const sections = role === "subcontractor" ? FIELD_SECTIONS : MANAGEMENT_SECTIONS;
    // Convert to company options format
    const companyOptions = companies.map((company)=>({
            id: company.id,
            name: company.name,
            isDemo: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDemoCompany"])(company.id)
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "workspace-shell",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
            className: "workspace-sidebar",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-4 py-4 border-b border-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-bold text-gray-900",
                            children: "FieldCost MVP"
                        }, void 0, false, {
                            fileName: "[project]/app/components/AppNav.tsx",
                            lineNumber: 171,
                            columnNumber: 11
                        }, this),
                        activeCompanyId && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoConstants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDemoCompany"])(activeCompanyId) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$EnvironmentBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EnvironmentBadge"], {
                            companyId: activeCompanyId,
                            className: "text-xs"
                        }, void 0, false, {
                            fileName: "[project]/app/components/AppNav.tsx",
                            lineNumber: 173,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/AppNav.tsx",
                    lineNumber: 170,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "workspace-company-switch px-4 py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-xs font-semibold text-gray-600 uppercase mb-2 tracking-wide",
                            children: "Workspace"
                        }, void 0, false, {
                            fileName: "[project]/app/components/AppNav.tsx",
                            lineNumber: 179,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$SelectableCompanySwitcher$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectableCompanySwitcher"], {
                            companies: companyOptions,
                            activeCompanyId: activeCompanyId,
                            onSwitchCompany: handleCompanySelect,
                            showBadge: true
                        }, void 0, false, {
                            fileName: "[project]/app/components/AppNav.tsx",
                            lineNumber: 182,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/AppNav.tsx",
                    lineNumber: 178,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6 w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "workspace-nav-section",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Workspace"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/AppNav.tsx",
                                    lineNumber: 191,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "workspace-nav-links",
                                    children: PRIMARY_LINKS.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: link.href,
                                            "aria-current": pathname === link.href ? "page" : undefined,
                                            children: link.label
                                        }, link.href, false, {
                                            fileName: "[project]/app/components/AppNav.tsx",
                                            lineNumber: 194,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/AppNav.tsx",
                                    lineNumber: 192,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/AppNav.tsx",
                            lineNumber: 190,
                            columnNumber: 11
                        }, this),
                        sections.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "workspace-nav-section",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: section.label
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/AppNav.tsx",
                                        lineNumber: 202,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "workspace-nav-links",
                                        children: section.links.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: link.href,
                                                "aria-current": pathname === link.href ? "page" : undefined,
                                                children: link.text
                                            }, link.href, false, {
                                                fileName: "[project]/app/components/AppNav.tsx",
                                                lineNumber: 205,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/AppNav.tsx",
                                        lineNumber: 203,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, section.label, true, {
                                fileName: "[project]/app/components/AppNav.tsx",
                                lineNumber: 201,
                                columnNumber: 13
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "workspace-nav-section",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Demo"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/AppNav.tsx",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "workspace-nav-links",
                                    children: [
                                        DEMO_SWITCHES.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>handleDemoSwitch(option.id),
                                                className: demoUserId === (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeUserId"])(option.id) ? "active" : undefined,
                                                "aria-pressed": demoUserId === (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeUserId"])(option.id),
                                                children: option.label
                                            }, option.id, false, {
                                                fileName: "[project]/app/components/AppNav.tsx",
                                                lineNumber: 220,
                                                columnNumber: 17
                                            }, this)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/auth/demo-login",
                                            "aria-current": pathname === "/auth/demo-login" ? "page" : undefined,
                                            children: "Demo login"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/AppNav.tsx",
                                            lineNumber: 230,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/demo-signup",
                                            "aria-current": pathname === "/demo-signup" ? "page" : undefined,
                                            children: "Demo signup"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/AppNav.tsx",
                                            lineNumber: 233,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/AppNav.tsx",
                                    lineNumber: 218,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/AppNav.tsx",
                            lineNumber: 216,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "workspace-nav-section",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Account"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/AppNav.tsx",
                                    lineNumber: 239,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "workspace-nav-links",
                                    children: AUTH_LINKS.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: link.href,
                                            "aria-current": pathname === link.href ? "page" : undefined,
                                            children: link.label
                                        }, link.href, false, {
                                            fileName: "[project]/app/components/AppNav.tsx",
                                            lineNumber: 242,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/AppNav.tsx",
                                    lineNumber: 240,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/AppNav.tsx",
                            lineNumber: 238,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/AppNav.tsx",
                    lineNumber: 189,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/AppNav.tsx",
            lineNumber: 169,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/AppNav.tsx",
        lineNumber: 168,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a28cecb3._.js.map