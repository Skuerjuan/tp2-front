"use client";

export default function BookCard({ book, animationDelay = "0s", onRate, onEdit, onDelete }) {
  const score = book.puntaje_leido ?? book.puntaje ?? 0;

  return (
    <article className="tarjeta" style={{ animationDelay }}>
      <h3>{book.titulo}</h3>
      <p>
        <strong>Autor:</strong> {book.autor}
      </p>
      <p>
        <em>{book.genero}</em>
      </p>

      <div className="puntaje">
        {[1, 2, 3, 4, 5].map((n) => (
          onRate ? (
            <button
              key={n}
              type="button"
              onClick={() => onRate?.(book.id, n)}
              style={{
                cursor: "pointer",
                fontSize: "24px",
                background: "transparent",
                border: "none",
              }}
              aria-label={`Puntaje ${n}`}
            >
              {n <= score ? "★" : "☆"}
            </button>
          ) : (
            <span
              key={n}
              style={{
                fontSize: "24px",
                background: "transparent",
                border: "none",
              }}
              aria-label={`Puntaje ${n}`}
            >
              {n <= score ? "★" : "☆"}
            </span>
          )
        ))}
      </div>

      <p>{book.resena}</p>

    </article>
  );
}