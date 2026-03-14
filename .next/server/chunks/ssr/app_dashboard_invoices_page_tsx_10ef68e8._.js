module.exports=[22485,a=>{"use strict";var b=a.i(87924),c=a.i(38246),d=a.i(72131),e=a.i(50944),f=a.i(6666),g=a.i(69623),h=a.i(32361),i=a.i(80026),j=a.i(72016);function k(){return(0,b.jsx)(d.Suspense,{fallback:(0,b.jsx)("div",{className:"p-8 text-gray-600",children:"Loading invoice workspace…"}),children:(0,b.jsx)(l,{})})}function l(){let a=(0,e.useSearchParams)(),k={customerId:a.get("customerId"),taskId:a.get("fromTask"),taskName:a.get("taskName"),taskSeconds:a.get("taskSeconds"),taskProjectId:a.get("taskProjectId"),taskProjectName:a.get("taskProjectName")},[l,m]=(0,d.useState)([]),[n,o]=(0,d.useState)(!1),[p,q]=(0,d.useState)(null),[r,s]=(0,d.useState)(null),[t,u]=(0,d.useState)(null),[v,w]=(0,d.useState)(!1),[x,y]=(0,d.useState)(0),[z,A]=(0,d.useState)(null),[B,C]=(0,d.useState)(!1),[D,E]=(0,d.useState)(null),[F,G]=(0,d.useState)([]),[H,I]=(0,d.useState)("standard"),J=!!r&&(0,j.canUseDemoFixtures)(r);(0,d.useEffect)(()=>{let a=!0;return(0,h.ensureClientUserId)().then(b=>{a&&s(b)}).catch(()=>{a&&q("Unable to resolve workspace user.")}),()=>{a=!1}},[]),(0,d.useEffect)(()=>{},[]);let K=(0,d.useCallback)(async({quiet:a=!1}={})=>{if(!r)return;let b=(0,j.canUseDemoFixtures)(r);a||o(!0),q(null);try{let a=new URLSearchParams({user_id:r});t&&a.set("company_id",t);let c=await fetch(`/api/invoices?${a.toString()}`);if(!c.ok)throw Error("Failed to load");let d=await c.json(),e=Array.isArray(d)?d:[];e.length?(m(e),w(!1)):b&&!t?(m((0,i.getDemoInvoices)(r)),w(!0)):(m([]),w(!1)),y(e.filter(a=>a.offline).length)}catch{b?(m((0,i.getDemoInvoices)(r)),w(!0)):(m([]),w(!1)),y(0),q("Failed to load invoices")}finally{a||o(!1)}},[r,t]);async function L(a){if(!a.userId)return q("Workspace context missing for invoice."),!1;o(!0),q(null),A(null);try{let b=await fetch("/api/invoices",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer_id:a.customerId,amount:a.amount,description:a.description,reference:a.reference,lines:a.lines,user_id:a.userId,company_id:t})});if(!b.ok)throw Error("Failed to add invoice");let c=await b.json();return c?.offline?A("Invoice saved offline. Use Sync to push it once Supabase is ready."):A("Invoice saved successfully."),await K({quiet:!0}),!0}catch{return q("Failed to add invoice"),!1}finally{o(!1)}}(0,d.useEffect)(()=>{r&&K()},[r,K]),(0,d.useEffect)(()=>{G(a=>a.filter(a=>l.some(b=>b.id===a&&!b.demo)))},[l]);let[M,N]=(0,d.useState)(null),[O,P]=(0,d.useState)({amount:0,description:""});async function Q(a){if(a.preventDefault(),!r)return void q("Workspace context missing for update.");o(!0),q(null);try{let a=await fetch("/api/invoices",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:M,amount:O.amount,description:O.description,user_id:r})});if(!a.ok)throw Error("Failed to update invoice");await a.json(),await K({quiet:!0}),A("Invoice updated."),N(null),P({amount:0,description:""})}catch{q("Failed to update invoice")}finally{o(!1)}}async function R(a){if(!r)return void q("Workspace context missing for delete.");if(l.find(b=>b.id===a)?.demo)return void q("Demo invoices are read-only.");o(!0),q(null);try{if(!(await fetch("/api/invoices",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:a,user_id:r})})).ok)throw Error("Failed to delete invoice");await K({quiet:!0}),G(b=>b.filter(b=>b!==a)),A("Invoice removed.")}catch{q("Failed to delete invoice")}finally{o(!1)}}async function S(){if(!r)return void q("Workspace context missing for sync.");C(!0),q(null),A(null);try{let a=await fetch("/api/invoices/sync",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_id:r})});if(!a.ok)throw Error("Failed to sync invoices");let b=await a.json();if(b.error)throw Error(b.error);b.synced?A(`Synced ${b.synced} offline invoice${1===b.synced?"":"s"}.`):A("No offline invoices queued."),await K({quiet:!0})}catch(a){q(a instanceof Error?a.message:"Failed to sync invoices")}finally{C(!1)}}async function T(a){if(!r)return void q("Workspace context missing for export.");if(v)return void q("Demo invoices cannot be exported.");E(a),q(null);try{let b=new URLSearchParams({format:a,user_id:r});F.length&&b.set("ids",F.join(",")),"pdf"===a&&b.set("template",H);let c=await fetch(`/api/invoices/export?${b.toString()}`);if(!c.ok)throw Error("Failed to export invoices");let d=await c.blob(),e=URL.createObjectURL(d),f=document.createElement("a");f.href=e;let g="pdf"===a?"pdf":"csv";f.download=`invoices-${a}-${Date.now()}.${g}`,f.click(),URL.revokeObjectURL(e)}catch{q("Unable to export invoices")}finally{E(null)}}let U=l.filter(a=>!a.demo).length,V=F.length;return(0,b.jsxs)("main",{className:"p-8 space-y-6",children:[(0,b.jsxs)("div",{className:"flex flex-col gap-2 md:flex-row md:items-center md:justify-between",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-2xl font-bold",children:"Invoices"}),(0,b.jsx)("p",{className:"text-gray-600",children:"Pull time, photos, and inventory straight into polished invoices."})]}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsxs)("select",{value:H,onChange:a=>I(a.target.value),disabled:!!D||v||n,className:"rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-60",children:[(0,b.jsx)("option",{value:"standard",children:"PDF: Standard"}),(0,b.jsx)("option",{value:"detailed",children:"PDF: Detailed"})]}),(0,b.jsx)("button",{type:"button",onClick:()=>T("pdf"),disabled:!!D||v||n,className:"rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",children:"pdf"===D?"Generating PDF…":V>0?"Print selected (PDF)":"Download PDF"}),(0,b.jsx)("button",{type:"button",onClick:()=>T("ledger"),disabled:!!D||v||n,className:"rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",children:"ledger"===D?"Exporting ledger…":"Export ledger CSV"}),(0,b.jsx)("button",{type:"button",onClick:()=>T("lines"),disabled:!!D||v||n,className:"rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",children:"lines"===D?"Exporting lines…":"Export line items CSV"}),(0,b.jsx)(c.default,{href:"/dashboard/tasks",className:"rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50",children:"View tasks"}),(0,b.jsx)(c.default,{href:"/dashboard/items",className:"rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50",children:"View inventory"}),(0,b.jsx)(g.BackButton,{})]})]}),J&&v&&(0,b.jsx)("div",{className:"rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900",children:"Showing mock invoices while you explore. Add a live invoice to switch to your own data."}),x>0&&(0,b.jsxs)("div",{className:"rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 flex flex-col gap-2 md:flex-row md:items-center md:justify-between",children:[(0,b.jsxs)("div",{children:[(0,b.jsxs)("p",{className:"font-semibold",children:[x," invoice",x>1?"s":""," waiting to sync"]}),(0,b.jsx)("p",{className:"text-xs text-slate-600",children:"We saved them locally until the Supabase schema catches up."})]}),(0,b.jsx)("button",{onClick:S,disabled:B,className:"rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70",children:B?"Syncing…":"Retry sync"})]}),z&&(0,b.jsx)("div",{className:"rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900",children:z}),(0,b.jsxs)("div",{className:"rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 flex flex-col gap-2 md:flex-row md:items-center md:justify-between",children:[(0,b.jsx)("div",{children:V>0?`${V} invoice${1===V?"":"s"} selected for print/export.`:"Select processed invoices below to print specific documents."}),(0,b.jsx)("button",{type:"button",onClick:function(){if(v)return;let a=l.filter(a=>!a.demo).map(a=>a.id);a.length?F.length===a.length?G([]):G(a):G([])},disabled:v||!U||n,className:"rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60",children:U>0&&V===U?"Clear selection":"Select all"})]}),(0,b.jsx)(f.default,{onAdd:L,preset:k,companyId:t}),n&&(0,b.jsx)("div",{className:"text-center py-8 text-blue-600 font-semibold",children:"Loading invoices…"}),p&&(0,b.jsx)("div",{className:"rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-900",children:p}),0!==l.length||n?(0,b.jsx)("div",{className:"grid gap-4 sm:grid-cols-1 lg:grid-cols-2",children:l.map((a,c)=>{let d=a.customer?.name||a.customer_name||(a.customer_id?`Customer #${a.customer_id}`:"Customer");return(0,b.jsx)("div",{className:"rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden",children:(0,b.jsxs)("div",{className:"p-5",children:[(0,b.jsxs)("div",{className:"flex items-start justify-between mb-4",children:[(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("h3",{className:"text-lg font-bold text-slate-900",children:d}),a.description&&(0,b.jsx)("p",{className:"text-sm text-slate-600 mt-1",children:a.description})]}),!a.demo&&(0,b.jsx)("input",{type:"checkbox",checked:F.includes(a.id),onChange:()=>{var b;return b=a.id,void(v||!l.find(a=>a.id===b)?.demo&&G(a=>a.includes(b)?a.filter(a=>a!==b):[...a,b]))},className:"h-5 w-5 rounded border-slate-300 text-blue-600","aria-label":"Select invoice for export"})]}),(0,b.jsxs)("div",{className:"flex items-baseline justify-between mb-4 pb-4 border-b border-slate-100",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-xs tracking-wide text-slate-500 uppercase font-semibold mb-1",children:"Amount"}),(0,b.jsxs)("p",{className:"text-3xl font-bold text-slate-900",children:["R",(0,b.jsx)("span",{children:a.amount?.toFixed(2)})]})]}),(0,b.jsxs)("div",{className:"flex flex-wrap gap-2 justify-end",children:[a.offline&&(0,b.jsx)("span",{className:"inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700",children:"📡 Offline"}),a.demo&&(0,b.jsx)("span",{className:"inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600",children:"✨ Demo"}),a.last_sync_error&&(0,b.jsx)("span",{className:"inline-flex items-center rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700",children:"⚠️ Sync error"})]})]}),(0,b.jsx)("div",{className:"grid grid-cols-2 gap-3 mb-4 text-sm",children:(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-xs text-slate-500 uppercase tracking-wide font-semibold mb-0.5",children:"Invoice ID"}),(0,b.jsxs)("p",{className:"font-mono text-slate-700",children:["#",a.id]})]})}),M===a.id?(0,b.jsxs)("form",{onSubmit:Q,className:"space-y-3",children:[(0,b.jsx)("input",{className:"w-full rounded border border-slate-300 px-3 py-2 text-sm",type:"number",min:"0",value:O.amount,onChange:a=>P(b=>({...b,amount:Number(a.target.value)})),placeholder:"Amount",required:!0}),(0,b.jsx)("textarea",{className:"w-full rounded border border-slate-300 px-3 py-2 text-sm",value:O.description,onChange:a=>P(b=>({...b,description:a.target.value})),placeholder:"Description",rows:2}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsx)("button",{className:"flex-1 rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100",type:"submit",children:"Save"}),(0,b.jsx)("button",{className:"flex-1 rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100",type:"button",onClick:()=>N(null),children:"Cancel"})]})]}):(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsx)("button",{className:"flex-1 rounded border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors",onClick:()=>{var b;let c,d,e;c=new Blob([(b={invoiceNumber:String(a.id),date:new Date().toLocaleDateString(),dueDate:new Date(Date.now()+2592e6).toLocaleDateString(),customerName:a.customer?.name||a.customer_name||"Customer",amount:a.amount||0,currency:"R",lineItems:[{description:a.description||"Invoice Services",quantity:1,rate:a.amount||0,total:a.amount||0}],notes:a.description?`${a.description}`:void 0},`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${b.invoiceNumber}</title>
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
            <h1>${b.companyName||"Company Name"}</h1>
            <p>Professional Services</p>
          </div>
          <div class="invoice-details">
            <h2>INVOICE</h2>
            <p><strong>${b.invoiceNumber}</strong></p>
            <p>Date: ${b.date}</p>
            <p>Due: ${b.dueDate}</p>
          </div>
        </div>

        <!-- Bill To -->
        <div class="bill-to">
          <p class="section-title">Bill To:</p>
          <p><strong>${b.customerName}</strong></p>
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
            ${b.lineItems.map(a=>`
              <tr>
                <td class="col-desc">${a.description}</td>
                <td class="col-qty">${a.quantity}</td>
                <td class="col-price">${b.currency}${a.rate.toFixed(2)}</td>
                <td class="col-discount">0%</td>
                <td class="col-tax">0%</td>
                <td class="col-total">${b.currency}${a.total.toFixed(2)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <!-- Totals -->
        <div class="total-section">
          <table class="total-table">
            <tr>
              <td class="label">Subtotal:</td>
              <td class="amount">${b.currency}${b.amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td class="label">Discount:</td>
              <td class="amount">${b.currency}0.00</td>
            </tr>
            <tr>
              <td class="label">Tax:</td>
              <td class="amount">${b.currency}0.00</td>
            </tr>
            <tr class="grand-total-row">
              <td class="label">Total Due:</td>
              <td class="amount">${b.currency}${b.amount.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        ${b.notes?`
        <!-- Notes -->
        <div class="notes">
          <h3>Notes</h3>
          <p>${b.notes}</p>
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
  `)],{type:"text/html"}),d=URL.createObjectURL(c),(e=window.open(d,"_blank"))&&e.addEventListener("load",()=>{e.print()})},children:"🖨 Print PDF"}),!a.demo&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("button",{className:"flex-1 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors",onClick:()=>{a.demo?q("Demo invoices are read-only."):(N(a.id),P({amount:a.amount,description:a.description||""}))},children:"✎ Edit"}),(0,b.jsx)("button",{className:"flex-1 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors",onClick:()=>R(a.id),children:"🗑 Delete"})]})]})]})},a.id??c)})}):(0,b.jsxs)("div",{className:"rounded-lg border border-slate-200 bg-slate-50 px-6 py-12 text-center",children:[(0,b.jsx)("p",{className:"text-slate-600 font-semibold",children:"No invoices yet"}),(0,b.jsx)("p",{className:"text-slate-500 text-sm mt-1",children:"Create your first invoice above to get started."})]})]})}a.i(54473),a.s(["default",()=>k],22485)}];

//# sourceMappingURL=app_dashboard_invoices_page_tsx_10ef68e8._.js.map