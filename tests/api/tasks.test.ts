import "../mocks/supabaseClient";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockFrom, resetSupabaseMocks } from "../mocks/supabaseClient";
import { GET, POST } from "../../app/api/tasks/route";

const createThenableBuilder = (result: any) => {
  const promise = Promise.resolve(result);
  const builder: any = {};
  builder.eq = vi.fn().mockReturnValue(builder);
  builder.order = vi.fn().mockReturnValue(builder);
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

beforeEach(() => {
  resetSupabaseMocks();
});

describe("/api/tasks route", () => {
  it("returns tasks on GET", async () => {
    const mockTasks = [{ id: 1, name: "Dig" }];
    mockFrom.mockReturnValueOnce(buildSelectChain({ data: mockTasks, error: null }));

    const response = await GET(new Request("http://localhost/api/tasks?user_id=demo"));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(mockTasks);
  });

  it("propagates supabase errors on GET", async () => {
    mockFrom.mockReturnValueOnce(
      buildSelectChain({ data: null, error: { message: "boom" } })
    );

    const response = await GET(new Request("http://localhost/api/tasks?user_id=demo"));
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "boom" });
  });

  it("creates a task on POST", async () => {
    const newTask = { id: 9, name: "Pour" };
    mockFrom.mockReturnValueOnce(
      buildInsertChain({ data: [newTask], error: null })
    );

    const request = new Request("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({ name: "Pour", user_id: "demo" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(newTask);
  });

  it("returns 500 when insert fails", async () => {
    mockFrom.mockReturnValueOnce(
      buildInsertChain({ data: null, error: { message: "insert failed" } })
    );

    const request = new Request("http://localhost/api/tasks", {
      method: "POST",
      body: JSON.stringify({ name: "Fail", user_id: "demo" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "insert failed" });
  });
});
