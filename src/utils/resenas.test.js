import { beforeEach, describe, expect, it, vi } from "vitest";

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
}));

vi.mock("@/utils/supabase/client.js", () => ({
  createClient: createClientMock,
}));

function createSelectChain(response) {
  return {
    eq: vi.fn(() => Promise.resolve(response)),
    in: vi.fn(() => Promise.resolve(response)),
    single: vi.fn(() => Promise.resolve(response)),
  };
}

function createSupabaseMock(sequence) {
  const from = vi.fn(() => {
    const step = sequence.shift();

    if (!step) {
      throw new Error("Unexpected Supabase call");
    }

    if (step.kind === "select") {
      return {
        select: vi.fn(() => createSelectChain(step.response)),
      };
    }

    if (step.kind === "insert") {
      return {
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve(step.response)),
          })),
        })),
      };
    }

    if (step.kind === "update") {
      return {
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              select: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve(step.response)),
              })),
            })),
          })),
        })),
      };
    }

    if (step.kind === "delete") {
      return {
        delete: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve(step.response)),
        })),
      };
    }

    throw new Error(`Unsupported step ${step.kind}`);
  });

  return { from };
}

async function loadModule(sequence) {
  vi.resetModules();
  createClientMock.mockReturnValue(createSupabaseMock(sequence));
  return import("@/utils/resenas.js");
}

describe("resenas helpers", () => {
  beforeEach(() => {
    createClientMock.mockReset();
  });

  it("fetchResenas returns all rows", async () => {
    const { fetchResenas } = await loadModule([
      { kind: "select", response: { data: [{ id: 1, titulo: "Libro" }], error: null } },
    ]);

    await expect(fetchResenas()).resolves.toEqual([{ id: 1, titulo: "Libro" }]);
  });

  it("fetchLeidos filters by usuario_id", async () => {
    const { fetchLeidos } = await loadModule([
      { kind: "select", response: { data: [{ puntaje: 4, resena_id: 9 }], error: null } },
    ]);

    await expect(fetchLeidos("user-1")).resolves.toEqual([{ puntaje: 4, resena_id: 9 }]);
  });

  it("fetchResenasDesdeLeidos returns empty array when there are no ids", async () => {
    const { fetchResenasDesdeLeidos } = await loadModule([
      { kind: "select", response: { data: [{ puntaje: 3, resena_id: null }], error: null } },
    ]);

    await expect(fetchResenasDesdeLeidos("user-1")).resolves.toEqual([]);
  });

  it("fetchLeidosConResenas merges ratings with reviews", async () => {
    const { fetchLeidosConResenas } = await loadModule([
      {
        kind: "select",
        response: {
          data: [
            { puntaje: 5, resena_id: 10 },
            { puntaje: 3, resena_id: 11 },
          ],
          error: null,
        },
      },
      {
        kind: "select",
        response: {
          data: [
            { id: 10, titulo: "Uno" },
            { id: 11, titulo: "Dos" },
          ],
          error: null,
        },
      },
    ]);

    await expect(fetchLeidosConResenas("user-1")).resolves.toEqual([
      { id: 10, titulo: "Uno", puntaje_leido: 5, resena_id: 10 },
      { id: 11, titulo: "Dos", puntaje_leido: 3, resena_id: 11 },
    ]);
  });

  it("insertLeido sends the payload and returns the inserted row", async () => {
    const { insertLeido } = await loadModule([
      {
        kind: "insert",
        response: { data: { id: 7, usuario_id: "user-1", resena_id: 3, puntaje: 0 }, error: null },
      },
    ]);

    await expect(insertLeido("user-1", 3)).resolves.toEqual({
      id: 7,
      usuario_id: "user-1",
      resena_id: 3,
      puntaje: 0,
    });
  });

  it("deleteResena resolves when the delete succeeds", async () => {
    const { deleteResena } = await loadModule([
      { kind: "delete", response: { error: null } },
    ]);

    await expect(deleteResena(9)).resolves.toBeUndefined();
  });
});