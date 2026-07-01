"use client";

export default function BookCard({ book, animationDelay = "0s", onRate, onEdit, onDelete }) {
  const score = book.puntaje_leido ?? book.puntaje ?? 0;

  return (
    <article className="tarjeta" style={{ animationDelay }} data-testid="book-card" >
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

      {onEdit ? (
        <div className="acciones" style={{ marginTop: "8px" }}>
          <button
            type="button"
            onClick={() => onEdit?.(book.id)}
            aria-label="Editar"
            data-testid="edit-button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 8px",
              background: "transparent",
              border: "1px solid transparent",
              cursor: "pointer",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
            Editar
          </button>
        </div>
      ) : null}

      <p>{book.resena}</p>

    </article>
  );
}