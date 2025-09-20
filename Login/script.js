// Inicializar EmailJS (regístrate en https://www.emailjs.com/)
emailjs.init("TU_USER_ID_AQUI");

// Datos de ejemplo para autenticar
const usuarioValido = {
  email: "usuario@ejemplo.com",
  password: "123456"
};

document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const mensaje = document.getElementById("mensaje");

  // Validar usuario
  if(email === usuarioValido.email && password === usuarioValido.password){
    mensaje.style.color = "green";
    mensaje.textContent = "Inicio de sesión correcto. Enviando correo...";

    // Enviar correo con EmailJS
    emailjs.send("TU_SERVICE_ID", "TU_TEMPLATE_ID", {
      to_email: email,
      message: "Has iniciado sesión correctamente en nuestra tienda."
    }).then(() => {
      mensaje.textContent = "Correo enviado correctamente!";
    }).catch(() => {
      mensaje.style.color = "red";
      mensaje.textContent = "Error al enviar correo.";
    });

  } else {
    mensaje.style.color = "red";
    mensaje.textContent = "Usuario o contraseña incorrectos.";
  }
});
