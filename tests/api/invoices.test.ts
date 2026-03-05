import "../mocks/supabaseClient";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  mockFrom,
  mockAuthGetUser,
  resetSupabaseMocks,
} from "../mocks/supabaseClient";
import { GET, POST, PATCH, DELETE } from "../../app/api/invoices/route";
import { POST as SYNC } from "../../app/api/invoices/sync/route";
import { DEFAULT_DEMO_USER_ID } from "../../lib/userIdentity";

const createThenableBuilder = (result: any) => {
  const promise = Promise.resolve(result);
  const builder: any = {};
  builder.eq = vi.fn().mockReturnValue(builder);
  builder.in = vi.fn().mockReturnValue(builder);
  builder.order = vi.fn().mockReturnValue(builder);
  builder.maybeSingle = vi.fn().mockReturnValue(promise);
  builder.then = promise.then.bind(promise);
  builder.catch = promise.catch.bind(promise);
  builder.finally = promise.finally.bind(promise);
  return builder;
};

const buildSelectChain = (result: any) => {
  const builder = createThenableBuilder(result);
  return {
    select: vi.fn().mockReturnValue(builder),
  };
};

const buildInsertChain = (result: any) => {
  const builder = createThenableBuilder(result);
  return {
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue(builder),
    }),
  };
};

const buildDeleteChain = (result: any) => {
  const builder = createThenableBuilder(result);
  return {
    delete: vi.fn().mockReturnValue(builder),
  };
};

type OfflineRecord = {
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
  line_items: any[];
  pending_sync: boolean;
  checksum: string;
  sync_attempts: number;
  last_sync_error: string | null;
  synced_at: string | null;
};

const buildOfflineRecord = (overrides: Partial<OfflineRecord> = {}): OfflineRecord => ({
  id: overrides.id ?? -Math.floor(Math.random() * 1000) - 1,
  user_id: overrides.user_id ?? "demo",
  customer_id: overrides.customer_id ?? 1,
  customer_name: overrides.customer_name ?? "Customer",
  amount: overrides.amount ?? 100,
  description: overrides.description ?? null,
  reference: overrides.reference ?? null,
  invoice_number: overrides.invoice_number ?? "FC-TEST",
  issued_on: overrides.issued_on ?? "2024-01-01",
  due_on: overrides.due_on ?? null,
  status: overrides.status ?? "sent",
  currency: overrides.currency ?? "ZAR",
  created_at: overrides.created_at ?? new Date().toISOString(),
  updated_at: overrides.updated_at ?? new Date().toISOString(),
  line_items: overrides.line_items ?? [],
  pending_sync: overrides.pending_sync ?? true,
  checksum: overrides.checksum ?? "checksum",
  sync_attempts: overrides.sync_attempts ?? 0,
  last_sync_error: overrides.last_sync_error ?? null,
  synced_at: overrides.synced_at ?? null,
});

const offlineStore = vi.hoisted(() => ({ records: [] as OfflineRecord[] }));

const invoiceStoreMocks = vi.hoisted(() => {
  return {
    buildStoredInvoiceLine: vi.fn((line: any) => ({ id: `line-${Math.random()}`, ...line })),
    deleteStoredInvoice: vi.fn(async (_userId: string, invoiceId: number) => {
      offlineStore.records = offlineStore.records.filter(record => record.id !== invoiceId);
      return true;
    }),
    getStoredInvoice: vi.fn(async (_userId: string, invoiceId: number) => offlineStore.records.find(record => record.id === invoiceId) ?? null),
    getStoredInvoices: vi.fn(async () => offlineStore.records),
    updateStoredInvoice: vi.fn(async (_userId: string, invoiceId: number, updates: Record<string, unknown>) => {
      const index = offlineStore.records.findIndex(record => record.id === invoiceId);
      if (index < 0) return null;
      offlineStore.records[index] = { ...offlineStore.records[index], ...updates } as OfflineRecord;
      return offlineStore.records[index];
    }),
    saveStoredInvoice: vi.fn(async (userId: string, invoice: any) => {
      const record = buildOfflineRecord({
        ...invoice,
        id: invoice.id,
        user_id: userId,
        line_items: invoice.line_items ?? [],
        customer_name: invoice.customer_name ?? null,
      });
      offlineStore.records.push(record);
      return record;
    }),
    storedInvoiceToApi: vi.fn((record: OfflineRecord) => ({ ...record, offline: true })),
    listPendingInvoices: vi.fn(async () => offlineStore.records.filter(record => record.pending_sync !== false)),
    recordInvoiceSyncFailure: vi.fn(async (_userId: string, invoiceId: number, message: string) => {
      const record = offlineStore.records.find(item => item.id === invoiceId);
      if (record) record.last_sync_error = message;
    }),
  };
});

vi.mock("../../lib/invoiceStore", () => invoiceStoreMocks);

const seedOfflineInvoices = (records: Array<Partial<OfflineRecord>>) => {
  offlineStore.records = records.map(record => buildOfflineRecord(record));
};

beforeEach(() => {
  resetSupabaseMocks();
  offlineStore.records = [];
  Object.values(invoiceStoreMocks).forEach(mockFn => {
    if (typeof mockFn?.mockClear === "function") {
      mockFn.mockClear();
    }
  });
});

