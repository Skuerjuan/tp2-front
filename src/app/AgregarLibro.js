function agregarLibro() {
    const nuevo = {
      titulo: document.getElementById("tituloInput").value,
      autor: document.getElementById("autorInput").value,
      puntaje: 0,
      resena: document.getElementById("resenaInput").value
    };
  
    resenas.push(nuevo);
    contenedor.innerHTML = "";
    renderizar();
  }