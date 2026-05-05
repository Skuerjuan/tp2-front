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
    contenedor.innerHTML += `
    <div class="tarjeta">
        <h3>${libro.titulo}</h3>
        <p><strong>Autor:</strong> ${libro.autor}</p>
        <p><strong>Puntaje:</strong> ${"⭐".repeat(libro.puntaje)}</p>
        <p>${libro.resena}</p>
    </div>`;
});