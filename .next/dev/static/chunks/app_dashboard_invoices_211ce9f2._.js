(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/dashboard/invoices/InvoiceForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InvoiceForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../../lib/clientUser'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const makeLineId = ()=>typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
const newLineItem = ()=>({
        id: makeLineId(),
        itemId: "",
        quantity: 1,
        project: "",
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
function InvoiceForm({ onAdd, preset }) {
    _s();
    const [customers, setCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedCustomer, setSelectedCustomer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(preset?.customerId ?? "");
    const [reference, setReference] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(preset?.taskName ? `Work completed for task: ${preset.taskName}` : "");
    const presetSeconds = preset?.taskSeconds ? Number(preset.taskSeconds) : null;
    const presetHoursRaw = secondsToHours(presetSeconds);
    const trackedHours = presetHoursRaw ? Math.max(MIN_TIME_HOURS, Number(presetHoursRaw.toFixed(2))) : null;
    const [lineItems, setLineItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        newLineItem()
    ]);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        success: "",
        error: ""
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InvoiceForm.useEffect": ()=>{
            let active = true;
            ensureClientUserId().then({
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
            async function load() {
                try {
                    const qs = new URLSearchParams({
                        user_id: userId
                    });
                    const [cust, itm] = await Promise.all([
                        fetch(`/api/customers?${qs.toString()}`).then({
                            "InvoiceForm.useEffect.load": (r)=>r.ok ? r.json() : []
                        }["InvoiceForm.useEffect.load"]),
                        fetch(`/api/items?${qs.toString()}`).then({
                            "InvoiceForm.useEffect.load": (r)=>r.ok ? r.json() : []
                        }["InvoiceForm.useEffect.load"])
                    ]);
                    setCustomers(Array.isArray(cust) ? cust : []);
                    setItems(Array.isArray(itm) ? itm : []);
                } catch  {
                    setStatus({
                        success: "",
                        error: "Failed to load customers or items."
                    });
                }
            }
            load();
        }
    }["InvoiceForm.useEffect"], [
        userId
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
                    const isSingleBlank = prev.length === 1 && !prev[0].itemId && prev[0].quantity === 1 && !prev[0].note && !prev[0].project;
                    const remainder = isSingleBlank ? [] : prev;
                    const timerLine = {
                        ...newLineItem(),
                        quantity: trackedHours,
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
        trackedHours
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
                                    itemId: items[0].id
                                };
                            }
                            return line;
                        }
                    }["InvoiceForm.useEffect"])
            }["InvoiceForm.useEffect"]);
        }
    }["InvoiceForm.useEffect"], [
        items
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
    async function handleSubmit(e) {
        e.preventDefault();
        setStatus({
            success: "",
            error: ""
        });
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
            return {
                itemId: match?.id ?? (typeof line.itemId === "number" ? line.itemId : null),
                itemName: match?.name ?? "Item",
                quantity: line.quantity,
                rate,
                total,
                project: line.project || null,
                note: line.note || null,
                source: line.source || null,
                taskRef: line.taskRef || null
            };
        });
        const breakdown = validLines.map((line)=>{
            const match = items.find((i)=>i.id === line.itemId);
            const price = match?.price || 0;
            const total = price * line.quantity;
            const projectTag = line.project ? ` • Project: ${line.project}` : "";
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
                        lineNumber: 247,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-500",
                        children: "Pull items directly from your price list and tag the project per line."
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 248,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                lineNumber: 246,
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
                                lineNumber: 253,
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
                                        lineNumber: 259,
                                        columnNumber: 13
                                    }, this),
                                    customers.map((customer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: customer.id,
                                            children: customer.name
                                        }, customer.id, false, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 261,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                lineNumber: 254,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 252,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: "Reference"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                lineNumber: 266,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "border p-2 rounded w-full",
                                placeholder: "e.g. Progress draw #3",
                                value: reference,
                                onChange: (e)=>setReference(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                lineNumber: 267,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 265,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                lineNumber: 251,
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
                                lineNumber: 278,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "text-indigo-600 font-medium",
                                onClick: addLine,
                                children: "+ Add line"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 277,
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
                                            lineNumber: 286,
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
                                                    lineNumber: 292,
                                                    columnNumber: 19
                                                }, this),
                                                items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: item.id,
                                                        children: [
                                                            item.name,
                                                            " — R",
                                                            item.price?.toFixed(2)
                                                        ]
                                                    }, item.id, true, {
                                                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                                        lineNumber: 294,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 287,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                    lineNumber: 285,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-semibold mb-1 block",
                                            children: "Qty"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 299,
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
                                            lineNumber: 300,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                    lineNumber: 298,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-sm font-semibold mb-1 block",
                                            children: "Project"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 310,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "border rounded w-full p-2",
                                            placeholder: "Area / project",
                                            value: line.project,
                                            onChange: (e)=>updateLine(line.id, "project", e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 311,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                    lineNumber: 309,
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
                                            lineNumber: 319,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "border rounded w-full p-2",
                                            placeholder: "Extra detail",
                                            value: line.note,
                                            onChange: (e)=>updateLine(line.id, "note", e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 320,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                    lineNumber: 318,
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
                                            lineNumber: 328,
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
                                            lineNumber: 329,
                                            columnNumber: 17
                                        }, this),
                                        lineItems.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            className: "text-red-500 text-xs",
                                            onClick: ()=>removeLine(line.id),
                                            children: "Remove"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                            lineNumber: 331,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                                    lineNumber: 327,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, line.id, true, {
                            fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                            lineNumber: 284,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                lineNumber: 276,
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
                                lineNumber: 341,
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
                                lineNumber: 342,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 340,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold",
                        type: "submit",
                        children: "Create invoice"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                        lineNumber: 344,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                lineNumber: 339,
                columnNumber: 7
            }, this),
            status.success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-green-600 text-sm",
                children: status.success
            }, void 0, false, {
                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                lineNumber: 347,
                columnNumber: 26
            }, this),
            status.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-600 text-sm",
                children: status.error
            }, void 0, false, {
                fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
                lineNumber: 348,
                columnNumber: 24
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/invoices/InvoiceForm.tsx",
        lineNumber: 245,
        columnNumber: 5
    }, this);
}
_s(InvoiceForm, "ac0yzdpZ67D8nfqRykM3eEDCglE=");
_c = InvoiceForm;
var _c;
__turbopack_context__.k.register(_c, "InvoiceForm");
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
;
var _s = __turbopack_context__.k.signature();
"use client";
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
            lineNumber: 19,
            columnNumber: 25
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InvoicesPageContent, {}, void 0, false, {
            fileName: "[project]/app/dashboard/invoices/page.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/dashboard/invoices/page.tsx",
        lineNumber: 19,
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
        taskSeconds: searchParams.get("taskSeconds")
    };
    const [invoices, setInvoices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InvoicesPageContent.useEffect": ()=>{
            setLoading(true);
            fetch("/api/invoices").then({
                "InvoicesPageContent.useEffect": (res)=>{
                    if (!res.ok) throw new Error("Failed to load");
                    return res.json();
                }
            }["InvoicesPageContent.useEffect"]).then({
                "InvoicesPageContent.useEffect": (data)=>{
                    setInvoices(Array.isArray(data) ? data : []);
                    setLoading(false);
                }
            }["InvoicesPageContent.useEffect"]).catch({
                "InvoicesPageContent.useEffect": ()=>{
                    setError("Failed to load invoices");
                    setLoading(false);
                }
            }["InvoicesPageContent.useEffect"]);
        }
    }["InvoicesPageContent.useEffect"], []);
    async function handleAdd(invoice) {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/invoices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    customer_id: invoice.customerId,
                    amount: invoice.amount,
                    description: invoice.description
                })
            });
            if (!res.ok) throw new Error("Failed to add invoice");
            const newInvoice = await res.json();
            setInvoices((prev)=>[
                    newInvoice,
                    ...prev
                ]);
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
        setEditing(inv.id);
        setEditData({
            amount: inv.amount,
            description: inv.description || ""
        });
    }
    async function handleUpdate(e) {
        e.preventDefault();
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
                    description: editData.description
                })
            });
            if (!res.ok) throw new Error("Failed to update invoice");
            const updated = await res.json();
            setInvoices((prev)=>prev.map((i)=>i.id === editing ? updated : i));
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
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/invoices", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id
                })
            });
            if (!res.ok) throw new Error("Failed to delete invoice");
            setInvoices((prev)=>prev.filter((i)=>i.id !== id));
        } catch  {
            setError("Failed to delete invoice");
        } finally{
            setLoading(false);
        }
    }
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
                                lineNumber: 132,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600",
                                children: "Pull time, photos, and inventory straight into polished invoices."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/page.tsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/invoices/page.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard/tasks",
                                className: "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50",
                                children: "View tasks"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/page.tsx",
                                lineNumber: 136,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard/items",
                                className: "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50",
                                children: "View inventory"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/invoices/page.tsx",
                                lineNumber: 137,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/invoices/page.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/invoices/page.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$invoices$2f$InvoiceForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onAdd: handleAdd,
                preset: preset
            }, void 0, false, {
                fileName: "[project]/app/dashboard/invoices/page.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-blue-600",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/invoices/page.tsx",
                lineNumber: 141,
                columnNumber: 19
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-600",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/dashboard/invoices/page.tsx",
                lineNumber: 142,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "mt-4",
                children: invoices.map((inv, i)=>{
                    const customerLabel = inv.customer?.name || inv.customer_name || (inv.customer_id ? `Customer #${inv.customer_id}` : "Customer");
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "border-b py-2 flex items-center gap-2",
                        children: editing === inv.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleUpdate,
                            className: "flex gap-2 flex-1 items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold flex-1",
                                    children: customerLabel
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                    lineNumber: 150,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    className: "border p-1 rounded w-32",
                                    type: "number",
                                    min: "0",
                                    value: editData.amount,
                                    onChange: (e)=>setEditData((ed)=>({
                                                ...ed,
                                                amount: Number(e.target.value)
                                            })),
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                    lineNumber: 151,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    className: "border p-1 rounded flex-1",
                                    value: editData.description,
                                    onChange: (e)=>setEditData((ed)=>({
                                                ...ed,
                                                description: e.target.value
                                            })),
                                    placeholder: "Description"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                    lineNumber: 159,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "bg-green-600 text-white px-2 py-1 rounded",
                                    type: "submit",
                                    children: "Save"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                    lineNumber: 165,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "bg-gray-400 text-white px-2 py-1 rounded",
                                    type: "button",
                                    onClick: ()=>setEditing(null),
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                    lineNumber: 166,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/invoices/page.tsx",
                            lineNumber: 149,
                            columnNumber: 17
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold",
                                    children: customerLabel
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                    lineNumber: 170,
                                    columnNumber: 19
                                }, this),
                                " — R",
                                inv.amount?.toFixed(2),
                                inv.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-2 text-gray-600",
                                    children: [
                                        "(",
                                        inv.description,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                    lineNumber: 171,
                                    columnNumber: 39
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "bg-yellow-500 text-white px-2 py-1 rounded ml-2",
                                    onClick: ()=>handleEdit(inv),
                                    children: "Edit"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                    lineNumber: 172,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "bg-red-600 text-white px-2 py-1 rounded ml-2",
                                    onClick: ()=>handleDelete(inv.id),
                                    children: "Delete"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/invoices/page.tsx",
                                    lineNumber: 173,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true)
                    }, inv.id ?? i, false, {
                        fileName: "[project]/app/dashboard/invoices/page.tsx",
                        lineNumber: 147,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/app/dashboard/invoices/page.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/invoices/page.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
_s(InvoicesPageContent, "vxvDfeRY6VxQK65Gr7keyHEU9ps=", false, function() {
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

//# sourceMappingURL=app_dashboard_invoices_211ce9f2._.js.map