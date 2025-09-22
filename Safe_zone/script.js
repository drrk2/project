// Mostrar fecha actual
const fechaElement = document.getElementById("fecha");
const hoy = new Date();
const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
fechaElement.textContent = "Fecha: " + hoy.toLocaleDateString('es-ES', opciones);

// Habilitar botón al marcar checkbox
const checkbox = document.getElementById("checkbox");
const btn = document.getElementById("btn");

checkbox.addEventListener("change", () => {
  btn.disabled = !checkbox.checked;
});

// Acción del botón
btn.addEventListener("click", () => {
  alert("¡Gracias por aceptar el acuerdo!");
});
