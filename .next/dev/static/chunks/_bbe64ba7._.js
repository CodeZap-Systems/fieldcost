(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/clientUser.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ensureClientUserId",
    ()=>ensureClientUserId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/userIdentity.ts [app-client] (ecmascript)");
"use client";
;
;
async function ensureClientUserId() {
    const hasWindow = ("TURBOPACK compile-time value", "object") !== "undefined";
    const cacheUserId = (value)=>{
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem("demoUserId", value);
        }
    };
    const readCachedUserId = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeUserId"])(localStorage.getItem("demoUserId"), undefined);
    };
    if (hasWindow && localStorage.getItem("demoSession") === "true") {
        const demoCached = readCachedUserId();
        if (demoCached && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDemoUserId"])(demoCached)) {
            return demoCached;
        }
    }
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        if (!error) {
            const derived = data?.user?.user_metadata?.demoUserId || data?.user?.id;
            const resolved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeUserId"])(derived, undefined);
            if (resolved) {
                if (hasWindow && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDemoUserId"])(resolved)) {
                    localStorage.removeItem("demoSession");
                }
                cacheUserId(resolved);
                return resolved;
            }
        }
    } catch (err) {
        console.warn("Unable to resolve Supabase user id", err);
    }
    const cached = readCachedUserId();
    if (cached) {
        return cached;
    }
    cacheUserId(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DEMO_USER_ID"]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_DEMO_USER_ID"];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/demoMockData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDemoCrew",
    ()=>getDemoCrew,
    "getDemoCustomers",
    ()=>getDemoCustomers,
    "getDemoInvoices",
    ()=>getDemoInvoices,
    "getDemoItems",
    ()=>getDemoItems,
    "getDemoProjects",
    ()=>getDemoProjects,
    "getDemoTasks",
    ()=>getDemoTasks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/userIdentity.ts [app-client] (ecmascript)");
