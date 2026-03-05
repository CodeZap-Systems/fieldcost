module.exports = [
"[project]/app/dashboard/customers/CustomerForm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CustomerForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const createDefaultForm = ()=>({
        name: "",
        category: "",
        active: true,
        cashSale: false,
        autoAllocate: false,
        acceptsElectronic: false,
        viewOnline: false,
        creditLimit: "",
        vatNumber: "",
        salesRep: "",
        openingBalance: "",
        openingDate: "",
        email: "",
        contactName: "",
        telephone: "",
        mobile: "",
        fax: "",
        web: "",
        postal: {
            address: "",
            code: ""
        },
        delivery: {
            address: "",
            code: ""
        },
        statementDistribution: "Email",
        defaultDiscount: "0.00",
        defaultPriceList: "Default Price List",
        defaultVatType: "No Default"
    });
function CustomerForm({ onAdd }) {
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("Details");
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(createDefaultForm());
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    function handleChange(e) {
        const target = e.target;
        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            const { name, checked } = target;
            setForm((f)=>({
                    ...f,
                    [name]: checked
                }));
            return;
        }
        const { name, value } = target;
        setForm((f)=>({
                ...f,
                [name]: value
            }));
    }
    function handleAddressChange(e, field) {
        const { name, value } = e.target;
        setForm((f)=>({
                ...f,
                [field]: {
                    ...f[field],
                    [name]: value
                }
            }));
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setSuccess("");
        setError("");
        if (!form.name || !form.email) {
            setError("Please enter both name and email.");
            return;
        }
        const ok = await onAdd(form);
        if (ok) {
            setSuccess("Customer added!");
            setForm(createDefaultForm());
        } else {
            setError("Failed to add customer.");
        }
    }
    const tabs = [
        "Details",
        "Activity",
        "Additional Contacts",
        "Notes",
        "User Defined Fields",
        "Personal Information",
        "Sales Graph",
        "Quotes"
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "bg-gray-50 p-6 rounded shadow max-w-4xl mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 flex gap-2 border-b",
                children: tabs.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: `px-4 py-2 font-semibold border-b-2 ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`,
                        onClick: ()=>setTab(t),
                        children: t
                    }, t, false, {
                        fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            tab === "Details" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-6 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: "Customer Name"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 125,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "name",
                                value: form.name,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: "Category"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 127,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "category",
                                value: form.category,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 128,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: [
                                    "Cash Sale Customer ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        name: "cashSale",
                                        checked: form.cashSale,
                                        onChange: handleChange
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                        lineNumber: 129,
                                        columnNumber: 76
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 129,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: "Opening Balance"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 130,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "openingBalance",
                                value: form.openingBalance,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 131,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: "Opening Balance as At"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "openingDate",
                                type: "date",
                                value: form.openingDate,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 133,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: [
                                    "Auto Allocate Receipts to Oldest Invoice ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        name: "autoAllocate",
                                        checked: form.autoAllocate,
                                        onChange: handleChange
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                        lineNumber: 134,
                                        columnNumber: 98
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 134,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                        lineNumber: 124,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: [
                                    "Active ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        name: "active",
                                        checked: form.active,
                                        onChange: handleChange
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                        lineNumber: 137,
                                        columnNumber: 64
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: "Credit Limit"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 138,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "creditLimit",
                                value: form.creditLimit,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 139,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: "Customer VAT Number"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 140,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "vatNumber",
                                value: form.vatNumber,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: "Sales Rep"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "salesRep",
                                value: form.salesRep,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 143,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: [
                                    "Accepts Electronic Invoices ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        name: "acceptsElectronic",
                                        checked: form.acceptsElectronic,
                                        onChange: handleChange
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                        lineNumber: 144,
                                        columnNumber: 85
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 144,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                lineNumber: 123,
                columnNumber: 9
            }, this),
            tab === "Details" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-6 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold mb-2",
                                children: "Postal Address"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "address",
                                value: form.postal.address,
                                onChange: (e)=>handleAddressChange(e, "postal"),
                                className: "border p-2 rounded w-full mb-2"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "code",
                                value: form.postal.code,
                                onChange: (e)=>handleAddressChange(e, "postal"),
                                className: "border p-2 rounded w-full mb-2",
                                placeholder: "Postal Code"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 153,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                        lineNumber: 150,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold mb-2",
                                children: "Contact Details"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "contactName",
                                value: form.contactName,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2",
                                placeholder: "Contact Name"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "email",
                                value: form.email,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2",
                                placeholder: "Email"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 158,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "telephone",
                                value: form.telephone,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2",
                                placeholder: "Telephone"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 159,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "mobile",
                                value: form.mobile,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2",
                                placeholder: "Mobile"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 160,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "fax",
                                value: form.fax,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2",
                                placeholder: "Fax"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "web",
                                value: form.web,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2",
                                placeholder: "Web Address"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 162,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: [
                                    "Invoices can be viewed online ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        name: "viewOnline",
                                        checked: form.viewOnline,
                                        onChange: handleChange
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                        lineNumber: 163,
                                        columnNumber: 87
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 163,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                        lineNumber: 155,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                lineNumber: 149,
                columnNumber: 9
            }, this),
            tab === "Details" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-6 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold mb-2",
                                children: "Delivery Address"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 170,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "address",
                                value: form.delivery.address,
                                onChange: (e)=>handleAddressChange(e, "delivery"),
                                className: "border p-2 rounded w-full mb-2"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "code",
                                value: form.delivery.code,
                                onChange: (e)=>handleAddressChange(e, "delivery"),
                                className: "border p-2 rounded w-full mb-2",
                                placeholder: "Postal Code"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 172,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                        lineNumber: 169,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold mb-2",
                                children: "Default Settings"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 175,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: "Statement Distribution"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "statementDistribution",
                                value: form.statementDistribution,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 177,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: "Default Discount"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 178,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "defaultDiscount",
                                value: form.defaultDiscount,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 179,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: "Default Price List"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 180,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "defaultPriceList",
                                value: form.defaultPriceList,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 181,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block font-semibold mb-1",
                                children: "Default VAT Type"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                name: "defaultVatType",
                                value: form.defaultVatType,
                                onChange: handleChange,
                                className: "border p-2 rounded w-full mb-2"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                                lineNumber: 183,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                        lineNumber: 174,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                lineNumber: 168,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "bg-blue-600 text-white px-4 py-2 rounded min-w-[120px] mt-4",
                type: "submit",
                children: "Add Customer"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this),
            success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-green-600 text-sm mt-1",
                children: success
            }, void 0, false, {
                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                lineNumber: 189,
                columnNumber: 19
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-600 text-sm mt-1",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
                lineNumber: 190,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/customers/CustomerForm.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/clientUser.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ensureClientUserId",
    ()=>ensureClientUserId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/userIdentity.ts [app-ssr] (ecmascript)");
"use client";
;
;
async function ensureClientUserId() {
    const hasWindow = ("TURBOPACK compile-time value", "undefined") !== "undefined";
    const cacheUserId = (value)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    };
    const readCachedUserId = ()=>{
        if ("TURBOPACK compile-time truthy", 1) return undefined;
        //TURBOPACK unreachable
        ;
    };
    if (hasWindow && localStorage.getItem("demoSession") === "true") //TURBOPACK unreachable
    ;
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        if (!error) {
            const derived = data?.user?.user_metadata?.demoUserId || data?.user?.id;
            const resolved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeUserId"])(derived, undefined);
            if (resolved) {
                if (hasWindow && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDemoUserId"])(resolved)) //TURBOPACK unreachable
                ;
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
    cacheUserId(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_DEMO_USER_ID"]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_DEMO_USER_ID"];
}
}),
"[project]/lib/demoMockData.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/userIdentity.ts [app-ssr] (ecmascript)");
;
const ADMIN_KEY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeUserId"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_ADMIN_USER_ID"]);
const SUBCONTRACTOR_KEY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeUserId"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_SUBCONTRACTOR_USER_ID"], ADMIN_KEY);
const resolveKey = (userId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeUserId"])(userId, ADMIN_KEY);
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
}),
"[project]/app/dashboard/customers/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CustomersPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$customers$2f$CustomerForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dashboard/customers/CustomerForm.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clientUser$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/clientUser.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/demoMockData.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/userIdentity.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function CustomersPage() {
    const [customers, setCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [usingDemoData, setUsingDemoData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const allowDemoData = userId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canUseDemoFixtures"])(userId) : false;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let active = true;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clientUser$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ensureClientUserId"])().then((id1)=>{
            if (active) setUserId(id1);
        }).catch(()=>{
            if (active) setError('Unable to determine user context.');
        });
        return ()=>{
            active = false;
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!userId) return;
        let active = true;
        const allowDemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canUseDemoFixtures"])(userId);
        async function fetchCustomers() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/customers?user_id=${userId}`);
                if (!res.ok) throw new Error('Failed to load customers');
                const payload = await res.json();
                const list = Array.isArray(payload) ? payload : [];
                if (active && list.length > 0) {
                    setCustomers(list);
                    setUsingDemoData(false);
                } else if (active && allowDemo) {
                    setCustomers((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDemoCustomers"])(userId));
                    setUsingDemoData(true);
                } else if (active) {
                    setCustomers([]);
                    setUsingDemoData(false);
                }
            } catch (err) {
                if (!active) return;
                if (allowDemo) {
                    setCustomers((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDemoCustomers"])(userId));
                    setUsingDemoData(true);
                } else {
                    setCustomers([]);
                    setUsingDemoData(false);
                }
                setError(err.message || 'Failed to load customers');
            } finally{
                if (active) setLoading(false);
            }
        }
        fetchCustomers();
        return ()=>{
            active = false;
        };
    }, [
        userId
    ]);
    async function handleAdd(customer) {
        if (!userId) {
            setError('Resolving user...');
            return false;
        }
        setLoading(true);
        setError(null);
        try {
            const payload = {
                name: customer.name,
                email: customer.email,
                user_id: userId
            };
            const res = await fetch("/api/customers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Failed to add customer");
            const newCustomer = await res.json();
            setCustomers((prev)=>[
                    {
                        id: newCustomer.id,
                        name: newCustomer.name,
                        email: newCustomer.email
                    },
                    ...prev.filter((c)=>!c.demo)
                ]);
            setUsingDemoData(false);
            return true;
        } catch  {
            setError("Failed to add customer");
            return false;
        } finally{
            setLoading(false);
        }
    }
    const [editing, setEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editData, setEditData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        email: ""
    });
    async function handleEdit(customer) {
        if (customer.demo) {
            setError("Demo customers are read-only. Add your own customer to replace them.");
            return;
        }
        setEditing(customer.id);
        setEditData({
            name: customer.name,
            email: customer.email
        });
    }
    async function handleUpdate(e) {
        e.preventDefault();
        if (!userId) return;
        if (customers.find((c)=>c.id === id)?.demo) {
            setError("Demo customers are read-only.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/customers", {
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
            if (!res.ok) throw new Error("Failed to update customer");
            const updated = await res.json();
            setCustomers((prev)=>prev.map((c)=>c.id === editing ? updated : c));
            setEditing(null);
            setEditData({
                name: "",
                email: ""
            });
        } catch  {
            setError("Failed to update customer");
        } finally{
            setLoading(false);
        }
    }
    async function handleDelete(id1) {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/customers", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id1,
                    user_id: userId
                })
            });
            if (!res.ok) throw new Error("Failed to delete customer");
            setCustomers((prev)=>prev.filter((c)=>c.id !== id1));
        } catch  {
            setError("Failed to delete customer");
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "p-8 space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold",
                        children: "Customers"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/customers/page.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard/invoices",
                        className: "inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50",
                        children: "Open invoicing"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/customers/page.tsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/customers/page.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this),
            allowDemoData && usingDemoData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900",
                children: "Showing mock customer data so the workspace does not feel empty. Add a real customer to replace these rows."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/customers/page.tsx",
                lineNumber: 170,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$customers$2f$CustomerForm$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                onAdd: handleAdd
            }, void 0, false, {
                fileName: "[project]/app/dashboard/customers/page.tsx",
                lineNumber: 174,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-blue-600",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/customers/page.tsx",
                lineNumber: 175,
                columnNumber: 19
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-600",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/dashboard/customers/page.tsx",
                lineNumber: 176,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "mt-4",
                children: customers.map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "border-b py-2 flex items-center gap-2",
                        children: editing === c.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleUpdate,
                            className: "flex gap-2 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    className: "border p-1 rounded flex-1",
                                    value: editData.name,
                                    onChange: (e)=>setEditData((ed)=>({
                                                ...ed,
                                                name: e.target.value
                                            })),
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/customers/page.tsx",
                                    lineNumber: 182,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    className: "border p-1 rounded flex-1",
                                    value: editData.email,
                                    onChange: (e)=>setEditData((ed)=>({
                                                ...ed,
                                                email: e.target.value
                                            })),
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/customers/page.tsx",
                                    lineNumber: 188,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "bg-green-600 text-white px-2 py-1 rounded",
                                    type: "submit",
                                    children: "Save"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/customers/page.tsx",
                                    lineNumber: 194,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "bg-gray-400 text-white px-2 py-1 rounded",
                                    type: "button",
                                    onClick: ()=>setEditing(null),
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/customers/page.tsx",
                                    lineNumber: 195,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/customers/page.tsx",
                            lineNumber: 181,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold",
                                    children: c.name
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/customers/page.tsx",
                                    lineNumber: 199,
                                    columnNumber: 17
                                }, this),
                                " — ",
                                c.email,
                                !c.demo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "bg-yellow-500 text-white px-2 py-1 rounded ml-2",
                                            onClick: ()=>handleEdit(c),
                                            children: "Edit"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/customers/page.tsx",
                                            lineNumber: 202,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "bg-red-600 text-white px-2 py-1 rounded ml-2",
                                            onClick: ()=>handleDelete(c.id),
                                            children: "Delete"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/customers/page.tsx",
                                            lineNumber: 203,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-2 rounded-full border border-amber-200 px-2 py-0.5 text-xs uppercase tracking-wide text-amber-600",
                                    children: "Demo"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/customers/page.tsx",
                                    lineNumber: 206,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true)
                    }, c.id ?? i, false, {
                        fileName: "[project]/app/dashboard/customers/page.tsx",
                        lineNumber: 179,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/dashboard/customers/page.tsx",
                lineNumber: 177,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/customers/page.tsx",
        lineNumber: 162,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_d5a8e6b7._.js.map