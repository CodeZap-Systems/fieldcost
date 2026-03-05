import { createHash, randomUUID } from "node:crypto";
import { readStore, writeStore } from "./dataStore";

export type StoredInvoiceLine = {
  id: string;
  item_id: number | null;
  name: string;
  quantity: number;
  rate: number;
  total: number;
  project: string | null;
  note: string | null;
  source: string | null;
  task_ref: string | null;
};

export type StoredInvoiceRecord = {
  id: number;
  user_id: string;
  customer_id: number | null;
  customer_name: string | null;
  amount: number;
  description: string | null;
  reference: string | null;
  invoice_number: string;
  issued_on: string | null;
  due_on: string | null;
  status: string;
  currency: string | null;
  created_at: string;
  updated_at: string;
  line_items: StoredInvoiceLine[];
  pending_sync: boolean;
  checksum: string;
  sync_attempts: number;
  last_sync_error: string | null;
  synced_at: string | null;
};

type InvoiceStore = Record<string, StoredInvoiceRecord[]>;

const FILE_NAME = "invoices.json";
const DEFAULT_RETENTION_DAYS = 30;
const MAX_SYNC_ATTEMPTS = 5;

function calculateChecksum(input: {
  customer_id: number | null;
  amount: number;
  description: string | null;
  reference: string | null;
  invoice_number: string;
  issued_on: string | null;
  due_on: string | null;
  status: string;
  currency: string | null;
  line_items: StoredInvoiceLine[];
}) {
  const hash = createHash("sha256");
  hash.update(
    JSON.stringify({
      customer_id: input.customer_id,
      amount: input.amount,
      description: input.description,
      reference: input.reference,
      invoice_number: input.invoice_number,
      issued_on: input.issued_on,
      due_on: input.due_on,
      status: input.status,
      currency: input.currency,
      lines: input.line_items.map(line => ({
        item_id: line.item_id,
        name: line.name,
        quantity: line.quantity,
        rate: line.rate,
        total: line.total,
        project: line.project,
        note: line.note,
        source: line.source,
        task_ref: line.task_ref,
      })),
    })
  );
  return hash.digest("hex");
}

function isOlderThan(dateIso: string, days: number) {
  const timestamp = Date.parse(dateIso);
  if (Number.isNaN(timestamp)) return false;
  const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
  return timestamp < threshold;
}

async function readAll(): Promise<InvoiceStore> {
  return readStore<InvoiceStore>(FILE_NAME, {});
}

async function writeAll(store: InvoiceStore) {
  await writeStore(FILE_NAME, store);
}

function ensureEntry(store: InvoiceStore, userId: string) {
  if (!store[userId]) {
    store[userId] = [];
  }
  return store[userId];
}

function generateOfflineInvoiceId() {
  return -Math.floor(Date.now() + Math.random() * 1000);
}

export async function getStoredInvoices(userId: string) {
  await pruneStoredInvoices({ userId });
  const store = await readAll();
  return store[userId] ?? [];
}

export async function getStoredInvoice(userId: string, invoiceId: number) {
  const store = await readAll();
  return store[userId]?.find(inv => inv.id === invoiceId) ?? null;
}

export async function listPendingInvoices(userId: string) {
  const store = await readAll();
  return (store[userId] ?? []).filter(inv => inv.pending_sync);
}

type StoredInvoiceUpsert = Omit<StoredInvoiceRecord, "id" | "user_id" | "created_at" | "updated_at" | "checksum" | "pending_sync" | "sync_attempts" | "last_sync_error" | "synced_at"> & {
  id?: number;
  pending_sync?: boolean;
};

export async function saveStoredInvoice(userId: string, invoice: StoredInvoiceUpsert) {
  const store = await readAll();
  const entry = ensureEntry(store, userId);
  const timestamp = new Date().toISOString();
  const id = typeof invoice.id === "number" ? invoice.id : generateOfflineInvoiceId();
  const base: StoredInvoiceRecord = {
    id,
    user_id: userId,
    created_at: timestamp,
    updated_at: timestamp,
    customer_id: invoice.customer_id ?? null,
    customer_name: invoice.customer_name ?? null,
    amount: invoice.amount,
    description: invoice.description ?? null,
    reference: invoice.reference ?? null,
    invoice_number: invoice.invoice_number,
    issued_on: invoice.issued_on ?? null,
    due_on: invoice.due_on ?? null,
    status: invoice.status,
    currency: invoice.currency ?? null,
    line_items: invoice.line_items,
    pending_sync: invoice.pending_sync ?? true,
    checksum: "",
    sync_attempts: 0,
    last_sync_error: null,
    synced_at: null,
  };
  const checksum = calculateChecksum(base);
  const record: StoredInvoiceRecord = { ...base, checksum };
  const existingIndex = entry.findIndex(inv => inv.id === id);
  if (existingIndex >= 0) {
    record.created_at = entry[existingIndex].created_at;
    record.sync_attempts = invoice.pending_sync === false ? entry[existingIndex].sync_attempts : 0;
    entry[existingIndex] = record;
  } else {
    entry.push(record);
  }
  await writeAll(store);
  return record;
}

