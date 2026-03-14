(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,23503,e=>{"use strict";var t=e.i(43476),s=e.i(18566);function o({label:e="← Back",className:o=""}){let i=(0,s.useRouter)();return(0,t.jsx)("button",{onClick:()=>i.back(),className:`
        inline-flex items-center gap-2 px-4 py-2 
        bg-gray-100 hover:bg-gray-200 
        text-gray-700 rounded-lg 
        font-medium transition-colors
        ${o}
      `,children:e})}e.s(["BackButton",()=>o])},35040,e=>{"use strict";var t=e.i(53210),s=e.i(94124);async function o(){let e=e=>{localStorage.setItem("demoUserId",e)},o=()=>(0,s.normalizeUserId)(localStorage.getItem("demoUserId"),void 0);if("true"===localStorage.getItem("demoSession")){let e=o();if(e&&(0,s.isDemoUserId)(e))return e}try{let{data:o,error:i}=await t.supabase.auth.getUser();if(!i){let t=o?.user?.user_metadata?.demoUserId||o?.user?.id,i=(0,s.normalizeUserId)(t,void 0);if(i)return(0,s.isDemoUserId)(i)||localStorage.removeItem("demoSession"),e(i),i}}catch(e){console.warn("Unable to resolve Supabase user id",e)}let i=o();return i||(e(s.DEFAULT_DEMO_USER_ID),s.DEFAULT_DEMO_USER_ID)}e.s(["ensureClientUserId",()=>o])},56282,e=>{"use strict";var t=e.i(94124);let s=(0,t.normalizeUserId)(t.DEMO_ADMIN_USER_ID),o=(0,t.normalizeUserId)(t.DEMO_SUBCONTRACTOR_USER_ID,s),i=e=>(0,t.normalizeUserId)(e,s),r=e=>JSON.parse(JSON.stringify(e)),a={[s]:[{id:6001,name:"Haul Road Rehab",description:"Stabilise, widen, and cap the 4 km haul road between pits.",photo_url:"https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=60",demo:!0},{id:6002,name:"Process Plant Refurb",description:"Replace worn chute liners and recalibrate secondary crushers.",photo_url:"https://images.unsplash.com/photo-1457449940276-e8deed18bfff?auto=format&fit=crop&w=600&q=60",demo:!0},{id:6003,name:"Tailings Storage Lift",description:"Raise TSF wall by 3 m with compacted engineered fill.",photo_url:"https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=60",demo:!0}],[o]:[{id:6101,name:"Drill & Blast Campaign",description:"120-hole pattern for north pit pushback.",photo_url:"https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=60",demo:!0},{id:6102,name:"Crusher Maintenance Blitz",description:"Three-day shutdown to swap liners and bearings.",photo_url:"https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=600&q=60",demo:!0}]},n={[s]:[{id:6201,name:"Mbali Civil Works",email:"projects@mbali.co.za",demo:!0},{id:6202,name:"Kopano Mining JV",email:"ops@kopanomining.africa",demo:!0},{id:6203,name:"Sunset Aggregates",email:"finance@sunsetagg.co.za",demo:!0}],[o]:[{id:6211,name:"Highveld Crushing",email:"info@highveldcrushing.co.za",demo:!0},{id:6212,name:"MoAfrika Minerals",email:"admin@moafrika-minerals.co.za",demo:!0}]},l={[s]:[{id:6301,name:"Diesel (50 ppm)",price:24.85,stock_in:18e3,stock_used:13200,item_type:"physical",demo:!0},{id:6302,name:"Explosive Pack ANFO (1 t)",price:8650,stock_in:18,stock_used:12,item_type:"physical",demo:!0},{id:6303,name:"On-site Survey Crew (day)",price:7800,stock_in:22,stock_used:15,item_type:"service",demo:!0}],[o]:[{id:6311,name:"Crusher Specialist Callout",price:12500,stock_in:12,stock_used:6,item_type:"service",demo:!0},{id:6312,name:"Wear Plate Set",price:9800,stock_in:30,stock_used:21,item_type:"physical",demo:!0}]},d={[s]:[{id:6401,name:"Sipho Dlamini",hourly_rate:420,demo:!0},{id:6402,name:"Lerato Maseko",hourly_rate:395,demo:!0},{id:6403,name:"Thando Nkosi",hourly_rate:380,demo:!0},{id:6404,name:"Nomsa Khumalo",hourly_rate:360,demo:!0}],[o]:[{id:6411,name:"Neo Mbele",hourly_rate:410,demo:!0},{id:6412,name:"Kagiso Molefe",hourly_rate:390,demo:!0}]},c={[s]:[{id:6501,name:"Survey control & pegging",description:"Lay out widened alignment and check crossfall.",status:"done",seconds:16200,assigned_to:"Sipho Dlamini",crew_member_id:6401,crew_member:d[s][0],billable:!0,photo_url:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=60",demo:!0},{id:6502,name:"Lime stabilisation run 1",description:"Blend lime across km 2-3 section.",status:"in-progress",seconds:8700,assigned_to:"Lerato Maseko",crew_member_id:6402,crew_member:d[s][1],billable:!0,demo:!0},{id:6503,name:"Chute liner strip-out",description:"Remove worn liners on secondary feed chute.",status:"done",seconds:20400,assigned_to:"Thando Nkosi",crew_member_id:6403,crew_member:d[s][2],billable:!0,photo_url:"https://images.unsplash.com/photo-1504280390368-361c6d9f38f4?auto=format&fit=crop&w=400&q=60",demo:!0},{id:6504,name:"Crusher recalibration",description:"Laser align crusher gap before restart.",status:"todo",seconds:0,billable:!1,demo:!0}],[o]:[{id:6511,name:"Pattern drilling",description:"Complete 120-hole pattern with 165 mm holes.",status:"in-progress",seconds:11100,assigned_to:"Neo Mbele",crew_member_id:6411,crew_member:d[o][0],billable:!0,demo:!0},{id:6512,name:"Bearing inspection",description:"Inspect main shaft bearings during shutdown.",status:"in-progress",seconds:4200,assigned_to:"Kagiso Molefe",crew_member_id:6412,crew_member:d[o][1],billable:!1,demo:!0}]},m={[s]:[{id:6601,customer_id:6201,customer:{id:6201,name:"Mbali Civil Works"},amount:485e3,description:"Progress draw #3 - Haul road stabilisation and survey.",reference:"Haul Road Rehab",invoice_number:"FC-104",issued_on:"2026-02-12",due_on:"2026-02-27",status:"sent",currency:"ZAR",line_items:[{id:90001,name:"Survey control",quantity:3,total:45e3,project:"Haul Road Rehab",note:null,source:"timer",task_ref:"6501"},{id:90002,name:"Stabilisation crew",quantity:2,total:18e4,project:"Haul Road Rehab"}],demo:!0},{id:6602,customer_id:6202,customer:{id:6202,name:"Kopano Mining JV"},amount:32e4,description:"Process plant shutdown labour & materials.",reference:"Process Plant Refurb",invoice_number:"FC-105",issued_on:"2026-02-08",due_on:"2026-03-04",status:"draft",currency:"ZAR",line_items:[{id:90003,name:"Chute liner strip-out",quantity:1.5,total:12e4,project:"Process Plant Refurb",task_ref:"6503"},{id:90004,name:"Consumables",quantity:1,total:2e4,project:"Process Plant Refurb"}],demo:!0},{id:6603,customer_id:6203,customer:{id:6203,name:"Sunset Aggregates"},amount:215e3,description:"Tailings lift QA services (week 18).",reference:"Tailings Storage Lift",invoice_number:"FC-106",issued_on:"2026-02-01",due_on:"2026-02-28",status:"paid",currency:"ZAR",line_items:[{id:90005,name:"QA inspections",quantity:2,total:155e3,project:"Tailings Storage Lift"},{id:90006,name:"Travel & logistics",quantity:1,total:6e4,project:"Tailings Storage Lift"}],demo:!0}],[o]:[{id:6611,customer_id:6211,customer:{id:6211,name:"Highveld Crushing"},amount:155e3,description:"Crusher blitz callout fee and spares.",reference:"Crusher Maintenance Blitz",invoice_number:"SC-044",issued_on:"2026-02-10",due_on:"2026-02-25",status:"sent",currency:"ZAR",line_items:[{id:90011,name:"Specialist callout",quantity:1,total:95e3,project:"Crusher Maintenance Blitz"},{id:90012,name:"Wear parts",quantity:1,total:6e4}],demo:!0},{id:6612,customer_id:6212,customer:{id:6212,name:"MoAfrika Minerals"},amount:265e3,description:"Drill & blast campaign progress payment.",reference:"Drill & Blast",invoice_number:"SC-045",issued_on:"2026-02-05",due_on:"2026-03-05",status:"draft",currency:"ZAR",line_items:[{id:90013,name:"Pattern drilling",quantity:1,total:165e3,task_ref:"6511"},{id:90014,name:"Explosive loading",quantity:1,total:1e5}],demo:!0}]};function u(e){return r(a[i(e)]??a[s])}function p(e){return r(n[i(e)]??n[s])}function b(e){return r(l[i(e)]??l[s])}function h(e){return r(d[i(e)]??d[s])}function x(e){return r(c[i(e)]??c[s])}function f(e){return r(m[i(e)]??m[s])}e.s(["getDemoCrew",()=>h,"getDemoCustomers",()=>p,"getDemoInvoices",()=>f,"getDemoItems",()=>b,"getDemoProjects",()=>u,"getDemoTasks",()=>x])},71751,e=>{"use strict";var t=e.i(43476),s=e.i(71645),o=e.i(35040),i=e.i(56282),r=e.i(94124);let a=()=>({id:"u">typeof crypto&&"randomUUID"in crypto?crypto.randomUUID():`${Date.now()}-${Math.random()}`,itemId:"",quantity:1,projectId:"",projectCustom:"",note:"",source:null,taskRef:null}),n=e=>{if(null==e)return null;let t=Number(e);return!Number.isFinite(t)||t<=0?null:t/3600},l=e=>{let t=Math.max(1,Math.round(60*e)),s=Math.floor(t/60),o=t%60;return s&&o?`${s}h ${o}m`:s?`${s}h`:`${o}m`},d=e=>{let t=Number(e?.id);if(!Number.isFinite(t))return null;let s=Number(e?.seconds)||0,o=null;if("number"==typeof e?.project_id&&Number.isFinite(e.project_id))o=e.project_id;else if("string"==typeof e?.project_id){let t=Number(e.project_id);Number.isFinite(t)&&(o=t)}else if("number"==typeof e?.project?.id&&Number.isFinite(e.project.id))o=e.project.id;else if("string"==typeof e?.project?.id){let t=Number(e.project.id);Number.isFinite(t)&&(o=t)}let i="string"==typeof e?.project?.name?e.project.name:"string"==typeof e?.project_name?e.project_name:null;return{id:t,name:"string"==typeof e?.name&&e.name.trim()?e.name:"Tracked task",seconds:s,billable:e?.billable!==!1,project_id:o,project:i?{id:o??-1*t,name:i}:null}};function c({onAdd:e,preset:c,companyId:m}){let[u,p]=(0,s.useState)([]),[b,h]=(0,s.useState)([]),[x,f]=(0,s.useState)([]),[g,y]=(0,s.useState)([]),[v,j]=(0,s.useState)(!1),[w,N]=(0,s.useState)(!1),[_,k]=(0,s.useState)(!1),[S,I]=(0,s.useState)(!1),[C,D]=(0,s.useState)(null),[$,F]=(0,s.useState)(c?.customerId??""),[P,R]=(0,s.useState)(c?.taskName?`Work completed for task: ${c.taskName}`:""),U=n(c?.taskSeconds?Number(c.taskSeconds):null),T=U?Math.max(.25,Number(U.toFixed(2))):null,A=c?.taskProjectId?Number(c.taskProjectId):null,E="number"==typeof A&&Number.isFinite(A),q=c?.taskProjectName?.trim()??"",[M,L]=(0,s.useState)([a()]),[z,O]=(0,s.useState)({success:"",error:""}),B=(0,s.useMemo)(()=>{let e=b.find(e=>"service"===e.item_type);if(e)return e.id;let t=b.find(e=>"physical"!==e.item_type);return t?.id??b[0]?.id??""},[b]),W=(0,s.useMemo)(()=>g.filter(e=>!1!==e.billable&&Number(e.seconds)>0),[g]);(0,s.useEffect)(()=>{let e=!0;return(0,o.ensureClientUserId)().then(t=>{e&&D(t)}).catch(()=>{e&&O({success:"",error:"Unable to resolve workspace user."})}),()=>{e=!1}},[]),(0,s.useEffect)(()=>{if(!C)return;let e=(0,r.canUseDemoFixtures)(C);!async function(){try{let t=new URLSearchParams({user_id:C});m&&t.set("company_id",m);let[s,o,r,a]=await Promise.all([fetch(`/api/customers?${t.toString()}`),fetch(`/api/items?${t.toString()}`),fetch(`/api/projects?${t.toString()}`),fetch(`/api/tasks?${t.toString()}`)]),[n,l,c,u]=await Promise.all([s.ok?s.json():Promise.resolve([]),o.ok?o.json():Promise.resolve([]),r.ok?r.json():Promise.resolve([]),a.ok?a.json():Promise.resolve([])]),b=Array.isArray(n)?n:[];b.length?(p(b),j(!1)):e?(p((0,i.getDemoCustomers)(C)),j(!0)):(p([]),j(!1));let x=Array.isArray(l)?l:[];x.length?(h(x),N(!1)):e?(h((0,i.getDemoItems)(C)),N(!0)):(h([]),N(!1));let g=Array.isArray(c)?c:[];g.length?(f(g),k(!1)):e?(f((0,i.getDemoProjects)(C)),k(!0)):(f([]),k(!1));let v=(Array.isArray(u)?u:[]).map(d).filter(e=>!!e);if(v.length)y(v),I(!1);else if(e){let e=(0,i.getDemoTasks)(C).map(d).filter(Boolean);y(e),I(!0)}else y([]),I(!1)}catch{e?(p((0,i.getDemoCustomers)(C)),h((0,i.getDemoItems)(C)),f((0,i.getDemoProjects)(C)),y((0,i.getDemoTasks)(C).map(d).filter(Boolean)),j(!0),N(!0),k(!0),I(!0)):(p([]),h([]),f([]),y([]),j(!1),N(!1),k(!1),I(!1)),O({success:"",error:"Failed to load workspace data."})}}()},[C,m]),(0,s.useEffect)(()=>{c?.customerId&&F(c.customerId)},[c?.customerId]),(0,s.useEffect)(()=>{c?.taskId&&T&&L(e=>{if(e.some(e=>"timer"===e.source&&e.taskRef===c.taskId))return e;let t=e[0],s=1!==e.length||t.itemId||1!==t.quantity||t.note||""!==t.projectId&&void 0!==t.projectId||t.projectCustom?e:[];return[{...a(),itemId:B||"",quantity:T,projectId:E?A:q?"__custom__":"",projectCustom:E?"":q,note:`Auto time from ${c.taskName??"task"} (${l(T)})`,source:"timer",taskRef:c.taskId},...s]})},[c?.taskId,c?.taskName,T,E,A,q,B]),(0,s.useEffect)(()=>{b.length&&L(e=>e.map(e=>"timer"!==e.source||e.itemId?e:{...e,itemId:B||b[0].id}))},[b,B]);let H=(0,s.useMemo)(()=>M.map(e=>{let t=b.find(t=>t.id===e.itemId);return(t?.price||0)*(e.quantity||0)}),[b,M]),J=(0,s.useMemo)(()=>H.reduce((e,t)=>e+t,0),[H]);function K(e,t,s){L(o=>o.map(o=>o.id===e?{...o,[t]:s}:o))}function V(e){if("__custom__"===e.projectId)return e.projectCustom?.trim()||null;if("number"==typeof e.projectId&&Number.isFinite(e.projectId)){let t=x.find(t=>t.id===e.projectId);return t?.name??null}return null}async function Z(t){if(t.preventDefault(),O({success:"",error:""}),v||w)return void O({success:"",error:"Demo data is read-only. Connect your workspace to send live invoices."});if(!$)return void O({success:"",error:"Select a customer."});let s=M.filter(e=>e.itemId&&e.quantity>0);if(!s.length)return void O({success:"",error:"Add at least one billable line."});let o=u.find(e=>`${e.id}`===$),i=o?.id?Number(o.id):Number($),r=o?.name;if(!r||!Number.isFinite(i))return void O({success:"",error:"Customer not found."});if(!C)return void O({success:"",error:"Unable to determine workspace."});let n=s.map(e=>{let t=b.find(t=>t.id===e.itemId),s=t?.price||0,o=s*e.quantity,i=V(e);return{itemId:t?.id??("number"==typeof e.itemId?e.itemId:null),itemName:t?.name??"Item",quantity:e.quantity,rate:s,total:o,project:i,note:e.note||null,source:e.source||null,taskRef:e.taskRef||null}}),l=s.map(e=>{let t=b.find(t=>t.id===e.itemId),s=t?.price||0,o=s*e.quantity,i=V(e),r=i?` • Project: ${i}`:"",a=e.note?` — ${e.note}`:"";return`${t?.name??"Item"} x${e.quantity} @ R${s.toFixed(2)} = R${o.toFixed(2)}${r}${a}`}).join("\n"),d=[P.trim(),l].filter(Boolean).join("\n\n");await e({customerId:i,customerName:r,amount:J,description:d,reference:P,userId:C,lines:n})?(O({success:"Invoice added!",error:""}),L([a()]),R(""),c?.customerId||F("")):O({success:"",error:"Failed to add invoice."})}return(0,t.jsxs)("form",{onSubmit:Z,className:"bg-white rounded shadow-md p-6 w-full flex flex-col gap-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-xl font-bold",children:"Create Invoice"}),(0,t.jsx)("p",{className:"text-sm text-gray-500",children:"Pull items directly from your price list and tag the project per line."}),(v||w)&&(0,t.jsx)("p",{className:"mt-2 text-xs text-amber-700",children:"Sample customers/items are shown for demo purposes. Add your own data to enable submissions."})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block font-semibold mb-1",children:"Customer"}),(0,t.jsxs)("select",{className:"border p-2 rounded w-full",value:$,onChange:e=>F(e.target.value),children:[(0,t.jsx)("option",{value:"",children:"Select customer"}),u.map(e=>(0,t.jsxs)("option",{value:e.id,disabled:e.demo,children:[e.name,e.demo?" (demo)":""]},e.id))]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block font-semibold mb-1",children:"Reference"}),(0,t.jsx)("input",{className:"border p-2 rounded w-full",placeholder:"e.g. Progress draw #3",value:P,onChange:e=>R(e.target.value)})]})]}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)("h3",{className:"text-lg font-semibold",children:"Line items"}),(0,t.jsx)("button",{type:"button",className:"text-indigo-600 font-medium",onClick:function(){L(e=>[...e,a()])},children:"+ Add line"})]}),M.map((e,s)=>{let o=H[s]||0;return(0,t.jsxs)("div",{className:"border rounded-lg p-4 grid grid-cols-1 md:grid-cols-6 gap-3",children:[(0,t.jsxs)("div",{className:"md:col-span-2",children:[(0,t.jsx)("label",{className:"text-sm font-semibold mb-1 block",children:"Item"}),(0,t.jsxs)("select",{className:"border rounded w-full p-2",value:e.itemId,onChange:t=>K(e.id,"itemId",t.target.value?Number(t.target.value):""),children:[(0,t.jsx)("option",{value:"",children:"Select item"}),b.map(e=>(0,t.jsxs)("option",{value:e.id,disabled:e.demo,children:[e.name," — R",e.price?.toFixed(2),e.demo?" (demo)":""]},e.id))]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"text-sm font-semibold mb-1 block",children:"Qty"}),(0,t.jsx)("input",{type:"number",min:"0.25",step:"0.25",className:"border rounded w-full p-2",value:e.quantity,onChange:t=>K(e.id,"quantity",Number(t.target.value))})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"text-sm font-semibold mb-1 block",children:"Project"}),(0,t.jsxs)("select",{className:"border rounded w-full p-2",value:"__custom__"===e.projectId?"__custom__":""===e.projectId?"":String(e.projectId),onChange:t=>{let s=t.target.value;L(t=>t.map(t=>{if(t.id!==e.id)return t;if("__custom__"===s)return{...t,projectId:"__custom__"};if(""===s)return{...t,projectId:"",projectCustom:""};let o=Number(s);return Number.isFinite(o)?{...t,projectId:o,projectCustom:""}:t}))},children:[(0,t.jsx)("option",{value:"",children:"Unassigned"}),x.map(e=>(0,t.jsxs)("option",{value:e.id,disabled:e.demo,children:[e.name,e.demo?" (demo)":""]},e.id)),(0,t.jsx)("option",{value:"__custom__",children:"Manual entry…"})]}),"__custom__"===e.projectId&&(0,t.jsx)("input",{className:"mt-2 border rounded w-full p-2",placeholder:"Project name",value:e.projectCustom,onChange:t=>K(e.id,"projectCustom",t.target.value)})]}),(0,t.jsxs)("div",{className:"md:col-span-2",children:[(0,t.jsx)("label",{className:"text-sm font-semibold mb-1 block",children:"Notes"}),(0,t.jsx)("input",{className:"border rounded w-full p-2",placeholder:"Extra detail",value:e.note,onChange:t=>K(e.id,"note",t.target.value)})]}),(0,t.jsxs)("div",{className:"flex flex-col justify-between",children:[(0,t.jsx)("span",{className:"text-xs uppercase text-gray-500",children:"Line total"}),(0,t.jsxs)("span",{className:"text-lg font-semibold",children:["R",o.toFixed(2)]}),M.length>1&&(0,t.jsx)("button",{type:"button",className:"text-red-500 text-xs",onClick:()=>{var t;return t=e.id,void L(e=>1===e.length?e:e.filter(e=>e.id!==t))},children:"Remove"})]})]},e.id)})]}),(0,t.jsxs)("section",{className:"rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-1 md:flex-row md:items-center md:justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"text-base font-semibold text-slate-900",children:"Convert tracked tasks"}),(0,t.jsx)("p",{className:"text-sm text-slate-600",children:"Use saved timer entries to create service lines without retyping hours."})]}),W.length>3&&(0,t.jsxs)("p",{className:"text-xs text-slate-500",children:["Showing ",Math.min(W.length,6)," of ",W.length]})]}),W.length?(0,t.jsxs)("div",{className:"mt-4 space-y-3",children:[W.slice(0,6).map(e=>{let s=n(e.seconds)||0,o=s?Math.max(.25,Number(s.toFixed(2))):0,i=s?l(o):"0m",r=e.project?.name;return(0,t.jsxs)("div",{className:"flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-medium text-slate-900",children:e.name}),(0,t.jsxs)("p",{className:"text-xs text-slate-500",children:[i,r?` • ${r}`:""]})]}),(0,t.jsx)("button",{type:"button",className:"self-start rounded border border-indigo-200 px-3 py-1 text-sm font-semibold text-indigo-700 hover:bg-indigo-50",onClick:()=>(function(e){let t=n(e.seconds);if(!t)return void O({success:"",error:"This task has no tracked time yet."});let s=Math.max(.25,Number(t.toFixed(2))),o=!1;L(t=>{if(t.some(t=>"timer"===t.source&&t.taskRef===String(e.id)))return t;o=!0;let i="number"==typeof e.project_id?e.project_id:null,r=e.project?.name??null;return[{...a(),itemId:B||"",quantity:s,projectId:i??(r?"__custom__":""),projectCustom:i?"":r??"",note:`Time from ${e.name} (${l(s)})`,source:"timer",taskRef:String(e.id)},...t]}),o?O({success:`Added ${e.name} to the invoice.`,error:""}):O({success:"",error:"That task is already on the invoice."})})(e),children:"Add to invoice"})]},e.id)}),W.length>6&&(0,t.jsx)("p",{className:"text-xs text-slate-500",children:"More tasks available — convert the rest from the Tasks screen."})]}):(0,t.jsx)("p",{className:"mt-3 text-sm text-slate-600",children:"No billable tasks with tracked time yet."}),S&&(0,t.jsx)("p",{className:"mt-2 text-xs text-amber-700",children:"Demo tasks are shown for illustration. Add live tasks to invoice them."})]}),(0,t.jsxs)("div",{className:"flex items-center justify-between border-t pt-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-gray-500",children:"Actual spend"}),(0,t.jsxs)("p",{className:"text-2xl font-bold",children:["R",J.toFixed(2)]})]}),(0,t.jsx)("button",{className:"bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold",type:"submit",children:"Create invoice"})]}),z.success&&(0,t.jsx)("div",{className:"text-green-600 text-sm",children:z.success}),z.error&&(0,t.jsx)("div",{className:"text-red-600 text-sm",children:z.error})]})}e.s(["default",()=>c])},63289,e=>{"use strict";var t=e.i(43476),s=e.i(22016),o=e.i(71645),i=e.i(18566),r=e.i(71751),a=e.i(23503),n=e.i(35040),l=e.i(56282),d=e.i(94124),c=e.i(56044);function m(){return(0,t.jsx)(o.Suspense,{fallback:(0,t.jsx)("div",{className:"p-8 text-gray-600",children:"Loading invoice workspace…"}),children:(0,t.jsx)(u,{})})}function u(){let e=(0,i.useSearchParams)(),m={customerId:e.get("customerId"),taskId:e.get("fromTask"),taskName:e.get("taskName"),taskSeconds:e.get("taskSeconds"),taskProjectId:e.get("taskProjectId"),taskProjectName:e.get("taskProjectName")},[u,p]=(0,o.useState)([]),[b,h]=(0,o.useState)(!1),[x,f]=(0,o.useState)(null),[g,y]=(0,o.useState)(null),[v,j]=(0,o.useState)(null),[w,N]=(0,o.useState)(!1),[_,k]=(0,o.useState)(0),[S,I]=(0,o.useState)(null),[C,D]=(0,o.useState)(!1),[$,F]=(0,o.useState)(null),[P,R]=(0,o.useState)([]),[U,T]=(0,o.useState)("standard"),A=!!g&&(0,d.canUseDemoFixtures)(g);(0,o.useEffect)(()=>{let e=!0;return(0,n.ensureClientUserId)().then(t=>{e&&y(t)}).catch(()=>{e&&f("Unable to resolve workspace user.")}),()=>{e=!1}},[]),(0,o.useEffect)(()=>{j((0,c.readActiveCompanyId)())},[]);let E=(0,o.useCallback)(async({quiet:e=!1}={})=>{if(!g)return;let t=(0,d.canUseDemoFixtures)(g);e||h(!0),f(null);try{let e=new URLSearchParams({user_id:g});v&&e.set("company_id",v);let s=await fetch(`/api/invoices?${e.toString()}`);if(!s.ok)throw Error("Failed to load");let o=await s.json(),i=Array.isArray(o)?o:[];i.length?(p(i),N(!1)):t&&!v?(p((0,l.getDemoInvoices)(g)),N(!0)):(p([]),N(!1)),k(i.filter(e=>e.offline).length)}catch{t?(p((0,l.getDemoInvoices)(g)),N(!0)):(p([]),N(!1)),k(0),f("Failed to load invoices")}finally{e||h(!1)}},[g,v]);async function q(e){if(!e.userId)return f("Workspace context missing for invoice."),!1;h(!0),f(null),I(null);try{let t=await fetch("/api/invoices",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer_id:e.customerId,amount:e.amount,description:e.description,reference:e.reference,lines:e.lines,user_id:e.userId,company_id:v})});if(!t.ok)throw Error("Failed to add invoice");let s=await t.json();return s?.offline?I("Invoice saved offline. Use Sync to push it once Supabase is ready."):I("Invoice saved successfully."),await E({quiet:!0}),!0}catch{return f("Failed to add invoice"),!1}finally{h(!1)}}(0,o.useEffect)(()=>{g&&E()},[g,E]),(0,o.useEffect)(()=>{R(e=>e.filter(e=>u.some(t=>t.id===e&&!t.demo)))},[u]);let[M,L]=(0,o.useState)(null),[z,O]=(0,o.useState)({amount:0,description:""});async function B(e){if(e.preventDefault(),!g)return void f("Workspace context missing for update.");h(!0),f(null);try{let e=await fetch("/api/invoices",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:M,amount:z.amount,description:z.description,user_id:g})});if(!e.ok)throw Error("Failed to update invoice");await e.json(),await E({quiet:!0}),I("Invoice updated."),L(null),O({amount:0,description:""})}catch{f("Failed to update invoice")}finally{h(!1)}}async function W(e){if(!g)return void f("Workspace context missing for delete.");if(u.find(t=>t.id===e)?.demo)return void f("Demo invoices are read-only.");h(!0),f(null);try{if(!(await fetch("/api/invoices",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:e,user_id:g})})).ok)throw Error("Failed to delete invoice");await E({quiet:!0}),R(t=>t.filter(t=>t!==e)),I("Invoice removed.")}catch{f("Failed to delete invoice")}finally{h(!1)}}async function H(){if(!g)return void f("Workspace context missing for sync.");D(!0),f(null),I(null);try{let e=await fetch("/api/invoices/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_id:g})});if(!e.ok)throw Error("Failed to sync invoices");let t=await e.json();if(t.error)throw Error(t.error);t.synced?I(`Synced ${t.synced} offline invoice${1===t.synced?"":"s"}.`):I("No offline invoices queued."),await E({quiet:!0})}catch(e){f(e instanceof Error?e.message:"Failed to sync invoices")}finally{D(!1)}}async function J(e){if(!g)return void f("Workspace context missing for export.");if(w)return void f("Demo invoices cannot be exported.");F(e),f(null);try{let t=new URLSearchParams({format:e,user_id:g});P.length&&t.set("ids",P.join(",")),"pdf"===e&&t.set("template",U);let s=await fetch(`/api/invoices/export?${t.toString()}`);if(!s.ok)throw Error("Failed to export invoices");let o=await s.blob(),i=URL.createObjectURL(o),r=document.createElement("a");r.href=i;let a="pdf"===e?"pdf":"csv";r.download=`invoices-${e}-${Date.now()}.${a}`,r.click(),URL.revokeObjectURL(i)}catch{f("Unable to export invoices")}finally{F(null)}}let K=u.filter(e=>!e.demo).length,V=P.length;return(0,t.jsxs)("main",{className:"p-8 space-y-6",children:[(0,t.jsxs)("div",{className:"flex flex-col gap-2 md:flex-row md:items-center md:justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl font-bold",children:"Invoices"}),(0,t.jsx)("p",{className:"text-gray-600",children:"Pull time, photos, and inventory straight into polished invoices."})]}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsxs)("select",{value:U,onChange:e=>T(e.target.value),disabled:!!$||w||b,className:"rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-60",children:[(0,t.jsx)("option",{value:"standard",children:"PDF: Standard"}),(0,t.jsx)("option",{value:"detailed",children:"PDF: Detailed"})]}),(0,t.jsx)("button",{type:"button",onClick:()=>J("pdf"),disabled:!!$||w||b,className:"rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",children:"pdf"===$?"Generating PDF…":V>0?"Print selected (PDF)":"Download PDF"}),(0,t.jsx)("button",{type:"button",onClick:()=>J("ledger"),disabled:!!$||w||b,className:"rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",children:"ledger"===$?"Exporting ledger…":"Export ledger CSV"}),(0,t.jsx)("button",{type:"button",onClick:()=>J("lines"),disabled:!!$||w||b,className:"rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",children:"lines"===$?"Exporting lines…":"Export line items CSV"}),(0,t.jsx)(s.default,{href:"/dashboard/tasks",className:"rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50",children:"View tasks"}),(0,t.jsx)(s.default,{href:"/dashboard/items",className:"rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50",children:"View inventory"}),(0,t.jsx)(a.BackButton,{})]})]}),A&&w&&(0,t.jsx)("div",{className:"rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900",children:"Showing mock invoices while you explore. Add a live invoice to switch to your own data."}),_>0&&(0,t.jsxs)("div",{className:"rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 flex flex-col gap-2 md:flex-row md:items-center md:justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("p",{className:"font-semibold",children:[_," invoice",_>1?"s":""," waiting to sync"]}),(0,t.jsx)("p",{className:"text-xs text-slate-600",children:"We saved them locally until the Supabase schema catches up."})]}),(0,t.jsx)("button",{onClick:H,disabled:C,className:"rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70",children:C?"Syncing…":"Retry sync"})]}),S&&(0,t.jsx)("div",{className:"rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900",children:S}),(0,t.jsxs)("div",{className:"rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 flex flex-col gap-2 md:flex-row md:items-center md:justify-between",children:[(0,t.jsx)("div",{children:V>0?`${V} invoice${1===V?"":"s"} selected for print/export.`:"Select processed invoices below to print specific documents."}),(0,t.jsx)("button",{type:"button",onClick:function(){if(w)return;let e=u.filter(e=>!e.demo).map(e=>e.id);e.length?P.length===e.length?R([]):R(e):R([])},disabled:w||!K||b,className:"rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",children:K>0&&V===K?"Clear selection":"Select all"})]}),(0,t.jsx)(r.default,{onAdd:q,preset:m,companyId:v}),b&&(0,t.jsx)("div",{className:"text-center py-8 text-blue-600 font-semibold",children:"Loading invoices…"}),x&&(0,t.jsx)("div",{className:"rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-900",children:x}),0!==u.length||b?(0,t.jsx)("div",{className:"grid gap-4 sm:grid-cols-1 lg:grid-cols-2",children:u.map((e,s)=>{let o=e.customer?.name||e.customer_name||(e.customer_id?`Customer #${e.customer_id}`:"Customer");return(0,t.jsx)("div",{className:"rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden",children:(0,t.jsxs)("div",{className:"p-5",children:[(0,t.jsxs)("div",{className:"flex items-start justify-between mb-4",children:[(0,t.jsxs)("div",{className:"flex-1",children:[(0,t.jsx)("h3",{className:"text-lg font-bold text-slate-900",children:o}),e.description&&(0,t.jsx)("p",{className:"text-sm text-slate-600 mt-1",children:e.description})]}),!e.demo&&(0,t.jsx)("input",{type:"checkbox",checked:P.includes(e.id),onChange:()=>{var t;return t=e.id,void(w||!u.find(e=>e.id===t)?.demo&&R(e=>e.includes(t)?e.filter(e=>e!==t):[...e,t]))},className:"h-5 w-5 rounded border-slate-300 text-blue-600","aria-label":"Select invoice for export"})]}),(0,t.jsxs)("div",{className:"flex items-baseline justify-between mb-4 pb-4 border-b border-slate-100",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-xs tracking-wide text-slate-500 uppercase font-semibold mb-1",children:"Amount"}),(0,t.jsxs)("p",{className:"text-3xl font-bold text-slate-900",children:["R",(0,t.jsx)("span",{children:e.amount?.toFixed(2)})]})]}),(0,t.jsxs)("div",{className:"flex flex-wrap gap-2 justify-end",children:[e.offline&&(0,t.jsx)("span",{className:"inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700",children:"📡 Offline"}),e.demo&&(0,t.jsx)("span",{className:"inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600",children:"✨ Demo"}),e.last_sync_error&&(0,t.jsx)("span",{className:"inline-flex items-center rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700",children:"⚠️ Sync error"})]})]}),(0,t.jsx)("div",{className:"grid grid-cols-2 gap-3 mb-4 text-sm",children:(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-xs text-slate-500 uppercase tracking-wide font-semibold mb-0.5",children:"Invoice ID"}),(0,t.jsxs)("p",{className:"font-mono text-slate-700",children:["#",e.id]})]})}),M===e.id?(0,t.jsxs)("form",{onSubmit:B,className:"space-y-3",children:[(0,t.jsx)("input",{className:"w-full rounded border border-slate-300 px-3 py-2 text-sm",type:"number",min:"0",value:z.amount,onChange:e=>O(t=>({...t,amount:Number(e.target.value)})),placeholder:"Amount",required:!0}),(0,t.jsx)("textarea",{className:"w-full rounded border border-slate-300 px-3 py-2 text-sm",value:z.description,onChange:e=>O(t=>({...t,description:e.target.value})),placeholder:"Description",rows:2}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)("button",{className:"flex-1 rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100",type:"submit",children:"Save"}),(0,t.jsx)("button",{className:"flex-1 rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100",type:"button",onClick:()=>L(null),children:"Cancel"})]})]}):(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)("button",{className:"flex-1 rounded border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors",onClick:()=>{var t;let s,o,i;s=new Blob([(t={invoiceNumber:String(e.id),date:new Date().toLocaleDateString(),dueDate:new Date(Date.now()+2592e6).toLocaleDateString(),customerName:e.customer?.name||e.customer_name||"Customer",amount:e.amount||0,currency:"R",lineItems:[{description:e.description||"Invoice Services",quantity:1,rate:e.amount||0,total:e.amount||0}],notes:e.description?`${e.description}`:void 0},`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${t.invoiceNumber}</title>
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
            <h1>${t.companyName||"Company Name"}</h1>
            <p>Professional Services</p>
          </div>
          <div class="invoice-details">
            <h2>INVOICE</h2>
            <p><strong>${t.invoiceNumber}</strong></p>
            <p>Date: ${t.date}</p>
            <p>Due: ${t.dueDate}</p>
          </div>
        </div>

        <!-- Bill To -->
        <div class="bill-to">
          <p class="section-title">Bill To:</p>
          <p><strong>${t.customerName}</strong></p>
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
            ${t.lineItems.map(e=>`
              <tr>
                <td class="col-desc">${e.description}</td>
                <td class="col-qty">${e.quantity}</td>
                <td class="col-price">${t.currency}${e.rate.toFixed(2)}</td>
                <td class="col-discount">0%</td>
                <td class="col-tax">0%</td>
                <td class="col-total">${t.currency}${e.total.toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <!-- Totals -->
        <div class="total-section">
          <table class="total-table">
            <tr>
              <td class="label">Subtotal:</td>
              <td class="amount">${t.currency}${t.amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td class="label">Discount:</td>
              <td class="amount">${t.currency}0.00</td>
            </tr>
            <tr>
              <td class="label">Tax:</td>
              <td class="amount">${t.currency}0.00</td>
            </tr>
            <tr class="grand-total-row">
              <td class="label">Total Due:</td>
              <td class="amount">${t.currency}${t.amount.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        ${t.notes?`
        <!-- Notes -->
        <div class="notes">
          <h3>Notes</h3>
          <p>${t.notes}</p>
        </div>
        `:""}

        <!-- Footer -->
        <div class="footer">
          <p>Thank you for your business</p>
          <p>Invoice generated on ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </body>
    </html>
  `)],{type:"text/html"}),o=URL.createObjectURL(s),(i=window.open(o,"_blank"))&&i.addEventListener("load",()=>{i.print()})},children:"🖨 Print PDF"}),!e.demo&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("button",{className:"flex-1 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors",onClick:()=>{e.demo?f("Demo invoices are read-only."):(L(e.id),O({amount:e.amount,description:e.description||""}))},children:"✎ Edit"}),(0,t.jsx)("button",{className:"flex-1 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors",onClick:()=>W(e.id),children:"🗑 Delete"})]})]})]})},e.id??s)})}):(0,t.jsxs)("div",{className:"rounded-lg border border-slate-200 bg-slate-50 px-6 py-12 text-center",children:[(0,t.jsx)("p",{className:"text-slate-600 font-semibold",children:"No invoices yet"}),(0,t.jsx)("p",{className:"text-slate-500 text-sm mt-1",children:"Create your first invoice above to get started."})]})]})}e.s(["default",()=>m],63289)}]);