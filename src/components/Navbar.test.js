import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({ href, className, children }) => createElement("a", { href, className }, children),
}));

import Navbar from "@/components/Navbar.jsx";

describe("Navbar", () => {
  it("marca la sección activa", () => {
    const markup = renderToStaticMarkup(React.createElement(Navbar, { active: "buscar" }));

    expect(markup).toContain('href="/buscar" class="active"');
    expect((markup.match(/class="active"/g) ?? []).length).toBe(1);
    expect(markup).toContain("Libros leídos");
    expect(markup).toContain("Mi cuenta");
  });
});