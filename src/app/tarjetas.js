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
  
resenas.forEach(libro => {
    let estrellas = "";
    for (let i = 1; i <= 5; i++) {
      estrellas += `<span class="estrella" data-valor="${i}" style="cursor:pointer; font-size:24px;">
        ${i <= libro.puntaje ? "★" : "☆"}
      </span>`;
}
  
contenedor.innerHTML += `
    <div class="tarjeta">
    <h3>${libro.titulo}</h3>
    <p><strong>Autor:</strong> ${libro.autor}</p>
    <div class="puntaje">${estrellas}</div>
    <p>${libro.resena}</p>
    </div>
`;
});
  
document.querySelectorAll(".estrella").forEach(estrella => {
    estrella.addEventListener("click", function() {
        const valor = this.dataset.valor;
        const tarjeta = this.closest(".tarjeta");
        tarjeta.querySelectorAll(".estrella").forEach(e => {
            e.textContent = e.dataset.valor <= valor ? "★" : "☆";
        });
    });
});