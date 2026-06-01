"use client";

export default function BookCard({ book, animationDelay = "0s", onRate, onEdit, onDelete }) {
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
            {n <= book.puntaje ? "★" : "☆"}
          </button>
        ))}
      </div>

      <p>{book.resena}</p>

    </article>
  );
}