describe("/api/invoices route", () => {
  it("returns invoices on GET", async () => {
    const mockInvoices = [{ id: 1, amount: 100 }];
    mockFrom
      .mockReturnValueOnce(buildSelectChain({ data: mockInvoices, error: null }))
      .mockReturnValueOnce(buildSelectChain({ data: [], error: null }));

    const response = await GET(new Request("http://localhost/api/invoices?user_id=demo"));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(mockInvoices.map(inv => ({ ...inv, line_items: [] })));
  });

  it("falls back to offline invoices when schema is missing", async () => {
    seedOfflineInvoices([{ id: -5, amount: 250, customer_name: "Offline Co" }]);
    mockFrom.mockReturnValueOnce(buildSelectChain({ data: null, error: { code: "PGRST205", message: "missing" } }));

    const response = await GET(new Request("http://localhost/api/invoices?user_id=demo"));
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toHaveLength(1);
    expect(payload[0].offline).toBe(true);
    expect(payload[0].customer_name).toBe("Offline Co");
  });

  it("blocks POST when user role is not permitted", async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { user_metadata: { role: "viewer" } } } });

    const response = await POST(
      new Request("http://localhost/api/invoices", { method: "POST", body: JSON.stringify({ user_id: "demo" }) })
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "You do not have permission to create invoices." });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("allows subcontractor to delete invoices", async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { user_metadata: { role: "subcontractor" } } } });
    mockFrom.mockReturnValueOnce(buildDeleteChain({ error: null }));

    const response = await DELETE(
      new Request("http://localhost/api/invoices", {
        method: "DELETE",
        body: JSON.stringify({ id: 10, user_id: "demo" }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
  });

  it("creates invoice for admin users", async () => {
    const invoice = { id: 7, amount: 200, customer_id: 3, invoice_number: "FC-ADM-001" };
    const invoiceWithRelations = { ...invoice, customer: { id: 3, name: "Mbali" }, line_items: [] };
    mockAuthGetUser.mockResolvedValue({ data: { user: { user_metadata: { role: "admin" } } } });
    mockFrom
      .mockReturnValueOnce(buildInsertChain({ data: [invoice], error: null }))
      .mockReturnValueOnce(buildInsertChain({ data: null, error: null }))
      .mockReturnValueOnce(buildSelectChain({ data: invoiceWithRelations, error: null }))
      .mockReturnValueOnce(buildSelectChain({ data: [], error: null }));

    const response = await POST(
      new Request("http://localhost/api/invoices", {
        method: "POST",
        body: JSON.stringify({
          customer_id: 3,
          amount: 200,
          description: "Scope",
          reference: "Draw",
          lines: [{ itemName: "Survey", quantity: 1, rate: 200, total: 200 }],
          user_id: "demo",
        }),
      })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(invoiceWithRelations);
  });

  it("saves invoices offline when Supabase tables are missing", async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { user_metadata: { role: "admin" } } } });
    mockFrom.mockReturnValueOnce(buildInsertChain({ data: null, error: { code: "PGRST205", message: "missing" } }));

    const response = await POST(
      new Request("http://localhost/api/invoices", {
        method: "POST",
        body: JSON.stringify({
          customer_id: 4,
          amount: 120,
          lines: [{ itemName: "Site visit", quantity: 1, rate: 120, total: 120 }],
          user_id: "demo",
        }),
      })
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.offline).toBe(true);
    expect(invoiceStoreMocks.saveStoredInvoice).toHaveBeenCalled();
  });

  it("updates offline invoices through PATCH", async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { user_metadata: { role: "admin" } } } });
    seedOfflineInvoices([
      {
        id: -42,
        amount: 300,
        line_items: [
          {
            id: "line-1",
            item_id: null,
            name: "Offline service",
            quantity: 1,
            rate: 300,
            total: 300,
            project: null,
            note: null,
            source: null,
            task_ref: null,
          },
        ],
      },
    ]);

    const response = await PATCH(
      new Request("http://localhost/api/invoices", {
        method: "PATCH",
        body: JSON.stringify({ id: -42, amount: 450, user_id: "demo" }),
      })
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.amount).toBe(450);
    expect(invoiceStoreMocks.updateStoredInvoice).toHaveBeenCalledWith(
      DEFAULT_DEMO_USER_ID,
      -42,
      expect.objectContaining({ amount: 450 })
    );
  });
});

describe("/api/invoices/sync route", () => {
  it("syncs offline invoices into Supabase", async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { user_metadata: { role: "admin" } } } });
    seedOfflineInvoices([
      {
        id: -55,
        amount: 180,
        line_items: [
          {
            id: "line-1",
            item_id: null,
            name: "Offline",
            quantity: 1,
            rate: 180,
            total: 180,
            project: null,
            note: null,
            source: null,
            task_ref: null,
          },
        ],
      },
    ]);
    mockFrom
      .mockReturnValueOnce(buildInsertChain({ data: [{ id: 77 }], error: null }))
      .mockReturnValueOnce(buildInsertChain({ data: null, error: null }));

    const response = await SYNC(
      new Request("http://localhost/api/invoices/sync", {
        method: "POST",
        body: JSON.stringify({ user_id: "demo" }),
      })
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.synced).toBe(1);
    expect(invoiceStoreMocks.deleteStoredInvoice).toHaveBeenCalled();
  });
});
