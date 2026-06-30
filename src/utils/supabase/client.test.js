import { beforeEach, describe, expect, it, vi } from "vitest";

const { createBrowserClientMock } = vi.hoisted(() => ({
  createBrowserClientMock: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
  createBrowserClient: createBrowserClientMock,
}));

describe("createClient", () => {
  beforeEach(() => {
    vi.resetModules();
    createBrowserClientMock.mockReset();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "public-key";
  });

  it("passes env vars to createBrowserClient", async () => {
    const client = { mocked: true };
    createBrowserClientMock.mockReturnValue(client);

    const { createClient } = await import("@/utils/supabase/client.js");

    expect(createClient()).toBe(client);
    expect(createBrowserClientMock).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "public-key"
    );
  });
});