(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/dashboard/projects/ProjectForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProjectForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function ProjectForm({ onAdd, disabled, limit = 3 }) {
    _s();
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [plannedBudget, setPlannedBudget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [actualBudget, setActualBudget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    async function handleSubmit(e) {
        e.preventDefault();
        setSuccess("");
        setError("");
        if (!name) {
            setError("Project name is required.");
            return;
        }
        const ok = await onAdd({
            name,
            description,
            planned_budget: plannedBudget === "" ? undefined : Number(plannedBudget),
            actual_budget: actualBudget === "" ? undefined : Number(actualBudget)
        });
        if (ok) {
            setSuccess("Project added!");
            setName("");
            setDescription("");
            setPlannedBudget("");
            setActualBudget("");
        } else {
            setError("Failed to add project.");
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "mb-4 flex flex-col gap-2 w-full max-w-xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                className: "border p-2 rounded",
                placeholder: "Project Name",
                value: name,
                onChange: (e)=>setName(e.target.value),
                required: true,
                disabled: disabled
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/ProjectForm.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                className: "border p-2 rounded",
                placeholder: "Description",
                value: description,
                onChange: (e)=>setDescription(e.target.value),
                disabled: disabled
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/ProjectForm.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                className: "border p-2 rounded",
                type: "number",
                min: "0",
                placeholder: "Planned Budget (R)",
                value: plannedBudget,
                onChange: (e)=>setPlannedBudget(e.target.value === "" ? "" : Number(e.target.value)),
                disabled: disabled
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/ProjectForm.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                className: "border p-2 rounded",
                type: "number",
                min: "0",
                placeholder: "Actual Budget (R)",
                value: actualBudget,
                onChange: (e)=>setActualBudget(e.target.value === "" ? "" : Number(e.target.value)),
                disabled: disabled
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/ProjectForm.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "bg-blue-600 text-white px-3 py-1 rounded",
                type: "submit",
                disabled: disabled,
                children: "Add"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/ProjectForm.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-green-600 text-sm mt-1",
                children: success
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/ProjectForm.tsx",
                lineNumber: 74,
                columnNumber: 19
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-600 text-sm mt-1",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/ProjectForm.tsx",
                lineNumber: 75,
                columnNumber: 17
            }, this),
            disabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-yellow-600 text-sm mt-1",
                children: [
                    "Project limit reached (",
                    limit,
                    ")"
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/projects/ProjectForm.tsx",
                lineNumber: 76,
                columnNumber: 20
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/projects/ProjectForm.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_s(ProjectForm, "PKVdO4e7xuiVuA+JsTxtn/VsrMY=");
_c = ProjectForm;
var _c;
__turbopack_context__.k.register(_c, "ProjectForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dashboard/projects/PhotoUpload.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PhotoUpload
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function PhotoUpload({ projectId, onUpload }) {
    _s();
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError("");
        const filePath = `projects/${projectId}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].storage.from("photos").upload(filePath, file);
        if (uploadError) {
            setError("Upload failed: " + uploadError.message);
            setUploading(false);
            return;
        }
        const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].storage.from("photos").getPublicUrl(filePath);
        onUpload(data.publicUrl);
        setUploading(false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "my-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "file",
                accept: "image/*",
                onChange: handleFileChange,
                disabled: uploading
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/PhotoUpload.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            uploading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "ml-2 text-blue-600",
                children: "Uploading..."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/PhotoUpload.tsx",
                lineNumber: 29,
                columnNumber: 21
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-600 text-sm mt-1",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/PhotoUpload.tsx",
                lineNumber: 30,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/projects/PhotoUpload.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
_s(PhotoUpload, "Aow4yDQbOrd+WRLMpO9os3x6CLI=");
_c = PhotoUpload;
var _c;
__turbopack_context__.k.register(_c, "PhotoUpload");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dashboard/projects/BudgetActual.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BudgetActual
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function BudgetActual({ projectId, userId }) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [planned, setPlanned] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [actual, setActual] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BudgetActual.useEffect": ()=>{
            if (!userId) return;
            setLoading(true);
            setError("");
            fetch(`/api/budgets?projectId=${projectId}&user_id=${userId}`).then({
                "BudgetActual.useEffect": (res)=>res.json()
            }["BudgetActual.useEffect"]).then({
                "BudgetActual.useEffect": (data)=>{
                    setPlanned(data?.planned_amount || 0);
                    setActual(data?.actual_amount || 0);
                    setLoading(false);
                }
            }["BudgetActual.useEffect"]).catch({
                "BudgetActual.useEffect": ()=>{
                    setError("Failed to load budget");
                    setLoading(false);
                }
            }["BudgetActual.useEffect"]);
        }
    }["BudgetActual.useEffect"], [
        projectId,
        userId
    ]);
    async function handleSave(e) {
        e.preventDefault();
        if (!userId) {
            setError("Resolving user context...");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/budgets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    project_id: projectId,
                    planned_amount: planned,
                    actual_amount: actual,
                    user_id: userId
                })
            });
            if (!res.ok) throw new Error();
            await res.json();
            setLoading(false);
        } catch  {
            setError("Failed to save budget");
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded shadow p-4 mb-4 max-w-xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "font-bold mb-2 text-lg",
                children: "Budget vs Actual"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/BudgetActual.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            !userId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm text-gray-600",
                children: "Preparing user workspace…"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/BudgetActual.tsx",
                lineNumber: 58,
                columnNumber: 19
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-blue-600",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/BudgetActual.tsx",
                lineNumber: 59,
                columnNumber: 19
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-600",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/BudgetActual.tsx",
                lineNumber: 60,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSave,
                className: "flex flex-col gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "font-semibold",
                        children: [
                            "Planned Budget (R):",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "border p-2 rounded w-full",
                                type: "number",
                                min: "0",
                                value: planned,
                                onChange: (e)=>setPlanned(Number(e.target.value)),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/projects/BudgetActual.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/projects/BudgetActual.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "font-semibold",
                        children: [
                            "Actual Spend (R):",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "border p-2 rounded w-full",
                                type: "number",
                                min: "0",
                                value: actual,
                                onChange: (e)=>setActual(Number(e.target.value)),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/projects/BudgetActual.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/projects/BudgetActual.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "bg-blue-600 text-white px-4 py-2 rounded mt-2 self-end",
                        type: "submit",
                        children: "Save"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/projects/BudgetActual.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/projects/BudgetActual.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 text-sm text-gray-700",
                children: [
                    "Difference: ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: actual > planned ? 'text-red-600' : 'text-green-600',
                        children: [
                            "R",
                            (planned - actual).toFixed(2)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/projects/BudgetActual.tsx",
                        lineNumber: 70,
                        columnNumber: 63
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/projects/BudgetActual.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/projects/BudgetActual.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_s(BudgetActual, "sOTK6RqGpbuIknT99kmb0VG3QJA=");
_c = BudgetActual;
var _c;
__turbopack_context__.k.register(_c, "BudgetActual");
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
"[project]/app/dashboard/projects/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProjectsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$projects$2f$ProjectForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dashboard/projects/ProjectForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$projects$2f$PhotoUpload$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dashboard/projects/PhotoUpload.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$projects$2f$BudgetActual$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dashboard/projects/BudgetActual.tsx [app-client] (ecmascript)");
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
;
const PROJECT_LIMIT = 6;
function ProjectsPage() {
    _s();
    const [projects, setProjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editData, setEditData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        description: ""
    });
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [companyId, setCompanyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [usingDemoData, setUsingDemoData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Only show demo fallback if user is actually a demo user (not real users with empty companies)
    const allowDemoData = userId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canUseDemoFixtures"])(userId) : false;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectsPage.useEffect": ()=>{
            let active = true;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clientUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureClientUserId"])().then({
                "ProjectsPage.useEffect": (id)=>{
                    if (active) setUserId(id);
                }
            }["ProjectsPage.useEffect"]).catch({
                "ProjectsPage.useEffect": ()=>{
                    if (active) setError('Unable to determine user context.');
                }
            }["ProjectsPage.useEffect"]);
            return ({
                "ProjectsPage.useEffect": ()=>{
                    active = false;
                }
            })["ProjectsPage.useEffect"];
        }
    }["ProjectsPage.useEffect"], []);
    // Load active company ID
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectsPage.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            setCompanyId((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$companySwitcher$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readActiveCompanyId"])());
        }
    }["ProjectsPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectsPage.useEffect": ()=>{
            if (!userId) return;
            const allowDemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canUseDemoFixtures"])(userId);
            let active = true;
            async function fetchProjects() {
                setLoading(true);
                setError(null);
                try {
                    const params = new URLSearchParams({
                        user_id: userId
                    });
                    if (companyId) params.set('company_id', companyId);
                    const res = await fetch(`/api/projects?${params.toString()}`);
                    if (!res.ok) throw new Error('Failed to load projects');
                    const payload = await res.json();
                    const list = Array.isArray(payload) ? payload : [];
                    if (active && list.length > 0) {
                        setProjects(list);
                        setUsingDemoData(false);
                    } else if (active && allowDemo && !companyId) {
                        // Only show demo data if user is demo user AND no company selected
                        setProjects((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoProjects"])(userId));
                        setUsingDemoData(true);
                    } else if (active) {
                        setProjects([]);
                        setUsingDemoData(false);
                    }
                } catch (err) {
                    if (!active) return;
                    // Only show demo data on error if user is demo user AND no company selected
                    if (allowDemo && !companyId) {
                        setProjects((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoProjects"])(userId));
                        setUsingDemoData(true);
                    } else {
                        setProjects([]);
                        setUsingDemoData(false);
                    }
                    setError(err.message || 'Failed to load projects');
                } finally{
                    if (active) setLoading(false);
                }
            }
            fetchProjects();
            return ({
                "ProjectsPage.useEffect": ()=>{
                    active = false;
                }
            })["ProjectsPage.useEffect"];
        }
    }["ProjectsPage.useEffect"], [
        userId,
        companyId
    ]);
    async function handleAdd(project) {
        if (!userId || !companyId) {
            setError('User or company context not available');
            return false;
        }
        const realCount = projects.filter((p)=>!p.demo).length;
        if (realCount >= PROJECT_LIMIT) return false;
        setLoading(true);
        setError(null);
        try {
            const payload = {
                name: project.name,
                description: project.description,
                user_id: userId,
                company_id: companyId
            };
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Failed to add project");
            const newProject = await res.json();
            setProjects((prev)=>[
                    newProject,
                    ...prev.filter((p)=>!p.demo)
                ]);
            setUsingDemoData(false);
            const hasBudgetValues = project.planned_budget !== undefined || project.actual_budget !== undefined;
            if (newProject?.id && hasBudgetValues) {
                const budgetRes = await fetch("/api/budgets", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        project_id: newProject.id,
                        planned_amount: project.planned_budget ?? 0,
                        actual_amount: project.actual_budget ?? 0,
                        user_id: userId,
                        company_id: companyId
                    })
                });
                if (!budgetRes.ok) {
                    console.warn("Failed to persist initial budget", await budgetRes.text());
                }
            }
            return true;
        } catch  {
            setError("Failed to add project");
            return false;
        } finally{
            setLoading(false);
        }
    }
    async function handleEdit(project) {
        if (project.demo) {
            setError("Demo projects are read-only. Add your own project to replace these samples.");
            return;
        }
        setEditing(project.id);
        setEditData({
            name: project.name,
            description: project.description
        });
    }
    async function handleUpdate(e) {
        e.preventDefault();
        if (!userId) return;
        if (projects.find((p)=>p.id === editing)?.demo) {
            setError("Demo projects are read-only.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/projects", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: editing,
                    ...editData,
                    user_id: userId
                })
            });
            if (!res.ok) throw new Error("Failed to update project");
            const updated = await res.json();
            setProjects((prev)=>prev.map((p)=>p.id === editing ? updated : p));
            setEditing(null);
            setEditData({
                name: "",
                description: ""
            });
        } catch  {
            setError("Failed to update project");
        } finally{
            setLoading(false);
        }
    }
    async function handleDelete(id) {
        if (!userId) return;
        const target = projects.find((p)=>p.id === id);
        if (target?.demo) {
            setError("Demo projects are read-only.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/projects", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id,
                    user_id: userId
                })
            });
            if (!res.ok) throw new Error("Failed to delete project");
            setProjects((prev)=>prev.filter((p)=>p.id !== id));
        } catch  {
            setError("Failed to delete project");
        } finally{
            setLoading(false);
        }
    }
    async function handlePhotoUpload(projectId, url) {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/projects", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: projectId,
                    photo_url: url,
                    user_id: userId
                })
            });
            if (!res.ok) throw new Error("Failed to update project photo");
            const updated = await res.json();
            setProjects((prev)=>prev.map((p)=>p.id === projectId ? updated : p));
        } catch  {
            setError("Failed to update project photo");
        } finally{
            setLoading(false);
        }
    }
    const realProjectCount = projects.filter((p)=>!p.demo).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "p-8 space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold",
                        children: [
                            "Projects (max ",
                            PROJECT_LIMIT,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/projects/page.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard/projects/reports/pandl",
                                className: "inline-flex items-center justify-center rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 shadow-sm hover:bg-green-100",
                                children: "📊 P&L Report"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/projects/page.tsx",
                                lineNumber: 227,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard/invoices",
                                className: "inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50",
                                children: "Open invoicing"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/projects/page.tsx",
                                lineNumber: 230,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$BackButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BackButton"], {}, void 0, false, {
                                fileName: "[project]/app/dashboard/projects/page.tsx",
                                lineNumber: 233,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/projects/page.tsx",
                        lineNumber: 226,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/projects/page.tsx",
                lineNumber: 224,
                columnNumber: 7
            }, this),
            allowDemoData && usingDemoData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900",
                children: "Showing mock projects for the demo workspace. Add your own project to switch to live data."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/page.tsx",
                lineNumber: 237,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$projects$2f$ProjectForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onAdd: handleAdd,
                disabled: realProjectCount >= PROJECT_LIMIT,
                limit: PROJECT_LIMIT
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/page.tsx",
                lineNumber: 241,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-blue-600",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/page.tsx",
                lineNumber: 242,
                columnNumber: 19
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-600",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/page.tsx",
                lineNumber: 243,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "mt-4",
                children: projects.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "border-b py-2 flex flex-col sm:flex-row items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 flex items-center gap-2",
                                children: editing === p.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: handleUpdate,
                                    className: "flex gap-2 flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "border p-1 rounded flex-1",
                                            value: editData.name,
                                            onChange: (e)=>setEditData((ed)=>({
                                                        ...ed,
                                                        name: e.target.value
                                                    })),
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/projects/page.tsx",
                                            lineNumber: 250,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "border p-1 rounded flex-1",
                                            value: editData.description,
                                            onChange: (e)=>setEditData((ed)=>({
                                                        ...ed,
                                                        description: e.target.value
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/projects/page.tsx",
                                            lineNumber: 256,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "bg-green-600 text-white px-2 py-1 rounded",
                                            type: "submit",
                                            children: "Save"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/projects/page.tsx",
                                            lineNumber: 261,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "bg-gray-400 text-white px-2 py-1 rounded",
                                            type: "button",
                                            onClick: ()=>setEditing(null),
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/projects/page.tsx",
                                            lineNumber: 262,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/projects/page.tsx",
                                    lineNumber: 249,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold",
                                            children: p.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/projects/page.tsx",
                                            lineNumber: 266,
                                            columnNumber: 19
                                        }, this),
                                        " — ",
                                        p.description,
                                        p.id !== undefined && !p.demo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "bg-yellow-500 text-white px-2 py-1 rounded ml-2",
                                                    onClick: ()=>handleEdit(p),
                                                    children: "Edit"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/projects/page.tsx",
                                                    lineNumber: 269,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "bg-red-600 text-white px-2 py-1 rounded ml-2",
                                                    onClick: ()=>handleDelete(p.id),
                                                    children: "Delete"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/projects/page.tsx",
                                                    lineNumber: 270,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ml-2 rounded-full border border-amber-200 px-2 py-0.5 text-xs uppercase tracking-wide text-amber-600",
                                            children: "Demo"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/projects/page.tsx",
                                            lineNumber: 273,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/projects/page.tsx",
                                lineNumber: 247,
                                columnNumber: 13
                            }, this),
                            p.id && !p.demo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$projects$2f$PhotoUpload$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        projectId: p.id,
                                        onUpload: (url)=>handlePhotoUpload(p.id, url)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/projects/page.tsx",
                                        lineNumber: 280,
                                        columnNumber: 17
                                    }, this),
                                    p.photo_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: p.photo_url,
                                        alt: "Project",
                                        width: 128,
                                        height: 128,
                                        className: "mt-2 h-32 w-32 rounded object-cover shadow"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/projects/page.tsx",
                                        lineNumber: 282,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$projects$2f$BudgetActual$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        projectId: p.id,
                                        userId: userId
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/projects/page.tsx",
                                        lineNumber: 284,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/projects/page.tsx",
                                lineNumber: 279,
                                columnNumber: 15
                            }, this) : p.photo_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: p.photo_url,
                                alt: "Project",
                                width: 128,
                                height: 128,
                                className: "mt-2 h-32 w-32 rounded object-cover shadow"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/projects/page.tsx",
                                lineNumber: 288,
                                columnNumber: 17
                            }, this)
                        ]
                    }, p.id ?? i, true, {
                        fileName: "[project]/app/dashboard/projects/page.tsx",
                        lineNumber: 246,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/dashboard/projects/page.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/projects/page.tsx",
        lineNumber: 223,
        columnNumber: 5
    }, this);
}
_s(ProjectsPage, "qfzi0v2JYx1J4QxB0/z7I8uMREI=");
_c = ProjectsPage;
var _c;
__turbopack_context__.k.register(_c, "ProjectsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_e40887d2._.js.map