type StoredInvoiceUpdate = Partial<Omit<StoredInvoiceRecord, "id" | "user_id" | "created_at" | "checksum">> & {
  line_items?: StoredInvoiceLine[];
};

export async function updateStoredInvoice(userId: string, invoiceId: number, updates: StoredInvoiceUpdate) {
  const store = await readAll();
  const entry = store[userId];
  if (!entry) return null;
  const index = entry.findIndex(inv => inv.id === invoiceId);
  if (index < 0) return null;
  const existing = entry[index];
  const next: StoredInvoiceRecord = {
    ...existing,
    amount: updates.amount ?? existing.amount,
    description: updates.description ?? existing.description,
    reference: updates.reference ?? existing.reference,
    invoice_number: updates.invoice_number ?? existing.invoice_number,
    issued_on: updates.issued_on ?? existing.issued_on,
    due_on: updates.due_on ?? existing.due_on,
    status: updates.status ?? existing.status,
    currency: updates.currency ?? existing.currency,
    customer_id: updates.customer_id ?? existing.customer_id,
    customer_name: updates.customer_name ?? existing.customer_name,
    line_items: updates.line_items ?? existing.line_items,
    pending_sync: updates.pending_sync ?? existing.pending_sync,
    sync_attempts: updates.sync_attempts ?? existing.sync_attempts,
    last_sync_error: updates.last_sync_error ?? existing.last_sync_error,
    synced_at: updates.synced_at ?? existing.synced_at,
    updated_at: new Date().toISOString(),
  };
  next.checksum = calculateChecksum(next);
  entry[index] = next;
  await writeAll(store);
  return next;
}

export async function markInvoiceSynced(userId: string, invoiceId: number) {
  return updateStoredInvoice(userId, invoiceId, {
    pending_sync: false,
    synced_at: new Date().toISOString(),
    last_sync_error: null,
    sync_attempts: 0,
  });
}

export async function recordInvoiceSyncFailure(userId: string, invoiceId: number, message: string) {
  const current = await getStoredInvoice(userId, invoiceId);
  if (!current) return null;
  const attempts = Math.min(MAX_SYNC_ATTEMPTS, current.sync_attempts + 1);
  return updateStoredInvoice(userId, invoiceId, {
    sync_attempts: attempts,
    last_sync_error: message,
    pending_sync: attempts < MAX_SYNC_ATTEMPTS,
  });
}

export async function deleteStoredInvoice(userId: string, invoiceId: number) {
  const store = await readAll();
  if (!store[userId]) return false;
  const originalLength = store[userId].length;
  store[userId] = store[userId].filter(inv => inv.id !== invoiceId);
  if (store[userId].length === originalLength) return false;
  await writeAll(store);
  return true;
}

export async function pruneStoredInvoices(options?: { userId?: string; retentionDays?: number }) {
  const { userId, retentionDays = DEFAULT_RETENTION_DAYS } = options ?? {};
  const store = await readAll();
  let dirty = false;
  const pruneEntry = (key: string) => {
    if (!store[key]) return;
    const originalLength = store[key].length;
    store[key] = store[key].filter(record => record.pending_sync || !isOlderThan(record.updated_at, retentionDays));
    if (store[key].length !== originalLength) {
      dirty = true;
    }
  };
  if (userId) {
    pruneEntry(userId);
  } else {
    Object.keys(store).forEach(pruneEntry);
  }
  if (dirty) {
    await writeAll(store);
  }
}

export function storedInvoiceToApi(invoice: StoredInvoiceRecord) {
  return {
    id: invoice.id,
    amount: invoice.amount,
    description: invoice.description,
    reference: invoice.reference,
    invoice_number: invoice.invoice_number,
    issued_on: invoice.issued_on,
    due_on: invoice.due_on,
    status: invoice.status,
    currency: invoice.currency,
    customer_id: invoice.customer_id,
    customer: invoice.customer_id
      ? {
          id: invoice.customer_id,
          name: invoice.customer_name ?? "Customer",
        }
      : null,
    user_id: invoice.user_id,
    line_items: invoice.line_items,
    offline: true,
    pending_sync: invoice.pending_sync,
    sync_attempts: invoice.sync_attempts,
    last_sync_error: invoice.last_sync_error,
  };
}

export function buildStoredInvoiceLine(line: {
  item_id: number | null;
  name: string;
  quantity: number;
  rate: number;
  total: number;
  project: string | null;
  note: string | null;
  source: string | null;
  task_ref: string | null;
}): StoredInvoiceLine {
  return {
    id: randomUUID(),
    item_id: line.item_id,
    name: line.name,
    quantity: line.quantity,
    rate: line.rate,
    total: line.total,
    project: line.project,
    note: line.note,
    source: line.source,
    task_ref: line.task_ref,
  };
}
