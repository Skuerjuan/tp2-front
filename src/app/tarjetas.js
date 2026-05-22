const resenas = [
    {
      titulo: "Cien años de soledad",
      autor: "Gabriel García Márquez",
      puntaje: 5,
      resena: "Una obra maestra del realismo mágico."
    },
    {
      titulo: "El túnel",
      autor: "Ernesto Sábato",
      puntaje: 4,
      resena: "Intensa y oscura, no la podés soltar."
    },
    {
      titulo: "Ficciones",
      autor: "Jorge Luis Borges",
      puntaje: 5,
      resena: "Cada cuento es un universo propio."
    }
];
  
const contenedor = document.getElementById("contenido");

function renderTarjeta(libro, index) {
  let estrellas = "";
  for (let i = 1; i <= 5; i++) {
    estrellas += `<span class="estrella" data-valor="${i}">${i <= libro.puntaje ? "★" : "☆"}</span>`;
  }
  
  const div = document.createElement("div");
  div.className = "tarjeta";
  div.style.animationDelay = `${index * 0.08}s`;
  div.innerHTML = `
    <h3>${libro.titulo}</h3>
    <p><strong>Autor:</strong> ${libro.autor}</p>
    <div class="puntaje">${estrellas}</div>
    <p>${libro.resena}</p>
  `;
  
  div.querySelectorAll(".estrella").forEach(estrella => {
    estrella.addEventListener("click", function () {
      const valor = this.dataset.valor;
      div.querySelectorAll(".estrella").forEach(e => {
        e.textContent = e.dataset.valor <= valor ? "★" : "☆";
      });
    });
  });

  contenedor.appendChild(div);
}

resenas.forEach((libro, i) => renderTarjeta(libro, i));
