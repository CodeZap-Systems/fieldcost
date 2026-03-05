import { DEMO_ADMIN_USER_ID, DEMO_SUBCONTRACTOR_USER_ID, normalizeUserId } from "./userIdentity";

const ADMIN_KEY = normalizeUserId(DEMO_ADMIN_USER_ID);
const SUBCONTRACTOR_KEY = normalizeUserId(DEMO_SUBCONTRACTOR_USER_ID, ADMIN_KEY);

const resolveKey = (userId?: string | null) => normalizeUserId(userId, ADMIN_KEY);

const clone = <T>(payload: T): T => JSON.parse(JSON.stringify(payload));

type DemoProject = {
  id: number;
  name: string;
  description: string;
  photo_url?: string;
  demo: true;
};

type DemoCustomer = {
  id: number;
  name: string;
  email: string;
  demo: true;
};

type DemoItem = {
  id: number;
  name: string;
  price: number;
  stock_in: number;
  stock_used: number;
  item_type: "physical" | "service";
  demo: true;
};

type DemoCrewMember = {
  id: number;
  name: string;
  hourly_rate: number;
  demo: true;
};

type DemoTask = {
  id: number;
  name: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  seconds: number;
  assigned_to?: string;
  crew_member_id?: number;
  billable: boolean;
  photo_url?: string;
  crew_member?: DemoCrewMember;
  demo: true;
};

type DemoInvoiceLine = {
  id: number;
  name: string;
  quantity: number;
  total: number;
  project?: string | null;
  note?: string | null;
  source?: string | null;
  task_ref?: string | null;
};

type DemoInvoice = {
  id: number;
  customer_id: number;
  customer: { id: number; name: string };
  amount: number;
  description: string;
  reference?: string;
  invoice_number: string;
  issued_on: string;
  due_on: string;
  status: "draft" | "sent" | "paid";
  currency: string;
  line_items?: DemoInvoiceLine[];
  demo: true;
};

const demoProjects: Record<string, DemoProject[]> = {
  [ADMIN_KEY]: [
    {
      id: 6001,
      name: "Haul Road Rehab",
      description: "Stabilise, widen, and cap the 4 km haul road between pits.",
      photo_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=60",
      demo: true,
    },
    {
      id: 6002,
      name: "Process Plant Refurb",
      description: "Replace worn chute liners and recalibrate secondary crushers.",
      photo_url: "https://images.unsplash.com/photo-1457449940276-e8deed18bfff?auto=format&fit=crop&w=600&q=60",
      demo: true,
    },
    {
      id: 6003,
      name: "Tailings Storage Lift",
      description: "Raise TSF wall by 3 m with compacted engineered fill.",
      photo_url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=60",
      demo: true,
    },
  ],
  [SUBCONTRACTOR_KEY]: [
    {
      id: 6101,
      name: "Drill & Blast Campaign",
      description: "120-hole pattern for north pit pushback.",
      photo_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=60",
      demo: true,
    },
    {
      id: 6102,
      name: "Crusher Maintenance Blitz",
      description: "Three-day shutdown to swap liners and bearings.",
      photo_url: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=600&q=60",
      demo: true,
    },
  ],
};

const demoCustomers: Record<string, DemoCustomer[]> = {
  [ADMIN_KEY]: [
    { id: 6201, name: "Mbali Civil Works", email: "projects@mbali.co.za", demo: true },
    { id: 6202, name: "Kopano Mining JV", email: "ops@kopanomining.africa", demo: true },
    { id: 6203, name: "Sunset Aggregates", email: "finance@sunsetagg.co.za", demo: true },
  ],
  [SUBCONTRACTOR_KEY]: [
    { id: 6211, name: "Highveld Crushing", email: "info@highveldcrushing.co.za", demo: true },
    { id: 6212, name: "MoAfrika Minerals", email: "admin@moafrika-minerals.co.za", demo: true },
  ],
};

const demoItems: Record<string, DemoItem[]> = {
  [ADMIN_KEY]: [
    { id: 6301, name: "Diesel (50 ppm)", price: 24.85, stock_in: 18000, stock_used: 13200, item_type: "physical", demo: true },
    { id: 6302, name: "Explosive Pack ANFO (1 t)", price: 8650, stock_in: 18, stock_used: 12, item_type: "physical", demo: true },
    { id: 6303, name: "On-site Survey Crew (day)", price: 7800, stock_in: 22, stock_used: 15, item_type: "service", demo: true },
  ],
  [SUBCONTRACTOR_KEY]: [
    { id: 6311, name: "Crusher Specialist Callout", price: 12500, stock_in: 12, stock_used: 6, item_type: "service", demo: true },
    { id: 6312, name: "Wear Plate Set", price: 9800, stock_in: 30, stock_used: 21, item_type: "physical", demo: true },
  ],
};

const demoCrew: Record<string, DemoCrewMember[]> = {
  [ADMIN_KEY]: [
    { id: 6401, name: "Sipho Dlamini", hourly_rate: 420, demo: true },
    { id: 6402, name: "Lerato Maseko", hourly_rate: 395, demo: true },
    { id: 6403, name: "Thando Nkosi", hourly_rate: 380, demo: true },
    { id: 6404, name: "Nomsa Khumalo", hourly_rate: 360, demo: true },
  ],
  [SUBCONTRACTOR_KEY]: [
    { id: 6411, name: "Neo Mbele", hourly_rate: 410, demo: true },
    { id: 6412, name: "Kagiso Molefe", hourly_rate: 390, demo: true },
  ],
};

