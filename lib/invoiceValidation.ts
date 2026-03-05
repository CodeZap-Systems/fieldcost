const VALID_STATUSES = new Set(["draft", "sent", "paid", "overdue"]);

export type RawLineItem = {
  itemId?: unknown;
  item_id?: unknown;
  qty?: unknown;
  name?: unknown;
  itemName?: unknown;
  quantity?: unknown;
  rate?: unknown;
  total?: unknown;
  project?: unknown;
  note?: unknown;
  source?: unknown;
  taskRef?: unknown;
  task_ref?: unknown;
};

export type NormalizedLineItem = {
  item_id: number | null;
  name: string;
  quantity: number;
  rate: number;
  total: number;
  project: string | null;
  note: string | null;
  source: string | null;
  task_ref: string | null;
  user_id: string;
};

export const sanitize = (value?: unknown) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

export const normalizeDateInput = (value?: unknown) => {
  if (!value) return null;
  const parsed = new Date(value as string);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
};

export const sanitizeCurrency = (value?: unknown) => {
  const trimmed = sanitize(value).toUpperCase();
  return trimmed.length === 3 ? trimmed : "ZAR";
};

export const normalizeStatus = (value?: unknown) => {
  const status = sanitize(value).toLowerCase();
  return VALID_STATUSES.has(status) ? status : "sent";
};

export function prepareLineItems(lines: unknown, userId: string) {
  if (!Array.isArray(lines)) return { lines: [] as NormalizedLineItem[], total: 0 };
  const normalized: NormalizedLineItem[] = [];
  for (const raw of lines as RawLineItem[]) {
    if (!raw) continue;
    const quantity = Number(raw.quantity ?? raw["qty"]);
    const rate = Number(raw.rate);
    if (!(Number.isFinite(quantity) && quantity > 0)) continue;
    const safeRate = Number.isFinite(rate) ? rate : 0;
    const itemId = raw.itemId ?? raw.item_id;
    const lineName = sanitize(raw.name) || sanitize(raw.itemName);
    if (!lineName) continue;
    const total = Number.isFinite(Number(raw.total)) ? Number(raw.total) : Number((quantity * safeRate).toFixed(2));
    let parsedItemId: number | null = null;
    if (typeof itemId === "number" && Number.isFinite(itemId)) {
      parsedItemId = itemId;
    } else if (typeof itemId === "string" && itemId.trim()) {
      const numeric = Number(itemId);
      if (Number.isFinite(numeric)) parsedItemId = numeric;
    }
    normalized.push({
      item_id: parsedItemId,
      name: lineName,
      quantity,
      rate: safeRate,
      total,
      project: sanitize(raw.project) || null,
      note: sanitize(raw.note) || null,
      source: sanitize(raw.source) || null,
      task_ref: sanitize(raw.taskRef ?? raw.task_ref) || null,
      user_id: userId,
    });
  }
  const total = normalized.reduce((sum, line) => sum + line.total, 0);
  return { lines: normalized, total };
}

export const generateInvoiceNumber = (userId: string) => {
  const suffix = userId.replace(/-/g, "").slice(0, 4).toUpperCase() || "0000";
  const stamp = Date.now().toString(36).toUpperCase();
  return `FC-${suffix}-${stamp}`;
};
