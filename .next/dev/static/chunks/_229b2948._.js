(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/dashboard/tasks/KanbanBoard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>KanbanBoard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hello$2d$pangea$2f$dnd$2f$dist$2f$dnd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@hello-pangea/dnd/dist/dnd.esm.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const STATUSES = [
    "todo",
    "in-progress",
    "done"
];
function KanbanBoard({ tasks, onStatusChange }) {
    _s();
    const [columns, setColumns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "KanbanBoard.useState": ()=>{
            const grouped = {
                todo: [],
                "in-progress": [],
                done: []
            };
            tasks.forEach({
                "KanbanBoard.useState": (t)=>grouped[t.status]?.push(t)
            }["KanbanBoard.useState"]);
            return grouped;
        }
    }["KanbanBoard.useState"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "KanbanBoard.useEffect": ()=>{
            // eslint-disable-next-line react-hooks/set-state-in-effect -- rebuild columns when upstream tasks array changes
            setColumns({
                "KanbanBoard.useEffect": ()=>{
                    const next = {
                        todo: [],
                        "in-progress": [],
                        done: []
                    };
                    tasks.forEach({
                        "KanbanBoard.useEffect": (t)=>next[t.status]?.push(t)
                    }["KanbanBoard.useEffect"]);
                    return next;
                }
            }["KanbanBoard.useEffect"]);
        }
    }["KanbanBoard.useEffect"], [
        tasks
    ]);
    function handleDragEnd(result) {
        const { source, destination } = result;
        if (!destination) return;
        const fromCol = source.droppableId;
        const toCol = destination.droppableId;
        if (fromCol !== toCol) {
            const task = columns[fromCol][source.index];
            if (task) {
                onStatusChange(task.id, toCol);
            }
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hello$2d$pangea$2f$dnd$2f$dist$2f$dnd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DragDropContext"], {
        onDragEnd: handleDragEnd,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex gap-4 w-full",
            children: STATUSES.map((status)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hello$2d$pangea$2f$dnd$2f$dist$2f$dnd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Droppable"], {
                    droppableId: status,
                    children: (provided)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: provided.innerRef,
                            ...provided.droppableProps,
                            className: "flex-1 bg-gray-100 rounded p-2 min-h-[300px]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "font-bold mb-2 capitalize",
                                    children: status.replace("-", " ")
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tasks/KanbanBoard.tsx",
                                    lineNumber: 51,
                                    columnNumber: 17
                                }, this),
                                columns[status].map((task, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hello$2d$pangea$2f$dnd$2f$dist$2f$dnd$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Draggable"], {
                                        draggableId: task.id.toString(),
                                        index: idx,
                                        children: (prov)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                ref: prov.innerRef,
                                                ...prov.draggableProps,
                                                ...prov.dragHandleProps,
                                                className: "bg-white rounded shadow p-2 mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-semibold",
                                                        children: task.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/tasks/KanbanBoard.tsx",
                                                        lineNumber: 56,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-gray-500",
                                                        children: [
                                                            Math.floor(task.seconds / 60),
                                                            ":",
                                                            (task.seconds % 60).toString().padStart(2, "0"),
                                                            " min"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/tasks/KanbanBoard.tsx",
                                                        lineNumber: 57,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/dashboard/tasks/KanbanBoard.tsx",
                                                lineNumber: 55,
                                                columnNumber: 23
                                            }, this)
                                    }, task.id, false, {
                                        fileName: "[project]/app/dashboard/tasks/KanbanBoard.tsx",
                                        lineNumber: 53,
                                        columnNumber: 19
                                    }, this)),
                                provided.placeholder
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/tasks/KanbanBoard.tsx",
                            lineNumber: 50,
                            columnNumber: 15
                        }, this)
                }, status, false, {
                    fileName: "[project]/app/dashboard/tasks/KanbanBoard.tsx",
                    lineNumber: 48,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/app/dashboard/tasks/KanbanBoard.tsx",
            lineNumber: 46,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/dashboard/tasks/KanbanBoard.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
_s(KanbanBoard, "RHG+ugvPZ3TsqMEGuB9sp+Nqkv8=");
_c = KanbanBoard;
var _c;
__turbopack_context__.k.register(_c, "KanbanBoard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dashboard/tasks/TaskForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TaskForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function TaskForm({ onAdd, crew = [], projects = [] }) {
    _s();
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [assigneeId, setAssigneeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [projectId, setProjectId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [billable, setBillable] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    async function handleSubmit(e) {
        e.preventDefault();
        setSuccess("");
        setError("");
        if (!name) {
            setError("Task name is required.");
            return;
        }
        const selectedCrew = crew.find((member)=>member.id === Number(assigneeId));
        const ok = await onAdd({
            name,
            description,
            assigned_to: selectedCrew?.name,
            crew_member_id: selectedCrew?.id ?? null,
            project_id: projectId ? Number(projectId) : null,
            billable
        });
        if (ok) {
            setSuccess("Task added!");
            setName("");
            setDescription("");
            setAssigneeId("");
            setProjectId("");
            setBillable(true);
        } else {
            setError("Failed to add task.");
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "mb-4 flex flex-col gap-2 w-full max-w-xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                className: "border p-2 rounded",
                placeholder: "Task Name",
                value: name,
                onChange: (e)=>setName(e.target.value),
                required: true
            }, void 0, false, {
                fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                className: "border p-2 rounded",
                placeholder: "Description",
                value: description,
                onChange: (e)=>setDescription(e.target.value)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            crew.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                className: "border p-2 rounded",
                value: assigneeId,
                onChange: (e)=>setAssigneeId(e.target.value),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "",
                        children: "Select crew member"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this),
                    crew.map((member)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: member.id,
                            children: [
                                member.name,
                                " — R",
                                Number(member.hourly_rate || 0).toFixed(0),
                                "/hr"
                            ]
                        }, member.id, true, {
                            fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                            lineNumber: 71,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                lineNumber: 64,
                columnNumber: 9
            }, this),
            projects.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                className: "border p-2 rounded",
                value: projectId,
                onChange: (e)=>setProjectId(e.target.value),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "",
                        children: "Select project"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this),
                    projects.map((project)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: project.id,
                            children: project.name
                        }, project.id, false, {
                            fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                            lineNumber: 85,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                lineNumber: 78,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-semibold",
                        children: "Task type"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "inline-flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "radio",
                                name: "billable",
                                value: "billable",
                                checked: billable,
                                onChange: ()=>setBillable(true)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this),
                            "Billable"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "inline-flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "radio",
                                name: "billable",
                                value: "non-billable",
                                checked: !billable,
                                onChange: ()=>setBillable(false)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, this),
                            "Non-billable"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "bg-blue-600 text-white px-4 py-2 rounded min-w-[100px]",
                type: "submit",
                children: "Add"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this),
            success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-green-600 text-sm mt-1",
                children: success
            }, void 0, false, {
                fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                lineNumber: 101,
                columnNumber: 19
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-600 text-sm mt-1",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
                lineNumber: 102,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/tasks/TaskForm.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(TaskForm, "Cts4MV/gNT6yqVKkxBikl7uy0jM=");
_c = TaskForm;
var _c;
__turbopack_context__.k.register(_c, "TaskForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dashboard/tasks/TaskPhotoUpload.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TaskPhotoUpload
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function TaskPhotoUpload({ taskId, onUploaded }) {
    _s();
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    async function handleFileChange(e) {
        const input = e.target;
        const file = input.files?.[0];
        if (!file) return;
        setUploading(true);
        setMessage(null);
        try {
            const payload = new FormData();
            payload.append("taskId", String(taskId));
            payload.append("file", file);
            const response = await fetch("/api/task-photos", {
                method: "POST",
                body: payload
            });
            const result = await response.json().catch(()=>({}));
            if (!response.ok || !result?.publicUrl) {
                throw new Error(result?.error || "Unable to upload photo");
            }
            onUploaded(result.publicUrl);
            setMessage("Photo attached");
        } catch (err) {
            if (err instanceof Error) {
                setMessage(`Upload failed: ${err.message}`);
            } else {
                setMessage("Upload failed");
            }
        } finally{
            setUploading(false);
            input.value = "";
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "text-sm font-medium text-indigo-600 cursor-pointer",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "underline",
                children: "Upload photo"
            }, void 0, false, {
                fileName: "[project]/app/dashboard/tasks/TaskPhotoUpload.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: handleFileChange,
                disabled: uploading
            }, void 0, false, {
                fileName: "[project]/app/dashboard/tasks/TaskPhotoUpload.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            uploading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "ml-2 text-gray-500",
                children: "Uploading..."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/tasks/TaskPhotoUpload.tsx",
                lineNumber: 56,
                columnNumber: 21
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs text-gray-500 mt-1",
                children: message
            }, void 0, false, {
                fileName: "[project]/app/dashboard/tasks/TaskPhotoUpload.tsx",
                lineNumber: 57,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/tasks/TaskPhotoUpload.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_s(TaskPhotoUpload, "Glvz4EQZG4QgO9W4ORTcPvdi3w4=");
_c = TaskPhotoUpload;
var _c;
__turbopack_context__.k.register(_c, "TaskPhotoUpload");
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
"[project]/app/dashboard/tasks/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TasksPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$tasks$2f$KanbanBoard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dashboard/tasks/KanbanBoard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$tasks$2f$TaskForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dashboard/tasks/TaskForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$tasks$2f$TaskPhotoUpload$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dashboard/tasks/TaskPhotoUpload.tsx [app-client] (ecmascript)");
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
;
;
;
;
;
;
function formatSeconds(seconds = 0) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
function normalizeTask(task) {
    const crewMember = task.crew_member ?? null;
    const crewMemberId = typeof task.crew_member_id === "number" ? task.crew_member_id : crewMember?.id ?? null;
    const project = task.project ?? null;
    const projectId = typeof task.project_id === "number" ? task.project_id : project?.id ?? null;
    return {
        id: task.id,
        name: task.name ?? "",
        description: task.description,
        seconds: typeof task.seconds === "number" ? task.seconds : 0,
        status: task.status ?? "todo",
        photo_url: task.photo_url,
        assigned_to: task.assigned_to ?? crewMember?.name ?? null,
        crew_member_id: crewMemberId,
        billable: typeof task.billable === "boolean" ? task.billable : true,
        crew_member: crewMember,
        project_id: projectId,
        project,
        demo: Boolean(task.demo)
    };
}
function TasksPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [tasks, setTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [customers, setCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [crew, setCrew] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [projects, setProjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [demoTasksData, setDemoTasksData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [demoCustomersData, setDemoCustomersData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [demoCrewData, setDemoCrewData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [demoProjectsData, setDemoProjectsData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [crewForm, setCrewForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        rate: ""
    });
    const [crewFlash, setCrewFlash] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        success: "",
        error: ""
    });
    const [crewSaving, setCrewSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [invoiceTask, setInvoiceTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [invoiceCustomer, setInvoiceCustomer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [invoiceError, setInvoiceError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [activeTaskId, setActiveTaskId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [timerSeconds, setTimerSeconds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const timerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isDemoTask = (taskId)=>taskId ? tasks.find((task)=>task.id === taskId)?.demo : false;
    const fetchTasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TasksPage.useCallback[fetchTasks]": async (resolvedUserId)=>{
            const allowDemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canUseDemoFixtures"])(resolvedUserId);
            try {
                const res = await fetch(`/api/tasks?user_id=${resolvedUserId}`);
                if (!res.ok) throw new Error("Failed to load tasks");
                const data = await res.json();
                const list = Array.isArray(data) ? data : [];
                if (list.length) {
                    setTasks(list.map(normalizeTask));
                    setDemoTasksData(false);
                } else if (allowDemo) {
                    setTasks((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoTasks"])(resolvedUserId).map(normalizeTask));
                    setDemoTasksData(true);
                } else {
                    setTasks([]);
                    setDemoTasksData(false);
                }
            } catch  {
                if (allowDemo) {
                    setTasks((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoTasks"])(resolvedUserId).map(normalizeTask));
                    setDemoTasksData(true);
                } else {
                    setTasks([]);
                    setDemoTasksData(false);
                }
                setError("Unable to load tasks");
            }
        }
    }["TasksPage.useCallback[fetchTasks]"], []);
    const fetchCustomers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TasksPage.useCallback[fetchCustomers]": async (resolvedUserId)=>{
            const allowDemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canUseDemoFixtures"])(resolvedUserId);
            try {
                const res = await fetch(`/api/customers?user_id=${resolvedUserId}`);
                if (!res.ok) throw new Error("Failed to load customers");
                const data = await res.json();
                const list = Array.isArray(data) ? data : [];
                if (list.length) {
                    setCustomers(list);
                    setDemoCustomersData(false);
                } else if (allowDemo) {
                    setCustomers((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoCustomers"])(resolvedUserId));
                    setDemoCustomersData(true);
                } else {
                    setCustomers([]);
                    setDemoCustomersData(false);
                }
            } catch  {
                if (allowDemo) {
                    setCustomers((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoCustomers"])(resolvedUserId));
                    setDemoCustomersData(true);
                } else {
                    setCustomers([]);
                    setDemoCustomersData(false);
                }
            }
        }
    }["TasksPage.useCallback[fetchCustomers]"], []);
    const fetchCrew = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TasksPage.useCallback[fetchCrew]": async (resolvedUserId)=>{
            const allowDemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canUseDemoFixtures"])(resolvedUserId);
            try {
                const res = await fetch(`/api/crew?user_id=${resolvedUserId}`);
                if (!res.ok) throw new Error("Failed to load crew");
                const data = await res.json();
                const roster = Array.isArray(data) ? [
                    ...data
                ].sort({
                    "TasksPage.useCallback[fetchCrew]": (a, b)=>a.name.localeCompare(b.name)
                }["TasksPage.useCallback[fetchCrew]"]) : [];
                if (roster.length) {
                    setCrew(roster);
                    setDemoCrewData(false);
                } else if (allowDemo) {
                    const fallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoCrew"])(resolvedUserId).sort({
                        "TasksPage.useCallback[fetchCrew].fallback": (a, b)=>a.name.localeCompare(b.name)
                    }["TasksPage.useCallback[fetchCrew].fallback"]);
                    setCrew(fallback);
                    setDemoCrewData(true);
                } else {
                    setCrew([]);
                    setDemoCrewData(false);
                }
            } catch  {
                if (allowDemo) {
                    const fallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoCrew"])(resolvedUserId).sort({
                        "TasksPage.useCallback[fetchCrew].fallback": (a, b)=>a.name.localeCompare(b.name)
                    }["TasksPage.useCallback[fetchCrew].fallback"]);
                    setCrew(fallback);
                    setDemoCrewData(true);
                } else {
                    setCrew([]);
                    setDemoCrewData(false);
                }
                setCrewFlash({
                    success: "",
                    error: "Unable to load crew roster."
                });
            }
        }
    }["TasksPage.useCallback[fetchCrew]"], []);
    const fetchProjects = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TasksPage.useCallback[fetchProjects]": async (resolvedUserId)=>{
            const allowDemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$userIdentity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canUseDemoFixtures"])(resolvedUserId);
            try {
                const res = await fetch(`/api/projects?user_id=${resolvedUserId}`);
                if (!res.ok) throw new Error("Failed to load projects");
                const data = await res.json();
                const list = Array.isArray(data) ? data : [];
                if (list.length) {
                    setProjects(list);
                    setDemoProjectsData(false);
                } else if (allowDemo) {
                    setProjects((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoProjects"])(resolvedUserId));
                    setDemoProjectsData(true);
                } else {
                    setProjects([]);
                    setDemoProjectsData(false);
                }
            } catch  {
                if (allowDemo) {
                    setProjects((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$demoMockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDemoProjects"])(resolvedUserId));
                    setDemoProjectsData(true);
                } else {
                    setProjects([]);
                    setDemoProjectsData(false);
                }
            }
        }
    }["TasksPage.useCallback[fetchProjects]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TasksPage.useEffect": ()=>{
            let active = true;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$clientUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureClientUserId"])().then({
                "TasksPage.useEffect": (id)=>{
                    if (active) setUserId(id);
                }
            }["TasksPage.useEffect"]).catch({
                "TasksPage.useEffect": ()=>{
                    if (active) setError("Unable to determine user context.");
                }
            }["TasksPage.useEffect"]);
            return ({
                "TasksPage.useEffect": ()=>{
                    active = false;
                }
            })["TasksPage.useEffect"];
        }
    }["TasksPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TasksPage.useEffect": ()=>{
            if (!userId) return;
            let mounted = true;
            async function bootstrap() {
                setLoading(true);
                await Promise.all([
                    fetchTasks(userId),
                    fetchCustomers(userId),
                    fetchCrew(userId),
                    fetchProjects(userId)
                ]);
                if (mounted) setLoading(false);
            }
            bootstrap();
            return ({
                "TasksPage.useEffect": ()=>{
                    mounted = false;
                    if (timerRef.current) clearInterval(timerRef.current);
                }
            })["TasksPage.useEffect"];
        }
    }["TasksPage.useEffect"], [
        fetchCustomers,
        fetchCrew,
        fetchProjects,
        fetchTasks,
        userId
    ]);
    async function handleAddTask(taskInput) {
        if (!userId) {
            setError("Resolving user...");
            return false;
        }
        setLoading(true);
        setError(null);
        try {
            const payload = {
                name: taskInput.name,
                description: taskInput.description,
                status: "todo",
                seconds: 0,
                user_id: userId,
                assigned_to: taskInput.assigned_to || null,
                crew_member_id: taskInput.crew_member_id ?? null,
                project_id: taskInput.project_id ?? null,
                billable: taskInput.billable ?? true
            };
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Failed to add task");
            const newTask = normalizeTask(await res.json());
            setTasks((prev)=>[
                    newTask,
                    ...prev.filter((task)=>!task.demo)
                ]);
            setDemoTasksData(false);
            return true;
        } catch  {
            setError("Failed to add task");
            return false;
        } finally{
            setLoading(false);
        }
    }
    async function handleCrewSubmit(e) {
        e.preventDefault();
        if (!userId) {
            setCrewFlash({
                success: "",
                error: "Resolving user..."
            });
            return;
        }
        if (!crewForm.name.trim()) {
            setCrewFlash({
                success: "",
                error: "Enter a crew name."
            });
            return;
        }
        const hourlyRate = Number(crewForm.rate || 0);
        if (!Number.isFinite(hourlyRate) || hourlyRate < 0) {
            setCrewFlash({
                success: "",
                error: "Enter a valid hourly rate."
            });
            return;
        }
        setCrewSaving(true);
        setCrewFlash({
            success: "",
            error: ""
        });
        try {
            const res = await fetch("/api/crew", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: crewForm.name.trim(),
                    hourly_rate: hourlyRate,
                    user_id: userId
                })
            });
            if (!res.ok) throw new Error("Failed to add crew");
            const newMember = await res.json();
            setCrew((prev)=>[
                    ...prev.filter((member)=>!member.demo),
                    newMember
                ].sort((a, b)=>a.name.localeCompare(b.name)));
            setDemoCrewData(false);
            setCrewForm({
                name: "",
                rate: ""
            });
            setCrewFlash({
                success: "Crew member added.",
                error: ""
            });
        } catch  {
            setCrewFlash({
                success: "",
                error: "Failed to add crew member."
            });
        } finally{
            setCrewSaving(false);
        }
    }
    async function handleStatusChange(id, status) {
        if (!userId) return;
        if (isDemoTask(id)) {
            setError("Demo tasks are read-only.");
            return;
        }
        setError(null);
        try {
            const res = await fetch("/api/tasks", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id,
                    status,
                    user_id: userId
                })
            });
            if (!res.ok) throw new Error();
            const updated = normalizeTask(await res.json());
            setTasks((prev)=>prev.map((t)=>t.id === id ? updated : t));
        } catch  {
            setError("Failed to update status");
        }
    }
    function startTimer(taskId) {
        if (isDemoTask(taskId)) {
            setError("Demo tasks are read-only.");
            return;
        }
        const task = tasks.find((t)=>t.id === taskId);
        if (!task?.crew_member_id) {
            setError("Assign a crew member before starting the timer.");
            return;
        }
        if (timerRef.current) clearInterval(timerRef.current);
        setActiveTaskId(taskId);
        setTimerSeconds(0);
        timerRef.current = setInterval(()=>setTimerSeconds((prev)=>prev + 1), 1000);
    }
    async function stopTimer(save = true) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (!activeTaskId) return;
        if (!save) {
            setActiveTaskId(null);
            setTimerSeconds(0);
            return;
        }
        if (!userId) return;
        try {
            const runningTask = tasks.find((t)=>t.id === activeTaskId);
            if (runningTask?.demo) {
                setActiveTaskId(null);
                setTimerSeconds(0);
                return;
            }
            const totalSeconds = (runningTask?.seconds || 0) + timerSeconds;
            const res = await fetch("/api/tasks", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: activeTaskId,
                    seconds: totalSeconds,
                    user_id: userId
                })
            });
            if (!res.ok) throw new Error();
            const updated = normalizeTask(await res.json());
            setTasks((prev)=>prev.map((t)=>t.id === activeTaskId ? updated : t));
        } catch  {
            setError("Failed to save tracked time");
        } finally{
            setActiveTaskId(null);
            setTimerSeconds(0);
        }
    }
    async function handlePhotoUploaded(taskId, url) {
        if (isDemoTask(taskId)) {
            setTasks((prev)=>prev.map((task)=>task.id === taskId ? {
                        ...task,
                        photo_url: url
                    } : task));
            return;
        }
        if (!userId) return;
        try {
            const res = await fetch("/api/tasks", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: taskId,
                    photo_url: url,
                    user_id: userId
                })
            });
            if (!res.ok) throw new Error();
            const updated = normalizeTask(await res.json());
            setTasks((prev)=>prev.map((t)=>t.id === taskId ? updated : t));
        } catch  {
            setError("Failed to attach photo");
        }
    }
    async function handleAssignmentChange(taskId, crewIdValue) {
        if (!userId) return;
        setError(null);
        try {
            const crewId = crewIdValue ? Number(crewIdValue) : null;
            const selected = crew.find((member)=>member.id === crewId) || null;
            const res = await fetch("/api/tasks", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: taskId,
                    assigned_to: selected?.name ?? null,
                    crew_member_id: crewId,
                    user_id: userId
                })
            });
            if (!res.ok) throw new Error();
            const updated = normalizeTask(await res.json());
            setTasks((prev)=>prev.map((t)=>t.id === taskId ? updated : t));
        } catch  {
            setError("Failed to assign crew member");
        }
    }
    async function handleProjectChange(taskId, projectIdValue) {
        const projectId = projectIdValue ? Number(projectIdValue) : null;
        const projectMeta = projectId ? projects.find((project)=>project.id === projectId) ?? null : null;
        if (isDemoTask(taskId)) {
            setTasks((prev)=>prev.map((task)=>task.id === taskId ? {
                        ...task,
                        project_id: projectId,
                        project: projectMeta
                    } : task));
            return;
        }
        if (!userId) return;
        setError(null);
        try {
            const res = await fetch("/api/tasks", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: taskId,
                    project_id: projectId,
                    user_id: userId
                })
            });
            if (!res.ok) throw new Error();
            const updated = normalizeTask(await res.json());
            setTasks((prev)=>prev.map((t)=>t.id === taskId ? updated : t));
        } catch  {
            setError("Failed to assign project");
        }
    }
    function openInvoice(task) {
        if (!task.billable) return;
        setInvoiceTask(task);
        setInvoiceCustomer("" + (customers[0]?.id ?? ""));
        setInvoiceError("");
    }
    function closeInvoiceModal() {
        setInvoiceTask(null);
        setInvoiceCustomer("");
        setInvoiceError("");
    }
    function handleInvoiceConfirm() {
        if (!invoiceTask || !invoiceCustomer) {
            setInvoiceError("Select a customer to continue");
            return;
        }
        const params = new URLSearchParams({
            fromTask: invoiceTask.id.toString(),
            customerId: invoiceCustomer,
            taskName: invoiceTask.name,
            taskSeconds: String(invoiceTask.seconds || 0)
        });
        if (invoiceTask.project_id) {
            params.set("taskProjectId", String(invoiceTask.project_id));
        }
        if (invoiceTask.project?.name) {
            params.set("taskProjectName", invoiceTask.project.name);
        }
        router.push(`/dashboard/invoices?${params.toString()}`);
        closeInvoiceModal();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "p-8 space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold",
                                children: "Tasks & site evidence"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                lineNumber: 482,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600",
                                children: "Add tasks, capture proof, and push ready work to invoicing."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                lineNumber: 483,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                        lineNumber: 481,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard/invoices",
                        className: "inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50",
                        children: "Open invoicing"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                        lineNumber: 485,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/tasks/page.tsx",
                lineNumber: 480,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-white rounded-xl shadow p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-semibold",
                                        children: "Crew roster"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                        lineNumber: 493,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-500",
                                        children: "Capture who is on site and what their hourly rate is before assigning work."
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                        lineNumber: 494,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                lineNumber: 492,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                className: "flex flex-col gap-2 md:flex-row md:items-end",
                                onSubmit: handleCrewSubmit,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs font-semibold text-gray-500",
                                                children: "Name"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                lineNumber: 498,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: "mt-1 border rounded px-3 py-2 text-sm",
                                                placeholder: "Crew member",
                                                value: crewForm.name,
                                                onChange: (e)=>setCrewForm((form)=>({
                                                            ...form,
                                                            name: e.target.value
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                lineNumber: 499,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                        lineNumber: 497,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs font-semibold text-gray-500",
                                                children: "Rate (R/hr)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                lineNumber: 507,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                min: "0",
                                                step: "5",
                                                className: "mt-1 border rounded px-3 py-2 text-sm",
                                                placeholder: "400",
                                                value: crewForm.rate,
                                                onChange: (e)=>setCrewForm((form)=>({
                                                            ...form,
                                                            rate: e.target.value
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                lineNumber: 508,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                        lineNumber: 506,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "bg-emerald-600 text-white px-4 py-2 rounded font-semibold mt-2 md:mt-0",
                                        disabled: crewSaving,
                                        children: crewSaving ? "Saving..." : "Add crew"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                        lineNumber: 518,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                lineNumber: 496,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                        lineNumber: 491,
                        columnNumber: 9
                    }, this),
                    crewFlash.success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-green-600 text-sm mt-3",
                        children: crewFlash.success
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                        lineNumber: 527,
                        columnNumber: 31
                    }, this),
                    crewFlash.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-red-600 text-sm mt-3",
                        children: crewFlash.error
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                        lineNumber: 528,
                        columnNumber: 29
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
                        children: [
                            crew.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-500",
                                children: "No crew captured yet."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                lineNumber: 530,
                                columnNumber: 33
                            }, this),
                            crew.map((member)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border rounded-lg px-4 py-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold",
                                            children: member.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                                            lineNumber: 533,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-500",
                                            children: [
                                                "R",
                                                Number(member.hourly_rate || 0).toFixed(2),
                                                " / hr"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                                            lineNumber: 534,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, member.id, true, {
                                    fileName: "[project]/app/dashboard/tasks/page.tsx",
                                    lineNumber: 532,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                        lineNumber: 529,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/tasks/page.tsx",
                lineNumber: 490,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-white rounded-xl shadow p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold mb-4",
                        children: "Add a task"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                        lineNumber: 541,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$tasks$2f$TaskForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onAdd: handleAddTask,
                        crew: crew,
                        projects: projects
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                        lineNumber: 542,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/tasks/page.tsx",
                lineNumber: 540,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-blue-600",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/app/dashboard/tasks/page.tsx",
                lineNumber: 545,
                columnNumber: 19
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-red-600",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/dashboard/tasks/page.tsx",
                lineNumber: 546,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-white rounded-xl shadow p-6 overflow-x-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold mb-4",
                        children: "Live task tracker"
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                        lineNumber: 549,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "text-left text-gray-500 uppercase text-xs",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "py-2",
                                            children: "Task"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                                            lineNumber: 553,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "py-2",
                                            children: "Status"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                                            lineNumber: 554,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "py-2",
                                            children: "Time & proof"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                                            lineNumber: 555,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "py-2",
                                            children: "Actions"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                                            lineNumber: 556,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/tasks/page.tsx",
                                    lineNumber: 552,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                lineNumber: 551,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: [
                                    tasks.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: 5,
                                            className: "py-6 text-center text-gray-500",
                                            children: "No tasks yet. Add one above to get started."
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                                            lineNumber: 562,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                        lineNumber: 561,
                                        columnNumber: 15
                                    }, this),
                                    tasks.map((task)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-t border-gray-100 align-top",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold text-gray-900",
                                                            children: task.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                            lineNumber: 568,
                                                            columnNumber: 19
                                                        }, this),
                                                        task.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-500 text-xs",
                                                            children: task.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                            lineNumber: 569,
                                                            columnNumber: 40
                                                        }, this),
                                                        task.project && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-indigo-600",
                                                            children: [
                                                                "Project: ",
                                                                task.project.name
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                            lineNumber: 570,
                                                            columnNumber: 36
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: `mt-1 text-xs font-semibold ${task.billable ? "text-emerald-600" : "text-gray-500"}`,
                                                            children: task.billable ? "Billable" : "Non-billable"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                            lineNumber: 571,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                    lineNumber: 567,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        className: "border rounded px-2 py-1 text-sm",
                                                        value: task.status,
                                                        onChange: (e)=>handleStatusChange(task.id, e.target.value),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "todo",
                                                                children: "To do"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                lineNumber: 581,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "in-progress",
                                                                children: "In progress"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                lineNumber: 582,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "done",
                                                                children: "Done"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                lineNumber: 583,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                        lineNumber: 576,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                    lineNumber: 575,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-xs font-semibold text-gray-500",
                                                                        children: "Crew member"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                        lineNumber: 589,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        className: "mt-1 w-full rounded border px-2 py-1 text-sm",
                                                                        value: task.crew_member_id ?? "",
                                                                        onChange: (e)=>handleAssignmentChange(task.id, e.target.value),
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "",
                                                                                children: "Select crew"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                                lineNumber: 595,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            crew.map((member)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: member.id,
                                                                                    children: [
                                                                                        member.name,
                                                                                        " — R",
                                                                                        member.hourly_rate?.toFixed(0),
                                                                                        "/hr"
                                                                                    ]
                                                                                }, member.id, true, {
                                                                                    fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                                    lineNumber: 597,
                                                                                    columnNumber: 27
                                                                                }, this))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                        lineNumber: 590,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    !task.crew_member_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "mt-1 text-xs text-amber-600",
                                                                        children: "Assign someone to unlock the timer."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                        lineNumber: 602,
                                                                        columnNumber: 48
                                                                    }, this),
                                                                    task.crew_member && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "mt-1 text-xs text-gray-500",
                                                                        children: [
                                                                            task.crew_member.name,
                                                                            " @ R",
                                                                            Number(task.crew_member.hourly_rate || 0).toFixed(2),
                                                                            "/hr"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                        lineNumber: 604,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                lineNumber: 588,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "block text-xs font-semibold text-gray-500",
                                                                        children: "Project"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                        lineNumber: 608,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        className: "mt-1 w-full rounded border px-2 py-1 text-sm",
                                                                        value: task.project_id ?? "",
                                                                        onChange: (e)=>handleProjectChange(task.id, e.target.value),
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "",
                                                                                children: "Select project"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                                lineNumber: 614,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            projects.map((project)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: project.id,
                                                                                    children: project.name
                                                                                }, project.id, false, {
                                                                                    fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                                    lineNumber: 616,
                                                                                    columnNumber: 27
                                                                                }, this))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                        lineNumber: 609,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    !task.project_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "mt-1 text-xs text-amber-600",
                                                                        children: "Link a project before invoicing."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                        lineNumber: 621,
                                                                        columnNumber: 44
                                                                    }, this),
                                                                    task.project && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "mt-1 text-xs text-gray-500",
                                                                        children: [
                                                                            "Linked to ",
                                                                            task.project.name
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                        lineNumber: 622,
                                                                        columnNumber: 40
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                lineNumber: 607,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-mono text-lg",
                                                                        children: formatSeconds((task.seconds || 0) + (activeTaskId === task.id ? timerSeconds : 0))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                        lineNumber: 625,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    activeTaskId === task.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                className: "text-xs text-green-600",
                                                                                onClick: ()=>stopTimer(true),
                                                                                children: "Save"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                                lineNumber: 630,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                className: "text-xs text-gray-500",
                                                                                onClick: ()=>stopTimer(false),
                                                                                children: "Cancel"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                                lineNumber: 631,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        className: "text-xs text-indigo-600 disabled:text-gray-400",
                                                                        onClick: ()=>startTimer(task.id),
                                                                        disabled: !task.crew_member_id,
                                                                        children: "Start timer"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                        lineNumber: 634,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                lineNumber: 624,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$tasks$2f$TaskPhotoUpload$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                taskId: task.id,
                                                                onUploaded: (url)=>handlePhotoUploaded(task.id, url)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                lineNumber: 643,
                                                                columnNumber: 21
                                                            }, this),
                                                            task.photo_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                src: task.photo_url,
                                                                alt: "Task evidence",
                                                                width: 96,
                                                                height: 96,
                                                                className: "h-24 w-24 rounded border object-cover"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                                lineNumber: 645,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                        lineNumber: 587,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                    lineNumber: 586,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "py-3 space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: `${task.billable ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"} px-3 py-1 rounded text-xs`,
                                                            onClick: ()=>openInvoice(task),
                                                            disabled: !task.billable,
                                                            children: "Invoice"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                            lineNumber: 650,
                                                            columnNumber: 19
                                                        }, this),
                                                        !task.billable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-500",
                                                            children: "Switch to billable to invoice this work."
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                            lineNumber: 657,
                                                            columnNumber: 38
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/tasks/page.tsx",
                                                    lineNumber: 649,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, task.id, true, {
                                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                                            lineNumber: 566,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                lineNumber: 559,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                        lineNumber: 550,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/tasks/page.tsx",
                lineNumber: 548,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "bg-white rounded-xl shadow p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold",
                                children: "Kanban board"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                lineNumber: 667,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500",
                                children: "Drag cards to update status or use the dropdown above."
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/tasks/page.tsx",
                                lineNumber: 668,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                        lineNumber: 666,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$tasks$2f$KanbanBoard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        tasks: tasks,
                        onStatusChange: handleStatusChange
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                        lineNumber: 670,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/tasks/page.tsx",
                lineNumber: 665,
                columnNumber: 7
            }, this),
            invoiceTask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl shadow-xl p-6 w-full max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-semibold mb-2",
                            children: [
                                "Invoice “",
                                invoiceTask.name,
                                "”"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                            lineNumber: 676,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-500 mb-4",
                            children: "Choose the customer to send this work to. You will add line items on the invoice screen."
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                            lineNumber: 677,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium mb-2",
                            children: "Customer"
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                            lineNumber: 678,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            className: "w-full border rounded px-3 py-2",
                            value: invoiceCustomer,
                            onChange: (e)=>{
                                setInvoiceCustomer(e.target.value);
                                setInvoiceError("");
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: "",
                                    children: "Select customer"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tasks/page.tsx",
                                    lineNumber: 687,
                                    columnNumber: 15
                                }, this),
                                customers.map((customer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: customer.id,
                                        children: customer.name
                                    }, customer.id, false, {
                                        fileName: "[project]/app/dashboard/tasks/page.tsx",
                                        lineNumber: 689,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                            lineNumber: 679,
                            columnNumber: 13
                        }, this),
                        invoiceError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-red-600 text-sm mt-2",
                            children: invoiceError
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                            lineNumber: 692,
                            columnNumber: 30
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-3 mt-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "text-gray-600",
                                    onClick: closeInvoiceModal,
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tasks/page.tsx",
                                    lineNumber: 694,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "bg-indigo-600 text-white px-4 py-2 rounded",
                                    onClick: handleInvoiceConfirm,
                                    children: "Go to invoice"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/tasks/page.tsx",
                                    lineNumber: 695,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/tasks/page.tsx",
                            lineNumber: 693,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/tasks/page.tsx",
                    lineNumber: 675,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/tasks/page.tsx",
                lineNumber: 674,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/tasks/page.tsx",
        lineNumber: 479,
        columnNumber: 5
    }, this);
}
_s(TasksPage, "wjprnWxUCSa8HvdWbH3H4JxRjKk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = TasksPage;
var _c;
__turbopack_context__.k.register(_c, "TasksPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_229b2948._.js.map