const demoTasks: Record<string, DemoTask[]> = {
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
      demo: true,
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
      demo: true,
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
      demo: true,
    },
    {
      id: 6504,
      name: "Crusher recalibration",
      description: "Laser align crusher gap before restart.",
      status: "todo",
      seconds: 0,
      billable: false,
      demo: true,
    },
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
      demo: true,
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
      demo: true,
    },
  ],
};

const demoInvoices: Record<string, DemoInvoice[]> = {
  [ADMIN_KEY]: [
    {
      id: 6601,
      customer_id: 6201,
      customer: { id: 6201, name: "Mbali Civil Works" },
      amount: 485000,
      description: "Progress draw #3 - Haul road stabilisation and survey.",
      reference: "Haul Road Rehab",
      invoice_number: "FC-104",
      issued_on: "2026-02-12",
      due_on: "2026-02-27",
      status: "sent",
      currency: "ZAR",
      line_items: [
        { id: 90001, name: "Survey control", quantity: 3, total: 45000, project: "Haul Road Rehab", note: null, source: "timer", task_ref: "6501" },
        { id: 90002, name: "Stabilisation crew", quantity: 2, total: 180000, project: "Haul Road Rehab" },
      ],
      demo: true,
    },
    {
      id: 6602,
      customer_id: 6202,
      customer: { id: 6202, name: "Kopano Mining JV" },
      amount: 320000,
      description: "Process plant shutdown labour & materials.",
      reference: "Process Plant Refurb",
      invoice_number: "FC-105",
      issued_on: "2026-02-08",
      due_on: "2026-03-04",
      status: "draft",
      currency: "ZAR",
      line_items: [
        { id: 90003, name: "Chute liner strip-out", quantity: 1.5, total: 120000, project: "Process Plant Refurb", task_ref: "6503" },
        { id: 90004, name: "Consumables", quantity: 1, total: 20000, project: "Process Plant Refurb" },
      ],
      demo: true,
    },
    {
      id: 6603,
      customer_id: 6203,
      customer: { id: 6203, name: "Sunset Aggregates" },
      amount: 215000,
      description: "Tailings lift QA services (week 18).",
      reference: "Tailings Storage Lift",
      invoice_number: "FC-106",
      issued_on: "2026-02-01",
      due_on: "2026-02-28",
      status: "paid",
      currency: "ZAR",
      line_items: [
        { id: 90005, name: "QA inspections", quantity: 2, total: 155000, project: "Tailings Storage Lift" },
        { id: 90006, name: "Travel & logistics", quantity: 1, total: 60000, project: "Tailings Storage Lift" },
      ],
      demo: true,
    },
  ],
  [SUBCONTRACTOR_KEY]: [
    {
      id: 6611,
      customer_id: 6211,
      customer: { id: 6211, name: "Highveld Crushing" },
      amount: 155000,
      description: "Crusher blitz callout fee and spares.",
      reference: "Crusher Maintenance Blitz",
      invoice_number: "SC-044",
      issued_on: "2026-02-10",
      due_on: "2026-02-25",
      status: "sent",
      currency: "ZAR",
      line_items: [
        { id: 90011, name: "Specialist callout", quantity: 1, total: 95000, project: "Crusher Maintenance Blitz" },
        { id: 90012, name: "Wear parts", quantity: 1, total: 60000 },
      ],
      demo: true,
    },
    {
      id: 6612,
      customer_id: 6212,
      customer: { id: 6212, name: "MoAfrika Minerals" },
      amount: 265000,
      description: "Drill & blast campaign progress payment.",
      reference: "Drill & Blast",
      invoice_number: "SC-045",
      issued_on: "2026-02-05",
      due_on: "2026-03-05",
      status: "draft",
      currency: "ZAR",
      line_items: [
        { id: 90013, name: "Pattern drilling", quantity: 1, total: 165000, task_ref: "6511" },
        { id: 90014, name: "Explosive loading", quantity: 1, total: 100000 },
      ],
      demo: true,
    },
  ],
};

export function getDemoProjects(userId?: string | null) {
  const key = resolveKey(userId);
  return clone(demoProjects[key] ?? demoProjects[ADMIN_KEY]);
}

export function getDemoCustomers(userId?: string | null) {
  const key = resolveKey(userId);
  return clone(demoCustomers[key] ?? demoCustomers[ADMIN_KEY]);
}

export function getDemoItems(userId?: string | null) {
  const key = resolveKey(userId);
  return clone(demoItems[key] ?? demoItems[ADMIN_KEY]);
}

export function getDemoCrew(userId?: string | null) {
  const key = resolveKey(userId);
  return clone(demoCrew[key] ?? demoCrew[ADMIN_KEY]);
}

export function getDemoTasks(userId?: string | null) {
  const key = resolveKey(userId);
  return clone(demoTasks[key] ?? demoTasks[ADMIN_KEY]);
}

export function getDemoInvoices(userId?: string | null) {
  const key = resolveKey(userId);
  return clone(demoInvoices[key] ?? demoInvoices[ADMIN_KEY]);
}
