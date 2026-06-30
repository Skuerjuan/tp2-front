import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import BookCard from "@/components/BookCard.jsx";

describe("BookCard", () => {
  const book = {
    id: 7,
    titulo: "El túnel",
    autor: "Ernesto Sábato",
    genero: "Novela",
    resena: "Oscura e intensa",
    puntaje: 4,
    puntaje_leido: 2,
  };

  it("renderiza la información del libro y usa puntaje_leido cuando existe", () => {
    const markup = renderToStaticMarkup(React.createElement(BookCard, { book }));

    expect(markup).toContain("El túnel");
    expect(markup).toContain("Ernesto Sábato");
    expect(markup).toContain("Novela");
    expect((markup.match(/★/g) ?? []).length).toBe(2);
    expect((markup.match(/☆/g) ?? []).length).toBe(3);
  });

  it("muestra botones de puntaje cuando recibe onRate", () => {
    const markup = renderToStaticMarkup(
      React.createElement(BookCard, {
        book,
        onRate: () => {},
      })
    );

    expect((markup.match(/<button/g) ?? []).length).toBe(5);
    expect(markup).toContain('aria-label="Puntaje 1"');
  });
});