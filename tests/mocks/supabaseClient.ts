import { vi } from "vitest";

export const mockFrom = vi.fn();
export const mockAuthGetUser = vi.fn();
export const mockStorageFrom = vi.fn();
export const mockEnsureAuthUser = vi.fn().mockResolvedValue(undefined);

export class MockEnsureAuthUserError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "EnsureAuthUserError";
  }
}

export function resetSupabaseMocks() {
  mockFrom.mockReset();
  mockAuthGetUser.mockReset();
  mockStorageFrom.mockReset();
  mockEnsureAuthUser.mockReset();
  mockEnsureAuthUser.mockResolvedValue(undefined);
}

vi.mock("../../lib/supabaseClient", () => ({
  supabase: {
    from: mockFrom,
    auth: {
      getUser: mockAuthGetUser,
    },
    storage: {
      from: mockStorageFrom,
    },
  },
}));

vi.mock("../../lib/supabaseServer", () => ({
  supabaseServer: {
    from: mockFrom,
  },
}));

vi.mock("../../lib/demoAuth", () => ({
  ensureAuthUser: mockEnsureAuthUser,
  EnsureAuthUserError: MockEnsureAuthUserError,
}));