;
const ADMIN_KEY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeUserId"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEMO_ADMIN_USER_ID"]);
_c = ADMIN_KEY;
const SUBCONTRACTOR_KEY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeUserId"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEMO_SUBCONTRACTOR_USER_ID"], ADMIN_KEY);
_c1 = SUBCONTRACTOR_KEY;
const resolveKey = (userId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeUserId"])(userId, ADMIN_KEY);
const clone = (payload)=>JSON.parse(JSON.stringify(payload));
const demoProjects = {
    [ADMIN_KEY]: [
        {
            id: 6001,
            name: "Haul Road Rehab",
            description: "Stabilise, widen, and cap the 4 km haul road between pits.",
            photo_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=60",
            demo: true
        },
        {
            id: 6002,
            name: "Process Plant Refurb",
            description: "Replace worn chute liners and recalibrate secondary crushers.",
            photo_url: "https://images.unsplash.com/photo-1457449940276-e8deed18bfff?auto=format&fit=crop&w=600&q=60",
            demo: true
        },
        {
            id: 6003,
            name: "Tailings Storage Lift",
            description: "Raise TSF wall by 3 m with compacted engineered fill.",
            photo_url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=60",
            demo: true
        }
    ],
    [SUBCONTRACTOR_KEY]: [
        {
            id: 6101,
            name: "Drill & Blast Campaign",
            description: "120-hole pattern for north pit pushback.",
            photo_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=60",
            demo: true
        },
        {
            id: 6102,
            name: "Crusher Maintenance Blitz",
            description: "Three-day shutdown to swap liners and bearings.",
            photo_url: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=600&q=60",
            demo: true
        }
    ]
};
const demoCustomers = {
    [ADMIN_KEY]: [
        {
            id: 6201,
            name: "Mbali Civil Works",
            email: "projects@mbali.co.za",
            demo: true
        },
        {
            id: 6202,
            name: "Kopano Mining JV",
            email: "ops@kopanomining.africa",
            demo: true
        },
        {
            id: 6203,
            name: "Sunset Aggregates",
            email: "finance@sunsetagg.co.za",
            demo: true
        }
    ],
    [SUBCONTRACTOR_KEY]: [
        {
            id: 6211,
            name: "Highveld Crushing",
            email: "info@highveldcrushing.co.za",
            demo: true
        },
        {
            id: 6212,
            name: "MoAfrika Minerals",
            email: "admin@moafrika-minerals.co.za",
            demo: true
        }
    ]
};
const demoItems = {
    [ADMIN_KEY]: [
        {
            id: 6301,
            name: "Diesel (50 ppm)",
            price: 24.85,
            stock_in: 18000,
            stock_used: 13200,
            item_type: "physical",
            demo: true
        },
        {
            id: 6302,
            name: "Explosive Pack ANFO (1 t)",
            price: 8650,
            stock_in: 18,
            stock_used: 12,
            item_type: "physical",
            demo: true
        },
        {
            id: 6303,
            name: "On-site Survey Crew (day)",
            price: 7800,
            stock_in: 22,
            stock_used: 15,
            item_type: "service",
            demo: true
        }
    ],
    [SUBCONTRACTOR_KEY]: [
        {
            id: 6311,
            name: "Crusher Specialist Callout",
            price: 12500,
            stock_in: 12,
            stock_used: 6,
            item_type: "service",
            demo: true
        },
        {
            id: 6312,
            name: "Wear Plate Set",
            price: 9800,
            stock_in: 30,
            stock_used: 21,
            item_type: "physical",
            demo: true
        }
    ]
};
const demoCrew = {
    [ADMIN_KEY]: [
        {
            id: 6401,
            name: "Sipho Dlamini",
            hourly_rate: 420,
            demo: true
        },
        {
            id: 6402,
            name: "Lerato Maseko",
            hourly_rate: 395,
            demo: true
        },
        {
            id: 6403,
            name: "Thando Nkosi",
            hourly_rate: 380,
            demo: true
        },
        {
            id: 6404,
            name: "Nomsa Khumalo",
            hourly_rate: 360,
            demo: true
        }
    ],
    [SUBCONTRACTOR_KEY]: [
        {
            id: 6411,
            name: "Neo Mbele",
            hourly_rate: 410,
            demo: true
        },
        {
            id: 6412,
            name: "Kagiso Molefe",
            hourly_rate: 390,
            demo: true
        }
    ]
};
const demoTasks = {
    [ADMIN_KEY]: [
        {
            id: 6501,
            name: "Survey control & pegging",
            description: "Lay out widened alignment and check crossfall.",
            status: "done",
            seconds: 16200,
            assigned_to: "Sipho Dlamini",
            crew_member_id: 6401,
            crew_member: demoCrew[ADMIN_KEY][0],
            billable: true,
            photo_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=60",
            demo: true
        },
        {
            id: 6502,
            name: "Lime stabilisation run 1",
            description: "Blend lime across km 2-3 section.",
            status: "in-progress",
            seconds: 8700,
            assigned_to: "Lerato Maseko",
            crew_member_id: 6402,
            crew_member: demoCrew[ADMIN_KEY][1],
            billable: true,
            demo: true
        },
        {
            id: 6503,
            name: "Chute liner strip-out",
            description: "Remove worn liners on secondary feed chute.",
            status: "done",
            seconds: 20400,
            assigned_to: "Thando Nkosi",
            crew_member_id: 6403,
            crew_member: demoCrew[ADMIN_KEY][2],
            billable: true,
            photo_url: "https://images.unsplash.com/photo-1504280390368-361c6d9f38f4?auto=format&fit=crop&w=400&q=60",
            demo: true
        },
        {
            id: 6504,
            name: "Crusher recalibration",
            description: "Laser align crusher gap before restart.",
            status: "todo",
            seconds: 0,
            billable: false,
            demo: true
        }
    ],
    [SUBCONTRACTOR_KEY]: [
        {
            id: 6511,
            name: "Pattern drilling",
            description: "Complete 120-hole pattern with 165 mm holes.",
            status: "in-progress",
            seconds: 11100,
            assigned_to: "Neo Mbele",
            crew_member_id: 6411,
            crew_member: demoCrew[SUBCONTRACTOR_KEY][0],
            billable: true,
            demo: true
        },
        {
            id: 6512,
            name: "Bearing inspection",
            description: "Inspect main shaft bearings during shutdown.",
            status: "in-progress",
            seconds: 4200,
            assigned_to: "Kagiso Molefe",
            crew_member_id: 6412,
            crew_member: demoCrew[SUBCONTRACTOR_KEY][1],
            billable: false,
            demo: true
        }
    ]
};
const demoInvoices = {
    [ADMIN_KEY]: [
        {
            id: 6601,
            customer_id: 6201,
            customer: {
                id: 6201,
                name: "Mbali Civil Works"
            },
            amount: 485000,
            description: "Progress draw #3 - Haul road stabilisation and survey.",
            reference: "Haul Road Rehab",
            invoice_number: "FC-104",
            issued_on: "2026-02-12",
            due_on: "2026-02-27",
            status: "sent",
            currency: "ZAR",
            line_items: [
                {
                    id: 90001,
                    name: "Survey control",
                    quantity: 3,
                    total: 45000,
                    project: "Haul Road Rehab",
                    note: null,
                    source: "timer",
                    task_ref: "6501"
                },
                {
                    id: 90002,
                    name: "Stabilisation crew",
                    quantity: 2,
                    total: 180000,
                    project: "Haul Road Rehab"
                }
            ],
            demo: true
        },
        {
            id: 6602,
            customer_id: 6202,
            customer: {
                id: 6202,
                name: "Kopano Mining JV"
            },
            amount: 320000,
            description: "Process plant shutdown labour & materials.",
            reference: "Process Plant Refurb",
            invoice_number: "FC-105",
            issued_on: "2026-02-08",
            due_on: "2026-03-04",
            status: "draft",
            currency: "ZAR",
            line_items: [
                {
                    id: 90003,
                    name: "Chute liner strip-out",
                    quantity: 1.5,
                    total: 120000,
                    project: "Process Plant Refurb",
                    task_ref: "6503"
                },
                {
                    id: 90004,
                    name: "Consumables",
                    quantity: 1,
                    total: 20000,
                    project: "Process Plant Refurb"
                }
            ],
            demo: true
        },
        {
            id: 6603,
            customer_id: 6203,
            customer: {
                id: 6203,
                name: "Sunset Aggregates"
            },
            amount: 215000,
            description: "Tailings lift QA services (week 18).",
            reference: "Tailings Storage Lift",
            invoice_number: "FC-106",
            issued_on: "2026-02-01",
            due_on: "2026-02-28",
            status: "paid",
            currency: "ZAR",
            line_items: [
                {
                    id: 90005,
                    name: "QA inspections",
                    quantity: 2,
                    total: 155000,
                    project: "Tailings Storage Lift"
                },
                {
                    id: 90006,
                    name: "Travel & logistics",
                    quantity: 1,
                    total: 60000,
                    project: "Tailings Storage Lift"
                }
            ],
            demo: true
        }
    ],
    [SUBCONTRACTOR_KEY]: [
        {
            id: 6611,
            customer_id: 6211,
            customer: {
                id: 6211,
                name: "Highveld Crushing"
            },
            amount: 155000,
            description: "Crusher blitz callout fee and spares.",
            reference: "Crusher Maintenance Blitz",
            invoice_number: "SC-044",
            issued_on: "2026-02-10",
            due_on: "2026-02-25",
            status: "sent",
            currency: "ZAR",
            line_items: [
                {
                    id: 90011,
                    name: "Specialist callout",
                    quantity: 1,
                    total: 95000,
                    project: "Crusher Maintenance Blitz"
                },
                {
                    id: 90012,
                    name: "Wear parts",
                    quantity: 1,
                    total: 60000
                }
            ],
            demo: true
        },
        {
            id: 6612,
            customer_id: 6212,
            customer: {
                id: 6212,
                name: "MoAfrika Minerals"
            },
            amount: 265000,
            description: "Drill & blast campaign progress payment.",
            reference: "Drill & Blast",
            invoice_number: "SC-045",
            issued_on: "2026-02-05",
            due_on: "2026-03-05",
            status: "draft",
            currency: "ZAR",
            line_items: [
                {
                    id: 90013,
                    name: "Pattern drilling",
                    quantity: 1,
                    total: 165000,
                    task_ref: "6511"
                },
                {
                    id: 90014,
                    name: "Explosive loading",
                    quantity: 1,
                    total: 100000
                }
            ],
            demo: true
        }
    ]
};
function getDemoProjects(userId) {
    const key = resolveKey(userId);
    return clone(demoProjects[key] ?? demoProjects[ADMIN_KEY]);
}
function getDemoCustomers(userId) {
    const key = resolveKey(userId);
    return clone(demoCustomers[key] ?? demoCustomers[ADMIN_KEY]);
}
function getDemoItems(userId) {
    const key = resolveKey(userId);
    return clone(demoItems[key] ?? demoItems[ADMIN_KEY]);
}
function getDemoCrew(userId) {
    const key = resolveKey(userId);
    return clone(demoCrew[key] ?? demoCrew[ADMIN_KEY]);
}
function getDemoTasks(userId) {
    const key = resolveKey(userId);
    return clone(demoTasks[key] ?? demoTasks[ADMIN_KEY]);
}
function getDemoInvoices(userId) {
    const key = resolveKey(userId);
    return clone(demoInvoices[key] ?? demoInvoices[ADMIN_KEY]);
}
var _c, _c1;
__turbopack_context__.k.register(_c, "ADMIN_KEY");
__turbopack_context__.k.register(_c1, "SUBCONTRACTOR_KEY");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dashboard/invoices/InvoiceForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InvoiceForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clientUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/clientUser.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/demoMockData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/userIdentity.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const makeLineId = ()=>typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
const newLineItem = ()=>({
        id: makeLineId(),
        itemId: "",
        quantity: 1,
        projectId: "",
        projectCustom: "",
        note: "",
        source: null,
        taskRef: null
    });
const MIN_TIME_HOURS = 0.25;
const secondsToHours = (seconds)=>{
    if (seconds === null || seconds === undefined) return null;
    const value = Number(seconds);
    if (!Number.isFinite(value) || value <= 0) return null;
    return value / 3600;
};
const formatDurationLabel = (hours)=>{
    const totalMinutes = Math.max(1, Math.round(hours * 60));
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hrs && mins) return `${hrs}h ${mins}m`;
    if (hrs) return `${hrs}h`;
    return `${mins}m`;
};
const normalizeTaskPayload = (payload)=>{
    const id = Number(payload?.id);
    if (!Number.isFinite(id)) return null;
    const seconds = Number(payload?.seconds) || 0;
    let projectIdCandidate = null;
    if (typeof payload?.project_id === "number" && Number.isFinite(payload.project_id)) {
        projectIdCandidate = payload.project_id;
    } else if (typeof payload?.project_id === "string") {
        const parsed = Number(payload.project_id);
        if (Number.isFinite(parsed)) projectIdCandidate = parsed;
    } else if (typeof payload?.project?.id === "number" && Number.isFinite(payload.project.id)) {
        projectIdCandidate = payload.project.id;
    } else if (typeof payload?.project?.id === "string") {
        const parsed = Number(payload.project.id);
        if (Number.isFinite(parsed)) projectIdCandidate = parsed;
    }
    const projectNameCandidate = typeof payload?.project?.name === "string" ? payload.project.name : typeof payload?.project_name === "string" ? payload.project_name : null;
    return {
        id,
        name: typeof payload?.name === "string" && payload.name.trim() ? payload.name : "Tracked task",
        seconds,
        billable: payload?.billable !== false,
        project_id: projectIdCandidate,
        project: projectNameCandidate ? {
            id: projectIdCandidate ?? id * -1,
            name: projectNameCandidate
        } : null
    };
};
function InvoiceForm({ onAdd, preset, companyId }) {
    _s();
    const [customers, setCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [projects, setProjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [customersDemo, setCustomersDemo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [itemsDemo, setItemsDemo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [projectsDemo, setProjectsDemo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tasksDemo, setTasksDemo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedCustomer, setSelectedCustomer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(preset?.customerId ?? "");
    const [reference, setReference] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(preset?.taskName ? `Work completed for task: ${preset.taskName}` : "");
    const presetSeconds = preset?.taskSeconds ? Number(preset.taskSeconds) : null;
    const presetHoursRaw = secondsToHours(presetSeconds);
    const trackedHours = presetHoursRaw ? Math.max(MIN_TIME_HOURS, Number(presetHoursRaw.toFixed(2))) : null;
    const presetProjectIdValue = preset?.taskProjectId ? Number(preset.taskProjectId) : null;
    const hasPresetProjectId = typeof presetProjectIdValue === "number" && Number.isFinite(presetProjectIdValue);
    const presetProjectName = preset?.taskProjectName?.trim() ?? "";
    const [lineItems, setLineItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        newLineItem()
    ]);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        success: "",
        error: ""
    });
    const defaultTimeItemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "InvoiceForm.useMemo[defaultTimeItemId]": ()=>{
            const serviceItem = items.find({
                "InvoiceForm.useMemo[defaultTimeItemId].serviceItem": (item)=>item.item_type === "service"
            }["InvoiceForm.useMemo[defaultTimeItemId].serviceItem"]);
            if (serviceItem) return serviceItem.id;
            const nonPhysical = items.find({
                "InvoiceForm.useMemo[defaultTimeItemId].nonPhysical": (item)=>item.item_type !== "physical"
            }["InvoiceForm.useMemo[defaultTimeItemId].nonPhysical"]);
            return nonPhysical?.id ?? items[0]?.id ?? "";
        }
    }["InvoiceForm.useMemo[defaultTimeItemId]"], [
        items
    ]);
    const convertibleTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "InvoiceForm.useMemo[convertibleTasks]": ()=>tasks.filter({
                "InvoiceForm.useMemo[convertibleTasks]": (task)=>task.billable !== false && Number(task.seconds) > 0
            }["InvoiceForm.useMemo[convertibleTasks]"])
    }["InvoiceForm.useMemo[convertibleTasks]"], [
        tasks
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InvoiceForm.useEffect": ()=>{
            let active = true;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clientUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureClientUserId"])().then({
                "InvoiceForm.useEffect": (id)=>{
                    if (active) setUserId(id);
                }
            }["InvoiceForm.useEffect"]).catch({
                "InvoiceForm.useEffect": ()=>{
                    if (active) setStatus({
                        success: "",
                        error: "Unable to resolve workspace user."
                    });
                }
            }["InvoiceForm.useEffect"]);
            return ({
                "InvoiceForm.useEffect": ()=>{
                    active = false;
                }
            })["InvoiceForm.useEffect"];
        }
    }["InvoiceForm.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InvoiceForm.useEffect": ()=>{
            if (!userId) return;
            const allowDemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canUseDemoFixtures"])(userId);
            async function load() {
                try {
                    const qs = new URLSearchParams({
                        user_id: userId
                    });
                    if (companyId) qs.set('company_id', companyId);
                    const [custRes, itemRes, projectRes, taskRes] = await Promise.all([
                        fetch(`/api/customers?${qs.toString()}`),
                        fetch(`/api/items?${qs.toString()}`),
                        fetch(`/api/projects?${qs.toString()}`),
                        fetch(`/api/tasks?${qs.toString()}`)
                    ]);
                    const [custPayload, itemPayload, projectPayload, taskPayload] = await Promise.all([
                        custRes.ok ? custRes.json() : Promise.resolve([]),
                        itemRes.ok ? itemRes.json() : Promise.resolve([]),
                        projectRes.ok ? projectRes.json() : Promise.resolve([]),
                        taskRes.ok ? taskRes.json() : Promise.resolve([])
                    ]);
                    const custList = Array.isArray(custPayload) ? custPayload : [];
                    if (custList.length) {
                        setCustomers(custList);
                        setCustomersDemo(false);
                    } else if (allowDemo) {
                        setCustomers((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoCustomers"])(userId));
                        setCustomersDemo(true);
                    } else {
                        setCustomers([]);
                        setCustomersDemo(false);
                    }
                    const itemList = Array.isArray(itemPayload) ? itemPayload : [];
                    if (itemList.length) {
                        setItems(itemList);
                        setItemsDemo(false);
                    } else if (allowDemo) {
                        setItems((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoItems"])(userId));
                        setItemsDemo(true);
                    } else {
                        setItems([]);
                        setItemsDemo(false);
                    }
                    const projectList = Array.isArray(projectPayload) ? projectPayload : [];
                    if (projectList.length) {
                        setProjects(projectList);
                        setProjectsDemo(false);
                    } else if (allowDemo) {
                        setProjects((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoProjects"])(userId));
                        setProjectsDemo(true);
                    } else {
                        setProjects([]);
                        setProjectsDemo(false);
                    }
                    const rawTasks = Array.isArray(taskPayload) ? taskPayload : [];
                    const normalizedTasks = rawTasks.map(normalizeTaskPayload).filter({
                        "InvoiceForm.useEffect.load.normalizedTasks": (task)=>Boolean(task)
                    }["InvoiceForm.useEffect.load.normalizedTasks"]);
                    if (normalizedTasks.length) {
                        setTasks(normalizedTasks);
                        setTasksDemo(false);
                    } else if (allowDemo) {
                        const demoTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoTasks"])(userId).map(normalizeTaskPayload).filter(Boolean);
                        setTasks(demoTasks);
                        setTasksDemo(true);
                    } else {
                        setTasks([]);
                        setTasksDemo(false);
                    }
                } catch  {
                    if (allowDemo) {
                        setCustomers((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoCustomers"])(userId));
                        setItems((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoItems"])(userId));
                        setProjects((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoProjects"])(userId));
                        const demoTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoTasks"])(userId).map(normalizeTaskPayload).filter(Boolean);
                        setTasks(demoTasks);
                        setCustomersDemo(true);
                        setItemsDemo(true);
                        setProjectsDemo(true);
                        setTasksDemo(true);
                    } else {
                        setCustomers([]);
                        setItems([]);
                        setProjects([]);
                        setTasks([]);
                        setCustomersDemo(false);
                        setItemsDemo(false);
                        setProjectsDemo(false);
                        setTasksDemo(false);
                    }
                    setStatus({
                        success: "",
                        error: "Failed to load workspace data."
                    });
                }
            }
            load();
        }
    }["InvoiceForm.useEffect"], [
        userId,
        companyId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InvoiceForm.useEffect": ()=>{
            if (preset?.customerId) {
                // eslint-disable-next-line react-hooks/set-state-in-effect -- keep form selection aligned when launching from task context
                setSelectedCustomer(preset.customerId);
            }
        }
    }["InvoiceForm.useEffect"], [
        preset?.customerId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InvoiceForm.useEffect": ()=>{
            if (!preset?.taskId || !trackedHours) return;
            // eslint-disable-next-line react-hooks/set-state-in-effect -- inject timer-sourced line items based on external task data
            setLineItems({
                "InvoiceForm.useEffect": (prev)=>{
                    const hasTimerLine = prev.some({
                        "InvoiceForm.useEffect.hasTimerLine": (line)=>line.source === "timer" && line.taskRef === preset.taskId
                    }["InvoiceForm.useEffect.hasTimerLine"]);
                    if (hasTimerLine) return prev;
                    const single = prev[0];
                    const isSingleBlank = prev.length === 1 && !single.itemId && single.quantity === 1 && !single.note && (single.projectId === "" || single.projectId === undefined) && !single.projectCustom;
                    const remainder = isSingleBlank ? [] : prev;
                    const timerLine = {
                        ...newLineItem(),
                        itemId: defaultTimeItemId || "",
                        quantity: trackedHours,
                        projectId: hasPresetProjectId ? presetProjectIdValue : presetProjectName ? "__custom__" : "",
                        projectCustom: hasPresetProjectId ? "" : presetProjectName,
                        note: `Auto time from ${preset.taskName ?? "task"} (${formatDurationLabel(trackedHours)})`,
                        source: "timer",
                        taskRef: preset.taskId
                    };
                    return [
                        timerLine,
                        ...remainder
                    ];
                }
            }["InvoiceForm.useEffect"]);
        }
    }["InvoiceForm.useEffect"], [
        preset?.taskId,
        preset?.taskName,
        trackedHours,
        hasPresetProjectId,
        presetProjectIdValue,
        presetProjectName,
        defaultTimeItemId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InvoiceForm.useEffect": ()=>{
            if (!items.length) return;
            // eslint-disable-next-line react-hooks/set-state-in-effect -- attach default item to auto-generated timer rows
            setLineItems({
                "InvoiceForm.useEffect": (prev)=>prev.map({
                        "InvoiceForm.useEffect": (line)=>{
                            if (line.source === "timer" && !line.itemId) {
                                return {
                                    ...line,
                                    itemId: defaultTimeItemId || items[0].id
                                };
                            }
                            return line;
                        }
                    }["InvoiceForm.useEffect"])
            }["InvoiceForm.useEffect"]);
        }
    }["InvoiceForm.useEffect"], [
        items,
        defaultTimeItemId
    ]);
    const totals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "InvoiceForm.useMemo[totals]": ()=>{
            return lineItems.map({
                "InvoiceForm.useMemo[totals]": (item)=>{
                    const match = items.find({
                        "InvoiceForm.useMemo[totals].match": (i)=>i.id === item.itemId
                    }["InvoiceForm.useMemo[totals].match"]);
                    const price = match?.price || 0;
                    return price * (item.quantity || 0);
                }
            }["InvoiceForm.useMemo[totals]"]);
        }
    }["InvoiceForm.useMemo[totals]"], [
        items,
        lineItems
    ]);
    const grandTotal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "InvoiceForm.useMemo[grandTotal]": ()=>totals.reduce({
                "InvoiceForm.useMemo[grandTotal]": (sum, value)=>sum + value
            }["InvoiceForm.useMemo[grandTotal]"], 0)
    }["InvoiceForm.useMemo[grandTotal]"], [
        totals
    ]);
    function updateLine(id, field, value) {
        setLineItems((prev)=>prev.map((line)=>line.id === id ? {
                    ...line,
                    [field]: value
                } : line));
    }
    function addLine() {
        setLineItems((prev)=>[
                ...prev,
                newLineItem()
            ]);
    }
    function removeLine(id) {
        setLineItems((prev)=>prev.length === 1 ? prev : prev.filter((line)=>line.id !== id));
    }
    function resolveProjectLabel(line) {
        if (line.projectId === "__custom__") {
            return line.projectCustom?.trim() || null;
        }
        if (typeof line.projectId === "number" && Number.isFinite(line.projectId)) {
            const match = projects.find((project)=>project.id === line.projectId);
            return match?.name ?? null;
        }
        return null;
    }
    function addTaskToInvoice(task) {
        const hours = secondsToHours(task.seconds);
        if (!hours) {
            setStatus({
                success: "",
                error: "This task has no tracked time yet."
            });
            return;
        }
        const normalizedHours = Math.max(MIN_TIME_HOURS, Number(hours.toFixed(2)));
        let added = false;
        setLineItems((prev)=>{
            if (prev.some((line)=>line.source === "timer" && line.taskRef === String(task.id))) {
                return prev;
            }
            added = true;
            const projectId = typeof task.project_id === "number" ? task.project_id : null;
            const projectName = task.project?.name ?? null;
            const timerLine = {
                ...newLineItem(),
                itemId: defaultTimeItemId || "",
                quantity: normalizedHours,
                projectId: projectId ?? (projectName ? "__custom__" : ""),
                projectCustom: projectId ? "" : projectName ?? "",
                note: `Time from ${task.name} (${formatDurationLabel(normalizedHours)})`,
                source: "timer",
                taskRef: String(task.id)
            };
            return [
                timerLine,
                ...prev
            ];
        });
        if (added) {
            setStatus({
                success: `Added ${task.name} to the invoice.`,
                error: ""
            });
        } else {
            setStatus({
                success: "",
                error: "That task is already on the invoice."
            });
        }
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setStatus({
            success: "",
            error: ""
        });
        if (customersDemo || itemsDemo) {
            setStatus({
                success: "",
                error: "Demo data is read-only. Connect your workspace to send live invoices."
            });
            return;
        }
        if (!selectedCustomer) {
            setStatus({
                success: "",
                error: "Select a customer."
            });
            return;
        }
        const validLines = lineItems.filter((line)=>line.itemId && line.quantity > 0);
        if (!validLines.length) {
            setStatus({
                success: "",
                error: "Add at least one billable line."
            });
            return;
        }
        const customerMeta = customers.find((c)=>`${c.id}` === selectedCustomer);
        const customerId = customerMeta?.id ? Number(customerMeta.id) : Number(selectedCustomer);
        const customerName = customerMeta?.name;
        if (!customerName || !Number.isFinite(customerId)) {
            setStatus({
                success: "",
                error: "Customer not found."
            });
            return;
        }
        if (!userId) {
            setStatus({
                success: "",
                error: "Unable to determine workspace."
            });
            return;
        }
        const detailedLines = validLines.map((line)=>{
            const match = items.find((i)=>i.id === line.itemId);
            const rate = match?.price || 0;
            const total = rate * line.quantity;
            const projectLabel = resolveProjectLabel(line);
            return {
                itemId: match?.id ?? (typeof line.itemId === "number" ? line.itemId : null),
                itemName: match?.name ?? "Item",
                quantity: line.quantity,
                rate,
                total,
                project: projectLabel,
                note: line.note || null,
                source: line.source || null,
                taskRef: line.taskRef || null
            };
        });
        const breakdown = validLines.map((line)=>{
            const match = items.find((i)=>i.id === line.itemId);
            const price = match?.price || 0;
            const total = price * line.quantity;
            const projectLabel = resolveProjectLabel(line);
            const projectTag = projectLabel ? ` • Project: ${projectLabel}` : "";
            const noteTag = line.note ? ` — ${line.note}` : "";
            return `${match?.name ?? "Item"} x${line.quantity} @ R${price.toFixed(2)} = R${total.toFixed(2)}${projectTag}${noteTag}`;
        }).join("\n");
        const narrative = [
            reference.trim(),
            breakdown
        ].filter(Boolean).join("\n\n");
        const ok = await onAdd({
            customerId,
            customerName,
            amount: grandTotal,
            description: narrative,
            reference,
            userId,
            lines: detailedLines
        });
        if (ok) {
            setStatus({
                success: "Invoice added!",
                error: ""
            });
            setLineItems([
                newLineItem()
            ]);
            setReference("");
            if (!preset?.customerId) setSelectedCustomer("");
        } else {
            setStatus({
                success: "",
                error: "Failed to add invoice."
            });
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "bg-white rounded shadow-md p-6 w-full flex flex-col gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold",
                        children: "Create Invoice"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 473,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500",
                        children: "Pull items directly from your price list and tag the project per line."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 474,
                        columnNumber: 9
                    }, this),
                    (customersDemo || itemsDemo) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-xs text-amber-700",
                        children: "Sample customers/items are shown for demo purposes. Add your own data to enable submissions."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 476,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                lineNumber: 472,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: "Customer"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                lineNumber: 482,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: "border p-2 rounded w-full",
                                value: selectedCustomer,
                                onChange: (e)=>setSelectedCustomer(e.target.value),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Select customer"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                        lineNumber: 488,
                                        columnNumber: 13
                                    }, this),
                                    customers.map((customer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: customer.id,
                                            disabled: customer.demo,
                                            children: [
                                                customer.name,
                                                customer.demo ? " (demo)" : ""
                                            ]
                                        }, customer.id, true, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 490,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                lineNumber: 483,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 481,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: "Reference"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                lineNumber: 498,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "border p-2 rounded w-full",
                                placeholder: "e.g. Progress draw #3",
                                value: reference,
                                onChange: (e)=>setReference(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                lineNumber: 499,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 497,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                lineNumber: 480,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold",
                                children: "Line items"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                lineNumber: 510,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "text-indigo-600 font-medium",
                                onClick: addLine,
                                children: "+ Add line"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                lineNumber: 511,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 509,
                        columnNumber: 9
                    }, this),
                    lineItems.map((line, idx)=>{
                        const lineTotal = totals[idx] || 0;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border rounded-lg p-4 grid grid-cols-1 md:grid-cols-6 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "md:col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-semibold mb-1 block",
                                            children: "Item"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 518,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "border rounded w-full p-2",
                                            value: line.itemId,
                                            onChange: (e)=>updateLine(line.id, "itemId", e.target.value ? Number(e.target.value) : ""),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "Select item"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                                    lineNumber: 524,
                                                    columnNumber: 19
                                                }, this),
                                                items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: item.id,
                                                        disabled: item.demo,
                                                        children: [
                                                            item.name,
                                                            " — R",
                                                            item.price?.toFixed(2),
                                                            item.demo ? " (demo)" : ""
                                                        ]
                                                    }, item.id, true, {
                                                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                                        lineNumber: 526,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 519,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                    lineNumber: 517,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-semibold mb-1 block",
                                            children: "Qty"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 533,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            min: "0.25",
                                            step: "0.25",
                                            className: "border rounded w-full p-2",
                                            value: line.quantity,
                                            onChange: (e)=>updateLine(line.id, "quantity", Number(e.target.value))
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 534,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                    lineNumber: 532,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-semibold mb-1 block",
                                            children: "Project"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 544,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "border rounded w-full p-2",
                                            value: line.projectId === "__custom__" ? "__custom__" : line.projectId === "" ? "" : String(line.projectId),
                                            onChange: (e)=>{
                                                const raw = e.target.value;
                                                setLineItems((prev)=>prev.map((entry)=>{
                                                        if (entry.id !== line.id) return entry;
                                                        if (raw === "__custom__") {
                                                            return {
                                                                ...entry,
                                                                projectId: "__custom__"
                                                            };
                                                        }
                                                        if (raw === "") {
                                                            return {
                                                                ...entry,
                                                                projectId: "",
                                                                projectCustom: ""
                                                            };
                                                        }
                                                        const numeric = Number(raw);
                                                        if (!Number.isFinite(numeric)) return entry;
                                                        return {
                                                            ...entry,
                                                            projectId: numeric,
                                                            projectCustom: ""
                                                        };
                                                    }));
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "Unassigned"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                                    lineNumber: 572,
                                                    columnNumber: 19
                                                }, this),
                                                projects.map((project)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: project.id,
                                                        disabled: project.demo,
                                                        children: [
                                                            project.name,
                                                            project.demo ? " (demo)" : ""
                                                        ]
                                                    }, project.id, true, {
                                                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                                        lineNumber: 574,
                                                        columnNumber: 21
                                                    }, this)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "__custom__",
                                                    children: "Manual entry…"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                                    lineNumber: 579,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 545,
                                            columnNumber: 17
                                        }, this),
                                        line.projectId === "__custom__" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "mt-2 border rounded w-full p-2",
                                            placeholder: "Project name",
                                            value: line.projectCustom,
                                            onChange: (e)=>updateLine(line.id, "projectCustom", e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 582,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                    lineNumber: 543,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "md:col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-semibold mb-1 block",
                                            children: "Notes"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 591,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "border rounded w-full p-2",
                                            placeholder: "Extra detail",
                                            value: line.note,
                                            onChange: (e)=>updateLine(line.id, "note", e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 592,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                    lineNumber: 590,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs uppercase text-gray-500",
                                            children: "Line total"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 600,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-lg font-semibold",
                                            children: [
                                                "R",
                                                lineTotal.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 601,
                                            columnNumber: 17
                                        }, this),
                                        lineItems.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "text-red-500 text-xs",
                                            onClick: ()=>removeLine(line.id),
                                            children: "Remove"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 603,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                    lineNumber: 599,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, line.id, true, {
                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                            lineNumber: 516,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                lineNumber: 508,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-1 md:flex-row md:items-center md:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-base font-semibold text-slate-900",
                                        children: "Convert tracked tasks"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                        lineNumber: 614,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-slate-600",
                                        children: "Use saved timer entries to create service lines without retyping hours."
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                        lineNumber: 615,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                lineNumber: 613,
                                columnNumber: 11
                            }, this),
                            convertibleTasks.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-slate-500",
                                children: [
                                    "Showing ",
                                    Math.min(convertibleTasks.length, 6),
                                    " of ",
                                    convertibleTasks.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                lineNumber: 618,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 612,
                        columnNumber: 9
                    }, this),
                    convertibleTasks.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 space-y-3",
                        children: [
                            convertibleTasks.slice(0, 6).map((task)=>{
                                const hoursValue = secondsToHours(task.seconds) || 0;
                                const normalizedHours = hoursValue ? Math.max(MIN_TIME_HOURS, Number(hoursValue.toFixed(2))) : 0;
                                const durationLabel = hoursValue ? formatDurationLabel(normalizedHours) : "0m";
                                const projectLabel = task.project?.name;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-medium text-slate-900",
                                                    children: task.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                                    lineNumber: 634,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-slate-500",
                                                    children: [
                                                        durationLabel,
                                                        projectLabel ? ` • ${projectLabel}` : ""
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                                    lineNumber: 635,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 633,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "self-start rounded border border-indigo-200 px-3 py-1 text-sm font-semibold text-indigo-700 hover:bg-indigo-50",
                                            onClick: ()=>addTaskToInvoice(task),
                                            children: "Add to invoice"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 640,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, task.id, true, {
                                    fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                    lineNumber: 629,
                                    columnNumber: 17
                                }, this);
                            }),
                            convertibleTasks.length > 6 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-slate-500",
                                children: "More tasks available — convert the rest from the Tasks screen."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                lineNumber: 651,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 622,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-sm text-slate-600",
                        children: "No billable tasks with tracked time yet."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 655,
                        columnNumber: 11
                    }, this),
                    tasksDemo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-xs text-amber-700",
                        children: "Demo tasks are shown for illustration. Add live tasks to invoice them."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 658,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                lineNumber: 611,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between border-t pt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500",
                                children: "Actual spend"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                lineNumber: 664,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-2xl font-bold",
                                children: [
                                    "R",
                                    grandTotal.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                lineNumber: 665,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 663,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold",
                        type: "submit",
                        children: "Create invoice"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 667,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                lineNumber: 662,
                columnNumber: 7
            }, this),
            status.success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-green-600 text-sm",
                children: status.success
            }, void 0, false, {
                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                lineNumber: 670,
                columnNumber: 26
            }, this),
            status.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-600 text-sm",
                children: status.error
            }, void 0, false, {
                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                lineNumber: 671,
                columnNumber: 24
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
        lineNumber: 471,
        columnNumber: 5
    }, this);
}
_s(InvoiceForm, "uk5CT941xlcgzj2Bxi9MhvRS5WI=");
_c = InvoiceForm;
var _c;
__turbopack_context__.k.register(_c, "InvoiceForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/invoicePDF.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Invoice PDF Generator
 * Creates a formatted invoice PDF with proper layout
 */ __turbopack_context__.s([
    "downloadInvoicePDF",
    ()=>downloadInvoicePDF,
    "exportInvoiceAsPDF",
    ()=>exportInvoiceAsPDF,
    "generateInvoicePDF",
    ()=>generateInvoicePDF
]);
function generateInvoicePDF(data) {
    // Create HTML invoice template
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${data.invoiceNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          color: #333;
          background: white;
          line-height: 1.4;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 30px;
          background: white;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 3px solid #1e40af;
        }
        .company-info h1 {
          font-size: 22px;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 3px;
        }
        .company-info p {
          font-size: 12px;
          color: #666;
        }
        .invoice-details {
          text-align: right;
        }
        .invoice-details h2 {
          font-size: 26px;
          color: #1e40af;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .invoice-details p {
          color: #666;
          font-size: 12px;
          margin: 2px 0;
        }
        .section-title {
          font-size: 11px;
          font-weight: 700;
          color: #333;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .bill-to {
          margin-bottom: 25px;
          font-size: 13px;
        }
        .bill-to p {
          margin: 2px 0;
        }
        table {
          width: 100%;
          margin: 25px 0;
          border-collapse: collapse;
        }
        thead tr {
          background: #1e40af;
          color: white;
        }
        th {
          padding: 10px 8px;
          text-align: left;
          font-weight: 700;
          font-size: 11px;
          border: none;
        }
        td {
          padding: 9px 8px;
          border-bottom: 1px solid #ddd;
          font-size: 12px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        tbody tr:nth-child(even) {
          background: #f9fafb;
        }
        tbody tr:last-child td {
          border-bottom: 2px solid #1e40af;
        }
        .col-desc { width: 45%; text-align: left; }
        .col-qty { width: 8%; text-align: center; }
        .col-price { width: 15%; text-align: right; }
        .col-discount { width: 10%; text-align: right; }
        .col-tax { width: 10%; text-align: right; }
        .col-total { width: 12%; text-align: right; font-weight: 600; }
        .total-section {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
        }
        .total-table {
          width: 380px;
        }
        .total-table td {
          padding: 8px 10px;
          border: none;
          font-size: 12px;
        }
        .total-table .label {
          text-align: right;
          font-weight: 600;
          width: 60%;
        }
        .total-table .amount {
          text-align: right;
          width: 40%;
          font-weight: 600;
        }
        .grand-total-row td {
          background: #f0f4ff !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          color: #1e40af !important;
        }
        .notes {
          margin-top: 30px;
          padding: 12px;
          background: #f9fafb;
          border-left: 4px solid #1e40af;
          font-size: 12px;
        }
        .notes h3 {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 6px;
          color: #333;
        }
        .notes p {
          color: #666;
        }
        .footer {
          margin-top: 40px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 11px;
          color: #999;
        }
        @media print {
          body { background: white; margin: 0; padding: 0; }
          .container { padding: 20px; max-width: 100%; }
          .footer { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="company-info">
            <h1>${data.companyName || 'Company Name'}</h1>
            <p>Professional Services</p>
          </div>
          <div class="invoice-details">
            <h2>INVOICE</h2>
            <p><strong>${data.invoiceNumber}</strong></p>
            <p>Date: ${data.date}</p>
            <p>Due: ${data.dueDate}</p>
          </div>
        </div>

        <!-- Bill To -->
        <div class="bill-to">
          <p class="section-title">Bill To:</p>
          <p><strong>${data.customerName}</strong></p>
        </div>

        <!-- Line Items Table -->
        <table>
          <thead>
            <tr>
              <th class="col-desc">Description</th>
              <th class="col-qty">Qty</th>
              <th class="col-price">Unit Price</th>
              <th class="col-discount">Discount %</th>
              <th class="col-tax">Tax %</th>
              <th class="col-total">Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.lineItems.map((item)=>`
              <tr>
                <td class="col-desc">${item.description}</td>
                <td class="col-qty">${item.quantity}</td>
                <td class="col-price">${data.currency}${item.rate.toFixed(2)}</td>
                <td class="col-discount">0%</td>
                <td class="col-tax">0%</td>
                <td class="col-total">${data.currency}${item.total.toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <!-- Totals -->
        <div class="total-section">
          <table class="total-table">
            <tr>
              <td class="label">Subtotal:</td>
              <td class="amount">${data.currency}${data.amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td class="label">Discount:</td>
              <td class="amount">${data.currency}0.00</td>
            </tr>
            <tr>
              <td class="label">Tax:</td>
              <td class="amount">${data.currency}0.00</td>
            </tr>
            <tr class="grand-total-row">
              <td class="label">Total Due:</td>
              <td class="amount">${data.currency}${data.amount.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        ${data.notes ? `
        <!-- Notes -->
        <div class="notes">
          <h3>Notes</h3>
          <p>${data.notes}</p>
        </div>
        ` : ""}

        <!-- Footer -->
        <div class="footer">
          <p>Thank you for your business</p>
          <p>Invoice generated on ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
    return html;
}
function downloadInvoicePDF(data) {
    const htmlContent = generateInvoicePDF(data);
    const blob = new Blob([
        htmlContent
    ], {
        type: "text/html"
    });
    const url = URL.createObjectURL(blob);
    const window_print = window.open(url, "_blank");
    if (window_print) {
        window_print.addEventListener("load", ()=>{
            window_print.print();
        });
    }
}
function exportInvoiceAsPDF(data) {
    const htmlContent = generateInvoicePDF(data);
    const dataUri = `data:text/html,${encodeURIComponent(htmlContent)}`;
    const link = document.createElement("a");
    link.href = dataUri;
    link.download = `Invoice-${data.invoiceNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/BackButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BackButton",
    ()=>BackButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function BackButton({ label = "← Back", className = "" }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: ()=>router.back(),
        className: `
        inline-flex items-center gap-2 px-4 py-2 
        bg-gray-100 hover:bg-gray-200 
        text-gray-700 rounded-lg 
        font-medium transition-colors
        ${className}
      `,
        children: label
    }, void 0, false, {
        fileName: "[project]/app/components/BackButton.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_s(BackButton, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = BackButton;
var _c;
__turbopack_context__.k.register(_c, "BackButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dashboard/invoices/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InvoicesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$invoices$2f$InvoiceForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dashboard/invoices/InvoiceForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoicePDF$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/invoicePDF.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$BackButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/BackButton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clientUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/clientUser.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/demoMockData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/userIdentity.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companySwitcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/companySwitcher.ts [app-client] (ecmascript)");
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
;
;
;
function InvoicesPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-8 text-gray-600",
            children: "Loading invoice workspace…"
        }, void 0, false, {
            fileName: "[project]/app/dashboard/invoices/page.tsx",
            lineNumber: 30,
            columnNumber: 25
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InvoicesPageContent, {}, void 0, false, {
            fileName: "[project]/app/dashboard/invoices/page.tsx",
            lineNumber: 31,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/dashboard/invoices/page.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
_c = InvoicesPage;
function InvoicesPageContent() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const preset = {
        customerId: searchParams.get("customerId"),
        taskId: searchParams.get("fromTask"),
        taskName: searchParams.get("taskName"),
        taskSeconds: searchParams.get("taskSeconds"),
        taskProjectId: searchParams.get("taskProjectId"),
        taskProjectName: searchParams.get("taskProjectName")
    };
    const [invoices, setInvoices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [companyId, setCompanyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [usingDemoData, setUsingDemoData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [offlineCount, setOfflineCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [syncMessage, setSyncMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [syncing, setSyncing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [exporting, setExporting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedIds, setSelectedIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pdfTemplate, setPdfTemplate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("standard");
    const allowDemoData = userId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canUseDemoFixtures"])(userId) : false;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InvoicesPageContent.useEffect": ()=>{
            let active = true;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clientUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureClientUserId"])().then({
                "InvoicesPageContent.useEffect": (id)=>{
                    if (active) setUserId(id);
                }
            }["InvoicesPageContent.useEffect"]).catch({
                "InvoicesPageContent.useEffect": ()=>{
                    if (active) setError("Unable to resolve workspace user.");
                }
            }["InvoicesPageContent.useEffect"]);
            return ({
                "InvoicesPageContent.useEffect": ()=>{
                    active = false;
                }
            })["InvoicesPageContent.useEffect"];
        }
    }["InvoicesPageContent.useEffect"], []);
    // Load active company ID
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InvoicesPageContent.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            setCompanyId((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companySwitcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readActiveCompanyId"])());
        }
    }["InvoicesPageContent.useEffect"], []);
    const loadInvoices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InvoicesPageContent.useCallback[loadInvoices]": async ({ quiet = false } = {})=>{
            if (!userId) return;
            const allowDemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canUseDemoFixtures"])(userId);
            if (!quiet) setLoading(true);
            setError(null);
            try {
                const qs = new URLSearchParams({
                    user_id: userId
                });
                if (companyId) qs.set('company_id', companyId);
                const res = await fetch(`/api/invoices?${qs.toString()}`);
                if (!res.ok) throw new Error("Failed to load");
                const data = await res.json();
                const list = Array.isArray(data) ? data : [];
                if (list.length) {
                    setInvoices(list);
                    setUsingDemoData(false);
                } else {
                    // Only show demo data if user is demo user AND no company selected
                    if (allowDemo && !companyId) {
                        setInvoices((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoInvoices"])(userId));
                        setUsingDemoData(true);
                    } else {
                        setInvoices([]);
                        setUsingDemoData(false);
                    }
                }
                setOfflineCount(list.filter({
                    "InvoicesPageContent.useCallback[loadInvoices]": (inv)=>inv.offline
                }["InvoicesPageContent.useCallback[loadInvoices]"]).length);
            } catch  {
                if (allowDemo) {
                    setInvoices((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoInvoices"])(userId));
                    setUsingDemoData(true);
                } else {
                    setInvoices([]);
                    setUsingDemoData(false);
                }
                setOfflineCount(0);
                setError("Failed to load invoices");
            } finally{
                if (!quiet) setLoading(false);
            }
        }
    }["InvoicesPageContent.useCallback[loadInvoices]"], [
        userId,
        companyId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InvoicesPageContent.useEffect": ()=>{
            if (!userId) return;
            loadInvoices();
        }
    }["InvoicesPageContent.useEffect"], [
        userId,
        loadInvoices
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InvoicesPageContent.useEffect": ()=>{
            setSelectedIds({
                "InvoicesPageContent.useEffect": (prev)=>prev.filter({
                        "InvoicesPageContent.useEffect": (id)=>invoices.some({
                                "InvoicesPageContent.useEffect": (inv)=>inv.id === id && !inv.demo
                            }["InvoicesPageContent.useEffect"])
                    }["InvoicesPageContent.useEffect"])
            }["InvoicesPageContent.useEffect"]);
        }
    }["InvoicesPageContent.useEffect"], [
        invoices
    ]);
    async function handleAdd(invoice) {
        if (!invoice.userId) {
            setError("Workspace context missing for invoice.");
            return false;
        }
        setLoading(true);
        setError(null);
        setSyncMessage(null);
        try {
            const res = await fetch("/api/invoices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    customer_id: invoice.customerId,
                    amount: invoice.amount,
                    description: invoice.description,
                    reference: invoice.reference,
                    lines: invoice.lines,
                    user_id: invoice.userId,
                    company_id: companyId
                })
            });
            if (!res.ok) throw new Error("Failed to add invoice");
            const newInvoice = await res.json();
            if (newInvoice?.offline) {
                setSyncMessage("Invoice saved offline. Use Sync to push it once Supabase is ready.");
            } else {
                setSyncMessage("Invoice saved successfully.");
            }
            await loadInvoices({
                quiet: true
            });
            return true;
        } catch  {
            setError("Failed to add invoice");
            return false;
        } finally{
            setLoading(false);
        }
    }
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editData, setEditData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        amount: 0,
        description: ""
    });
    function handleEdit(inv) {
        if (inv.demo) {
            setError("Demo invoices are read-only.");
            return;
        }
        setEditing(inv.id);
        setEditData({
            amount: inv.amount,
            description: inv.description || ""
        });
    }
    async function handleUpdate(e) {
        e.preventDefault();
        if (!userId) {
            setError("Workspace context missing for update.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/invoices", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: editing,
                    amount: editData.amount,
                    description: editData.description,
                    user_id: userId
                })
            });
            if (!res.ok) throw new Error("Failed to update invoice");
            await res.json();
            await loadInvoices({
                quiet: true
            });
            setSyncMessage("Invoice updated.");
            setEditing(null);
            setEditData({
                amount: 0,
                description: ""
            });
        } catch  {
            setError("Failed to update invoice");
        } finally{
            setLoading(false);
        }
    }
    async function handleDelete(id) {
        if (!userId) {
            setError("Workspace context missing for delete.");
            return;
        }
        if (invoices.find((inv)=>inv.id === id)?.demo) {
            setError("Demo invoices are read-only.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/invoices", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id,
                    user_id: userId
                })
            });
            if (!res.ok) throw new Error("Failed to delete invoice");
            await loadInvoices({
                quiet: true
            });
            setSelectedIds((prev)=>prev.filter((selected)=>selected !== id));
            setSyncMessage("Invoice removed.");
        } catch  {
            setError("Failed to delete invoice");
        } finally{
            setLoading(false);
        }
    }
    async function handleSyncOffline() {
        if (!userId) {
            setError("Workspace context missing for sync.");
            return;
        }
        setSyncing(true);
        setError(null);
        setSyncMessage(null);
        try {
            const res = await fetch("/api/invoices/sync", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: userId
                })
            });
            if (!res.ok) throw new Error("Failed to sync invoices");
            const payload = await res.json();
            if (payload.error) throw new Error(payload.error);
            if (payload.synced) {
                setSyncMessage(`Synced ${payload.synced} offline invoice${payload.synced === 1 ? "" : "s"}.`);
            } else {
                setSyncMessage("No offline invoices queued.");
            }
            await loadInvoices({
                quiet: true
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to sync invoices";
            setError(message);
        } finally{
            setSyncing(false);
        }
    }
    async function handleExport(format) {
        if (!userId) {
            setError("Workspace context missing for export.");
            return;
        }
        if (usingDemoData) {
            setError("Demo invoices cannot be exported.");
            return;
        }
        setExporting(format);
        setError(null);
        try {
            const params = new URLSearchParams({
                format,
                user_id: userId
            });
            if (selectedIds.length) {
                params.set("ids", selectedIds.join(","));
            }
            if (format === "pdf") {
                params.set("template", pdfTemplate);
            }
            const res = await fetch(`/api/invoices/export?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to export invoices");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            const extension = format === "pdf" ? "pdf" : "csv";
            anchor.download = `invoices-${format}-${Date.now()}.${extension}`;
            anchor.click();
            URL.revokeObjectURL(url);
        } catch  {
            setError("Unable to export invoices");
        } finally{
            setExporting(null);
        }
    }
    function toggleSelection(id) {
        if (usingDemoData) return;
        if (invoices.find((inv)=>inv.id === id)?.demo) return;
        setSelectedIds((prev)=>prev.includes(id) ? prev.filter((value)=>value !== id) : [
                ...prev,
                id
            ]);
    }
    function toggleSelectAll() {
        if (usingDemoData) return;
        const selectable = invoices.filter((inv)=>!inv.demo).map((inv)=>inv.id);
        if (!selectable.length) {
            setSelectedIds([]);
            return;
        }
        if (selectedIds.length === selectable.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(selectable);
        }
    }
    const selectableCount = invoices.filter((inv)=>!inv.demo).length;
    const selectedCount = selectedIds.length;
    const allSelected = selectableCount > 0 && selectedCount === selectableCount;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "p-8 space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold",
                                children: "Invoices"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/page.tsx",
                                lineNumber: 354,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600",
                                children: "Pull time, photos, and inventory straight into polished invoices."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/page.tsx",
                                lineNumber: 355,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/invoices/page.tsx",
                        lineNumber: 353,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: pdfTemplate,
                                onChange: (e)=>setPdfTemplate(e.target.value),
                                disabled: Boolean(exporting) || usingDemoData || loading,
                                className: "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-60",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "standard",
                                        children: "PDF: Standard"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/invoices/page.tsx",
                                        lineNumber: 364,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "detailed",
                                        children: "PDF: Detailed"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/invoices/page.tsx",
                                        lineNumber: 365,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/invoices/page.tsx",
                                lineNumber: 358,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleExport("pdf"),
                                disabled: Boolean(exporting) || usingDemoData || loading,
                                className: "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",
                                children: exporting === "pdf" ? "Generating PDF…" : selectedCount > 0 ? "Print selected (PDF)" : "Download PDF"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/page.tsx",
                                lineNumber: 367,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleExport("ledger"),
                                disabled: Boolean(exporting) || usingDemoData || loading,
                                className: "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",
                                children: exporting === "ledger" ? "Exporting ledger…" : "Export ledger CSV"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/page.tsx",
                                lineNumber: 375,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleExport("lines"),
                                disabled: Boolean(exporting) || usingDemoData || loading,
                                className: "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",
                                children: exporting === "lines" ? "Exporting lines…" : "Export line items CSV"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/page.tsx",
                                lineNumber: 383,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard/tasks",
                                className: "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50",
                                children: "View tasks"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/page.tsx",
                                lineNumber: 391,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard/items",
                                className: "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50",
                                children: "View inventory"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/page.tsx",
                                lineNumber: 392,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$BackButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BackButton"], {}, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/page.tsx",
                                lineNumber: 393,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/invoices/page.tsx",
                        lineNumber: 357,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/invoices/page.tsx",
                lineNumber: 352,
                columnNumber: 7
            }, this),
            allowDemoData && usingDemoData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900",
                children: "Showing mock invoices while you explore. Add a live invoice to switch to your own data."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/invoices/page.tsx",
                lineNumber: 397,
                columnNumber: 9
            }, this),
            offlineCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold",
                                children: [
                                    offlineCount,
                                    " invoice",
                                    offlineCount > 1 ? "s" : "",
                                    " waiting to sync"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/invoices/page.tsx",
                                lineNumber: 404,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-slate-600",
                                children: "We saved them locally until the Supabase schema catches up."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/page.tsx",
                                lineNumber: 405,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/invoices/page.tsx",
                        lineNumber: 403,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSyncOffline,
                        disabled: syncing,
                        className: "rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70",
                        children: syncing ? "Syncing…" : "Retry sync"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/invoices/page.tsx",
                        lineNumber: 407,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/invoices/page.tsx",
                lineNumber: 402,
                columnNumber: 9
            }, this),
            syncMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900",
                children: syncMessage
            }, void 0, false, {
                fileName: "[project]/app/dashboard/invoices/page.tsx",
                lineNumber: 416,
                columnNumber: 23
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: selectedCount > 0 ? `${selectedCount} invoice${selectedCount === 1 ? "" : "s"} selected for print/export.` : "Select processed invoices below to print specific documents."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/invoices/page.tsx",
                        lineNumber: 418,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: toggleSelectAll,
                        disabled: usingDemoData || !selectableCount || loading,
                        className: "rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",
                        children: allSelected ? "Clear selection" : "Select all"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/invoices/page.tsx",
                        lineNumber: 421,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/invoices/page.tsx",
                lineNumber: 417,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$invoices$2f$InvoiceForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onAdd: handleAdd,
                preset: preset,
                companyId: companyId
            }, void 0, false, {
                fileName: "[project]/app/dashboard/invoices/page.tsx",
                lineNumber: 430,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-8 text-blue-600 font-semibold",
                children: "Loading invoices…"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/invoices/page.tsx",
                lineNumber: 431,
                columnNumber: 19
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-900",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/dashboard/invoices/page.tsx",
                lineNumber: 432,
                columnNumber: 17
            }, this),
            invoices.length === 0 && !loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-slate-200 bg-slate-50 px-6 py-12 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-600 font-semibold",
                        children: "No invoices yet"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/invoices/page.tsx",
                        lineNumber: 435,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-slate-500 text-sm mt-1",
                        children: "Create your first invoice above to get started."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/invoices/page.tsx",
                        lineNumber: 436,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/invoices/page.tsx",
                lineNumber: 434,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 sm:grid-cols-1 lg:grid-cols-2",
                children: invoices.map((inv, i)=>{
                    const customerLabel = inv.customer?.name || inv.customer_name || (inv.customer_id ? `Customer #${inv.customer_id}` : "Customer");
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start justify-between mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-bold text-slate-900",
                                                    children: customerLabel
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                                    lineNumber: 451,
                                                    columnNumber: 23
                                                }, this),
                                                inv.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-slate-600 mt-1",
                                                    children: inv.description
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                                    lineNumber: 452,
                                                    columnNumber: 43
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/invoices/page.tsx",
                                            lineNumber: 450,
                                            columnNumber: 21
                                        }, this),
                                        !inv.demo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: selectedIds.includes(inv.id),
                                            onChange: ()=>toggleSelection(inv.id),
                                            className: "h-5 w-5 rounded border-slate-300 text-blue-600",
                                            "aria-label": `Select invoice for export`
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/page.tsx",
                                            lineNumber: 455,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                    lineNumber: 449,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-baseline justify-between mb-4 pb-4 border-b border-slate-100",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs tracking-wide text-slate-500 uppercase font-semibold mb-1",
                                                    children: "Amount"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                                    lineNumber: 468,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-3xl font-bold text-slate-900",
                                                    children: [
                                                        "R",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: inv.amount?.toFixed(2)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/invoices/page.tsx",
                                                            lineNumber: 470,
                                                            columnNumber: 26
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                                    lineNumber: 469,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/invoices/page.tsx",
                                            lineNumber: 467,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2 justify-end",
                                            children: [
                                                inv.offline && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700",
                                                    children: "📡 Offline"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                                    lineNumber: 475,
                                                    columnNumber: 25
                                                }, this),
                                                inv.demo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600",
                                                    children: "✨ Demo"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                                    lineNumber: 480,
                                                    columnNumber: 25
                                                }, this),
                                                inv.last_sync_error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "inline-flex items-center rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700",
                                                    children: "⚠️ Sync error"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                                    lineNumber: 485,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/invoices/page.tsx",
                                            lineNumber: 473,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                    lineNumber: 466,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3 mb-4 text-sm",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-500 uppercase tracking-wide font-semibold mb-0.5",
                                                children: "Invoice ID"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/invoices/page.tsx",
                                                lineNumber: 495,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-mono text-slate-700",
                                                children: [
                                                    "#",
                                                    inv.id
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/invoices/page.tsx",
                                                lineNumber: 496,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/invoices/page.tsx",
                                        lineNumber: 494,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                    lineNumber: 493,
                                    columnNumber: 19
                                }, this),
                                editing === inv.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handleUpdate,
                                    className: "space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "w-full rounded border border-slate-300 px-3 py-2 text-sm",
                                            type: "number",
                                            min: "0",
                                            value: editData.amount,
                                            onChange: (e)=>setEditData((ed)=>({
                                                        ...ed,
                                                        amount: Number(e.target.value)
                                                    })),
                                            placeholder: "Amount",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/page.tsx",
                                            lineNumber: 503,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            className: "w-full rounded border border-slate-300 px-3 py-2 text-sm",
                                            value: editData.description,
                                            onChange: (e)=>setEditData((ed)=>({
                                                        ...ed,
                                                        description: e.target.value
                                                    })),
                                            placeholder: "Description",
                                            rows: 2
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/page.tsx",
                                            lineNumber: 512,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "flex-1 rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100",
                                                    type: "submit",
                                                    children: "Save"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                                    lineNumber: 520,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "flex-1 rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100",
                                                    type: "button",
                                                    onClick: ()=>setEditing(null),
                                                    children: "Cancel"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                                    lineNumber: 526,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/invoices/page.tsx",
                                            lineNumber: 519,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                    lineNumber: 502,
                                    columnNumber: 21
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "flex-1 rounded border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors",
                                            onClick: ()=>{
                                                const invoiceData = {
                                                    invoiceNumber: String(inv.id),
                                                    date: new Date().toLocaleDateString(),
                                                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                                                    customerName: inv.customer?.name || inv.customer_name || "Customer",
                                                    amount: inv.amount || 0,
                                                    currency: "R",
                                                    lineItems: [
                                                        {
                                                            description: inv.description || "Invoice Services",
                                                            quantity: 1,
                                                            rate: inv.amount || 0,
                                                            total: inv.amount || 0
                                                        }
                                                    ],
                                                    notes: inv.description ? `${inv.description}` : undefined
                                                };
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$invoicePDF$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["downloadInvoicePDF"])(invoiceData);
                                            },
                                            children: "🖨 Print PDF"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/page.tsx",
                                            lineNumber: 537,
                                            columnNumber: 23
                                        }, this),
                                        !inv.demo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "flex-1 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors",
                                                    onClick: ()=>handleEdit(inv),
                                                    children: "✎ Edit"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                                    lineNumber: 564,
                                                    columnNumber: 27
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "flex-1 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors",
                                                    onClick: ()=>handleDelete(inv.id),
                                                    children: "🗑 Delete"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                                    lineNumber: 570,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                    lineNumber: 536,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/invoices/page.tsx",
                            lineNumber: 447,
                            columnNumber: 17
                        }, this)
                    }, inv.id ?? i, false, {
                        fileName: "[project]/app/dashboard/invoices/page.tsx",
                        lineNumber: 443,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/app/dashboard/invoices/page.tsx",
                lineNumber: 439,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/invoices/page.tsx",
        lineNumber: 351,
        columnNumber: 5
    }, this);
}
_s(InvoicesPageContent, "jLG8GPaBs5ToAJXFEl0edcz98hQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c1 = InvoicesPageContent;
var _c, _c1;
__turbopack_context__.k.register(_c, "InvoicesPage");
__turbopack_context__.k.register(_c1, "InvoicesPageContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_bbe64ba7._.js.map