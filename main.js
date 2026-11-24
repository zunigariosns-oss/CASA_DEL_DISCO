/* =========================================
   CASA DEL DISCO - MAIN.JS
   Menú hamburguesa y validación
   del formulario de contacto.
========================================= */

document.addEventListener("DOMContentLoaded", function() {

    /* =========================================
       1. MENÚ HAMBURGUESA
    ========================================= */

    const botonMenu = document.querySelector(".menu-hamburguesa");
    const navegacion = document.querySelector(".encabezado nav");

    if (botonMenu && navegacion) {

        botonMenu.addEventListener("click", function() {

            navegacion.classList.toggle("menu-activo");

            const abierto = navegacion.classList.contains("menu-activo");

            botonMenu.setAttribute("aria-expanded", abierto);

            botonMenu.textContent = abierto ? "✕" : "☰";

        });

        navegacion.querySelectorAll("a").forEach(function(enlace) {

            enlace.addEventListener("click", function() {

                navegacion.classList.remove("menu-activo");

                botonMenu.setAttribute("aria-expanded", "false");

                botonMenu.textContent = "☰";

            });

        });
    }


    /* =========================================
       2. VALIDACIÓN DEL FORMULARIO
    ========================================= */

    const formulario = document.querySelector(".formulario");

    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const telefono = document.getElementById("telefono");
    const asunto = document.getElementById("asunto");
    const mensaje = document.getElementById("mensaje");

    const privacidad = document.querySelector(
        'input[name="privacidad"]'
    );

    const mensajeValidacion = document.getElementById(
        "mensaje-validacion"
    );

    if (
        formulario &&
        nombre &&
        correo &&
        telefono &&
        asunto &&
        mensaje &&
        privacidad
    ) {

        formulario.noValidate = true;

        formulario.addEventListener("submit", function(event) {

            event.preventDefault();

            let errores = [];

            mensajeValidacion.textContent = "";
            mensajeValidacion.className = "";

            document.querySelectorAll(".mensaje-error").forEach(
                function(elemento) {
                    elemento.remove();
                }
            );

            document.querySelectorAll(".campo-error").forEach(
                function(elemento) {
                    elemento.classList.remove("campo-error");
                }
            );

            document.querySelectorAll(".campo-correcto").forEach(
                function(elemento) {
                    elemento.classList.remove("campo-correcto");
                }
            );


            // Función para mostrar errores
            function mostrarError(campo, texto) {

                campo.classList.add("campo-error");

                campo.setAttribute("aria-invalid", "true");

                const error = document.createElement("span");

                error.className = "mensaje-error";

                error.textContent = texto;

                campo.insertAdjacentElement("afterend", error);

                errores.push(texto);
            }


            // Función para marcar campos correctos
            function marcarCorrecto(campo) {

                campo.classList.add("campo-correcto");

                campo.setAttribute("aria-invalid", "false");
            }


            /* VALIDACIÓN DEL NOMBRE */

            if (nombre.value.trim() === "") {

                mostrarError(nombre, "El nombre es obligatorio.");

            } else if (nombre.value.trim().length < 3) {

                mostrarError(nombre, "El nombre debe tener al menos 3 caracteres.");

            } else if (nombre.value.trim().length > 80) {

                mostrarError(nombre, "El nombre no puede superar 80 caracteres.");

            } else {

                marcarCorrecto(nombre);
            }


            /* VALIDACIÓN DEL CORREO */

            const expresionCorreo =
                /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

            if (correo.value.trim() === "") {

                mostrarError(correo, "El correo electrónico es obligatorio.");

            } else if (!expresionCorreo.test(correo.value.trim())) {

                mostrarError(correo, "Ingresa un correo electrónico válido.");

            } else {

                marcarCorrecto(correo);
            }


            /* VALIDACIÓN DEL TELÉFONO */

            const expresionTelefono = /^[0-9]{10}$/;

            if (telefono.value.trim() === "") {

                mostrarError(telefono, "El teléfono es obligatorio.");

            } else if (!expresionTelefono.test(telefono.value.trim())) {

                mostrarError(
                    telefono,
                    "El teléfono debe contener exactamente 10 dígitos."
                );

            } else {

                marcarCorrecto(telefono);
            }


            /* VALIDACIÓN DEL ASUNTO */

            if (asunto.value === "") {

                mostrarError(asunto, "Debes seleccionar un asunto.");

            } else {

                marcarCorrecto(asunto);
            }


            /* VALIDACIÓN DEL MENSAJE */

            if (mensaje.value.trim() === "") {

                mostrarError(mensaje, "El mensaje es obligatorio.");

            } else if (mensaje.value.trim().length < 10) {

                mostrarError(
                    mensaje,
                    "El mensaje debe contener al menos 10 caracteres."
                );

            } else if (mensaje.value.trim().length > 500) {

                mostrarError(
                    mensaje,
                    "El mensaje no puede superar 500 caracteres."
                );

            } else {

                marcarCorrecto(mensaje);
            }


            /* VALIDACIÓN DE PRIVACIDAD */

            if (!privacidad.checked) {

                mostrarError(
                    privacidad,
                    "Debes aceptar el envío del formulario."
                );

            } else {

                marcarCorrecto(privacidad);
            }


            /* =========================================
               3. RESULTADO DE LA VALIDACIÓN
            ========================================= */

            if (errores.length > 0) {

                mensajeValidacion.textContent =
                    "No se pudo enviar el formulario. Revisa los campos señalados.";

                mensajeValidacion.className =
                    "mensaje-general-error";

                alert(
                    "Formulario incompleto o incorrecto.\n\n" +
                    errores.join("\n")
                );

                const primerError = formulario.querySelector(
                    ".campo-error"
                );

                if (primerError) {
                    primerError.focus();
                }

                return;
            }


            /* =========================================
               4. FORMULARIO CORRECTO
            ========================================= */

            mensajeValidacion.textContent =
                "¡Formulario validado correctamente! Enviando mensaje.";

            mensajeValidacion.className = "mensaje-exito";

            alert("¡Gracias! Tu formulario fue validado correctamente.");

            formulario.submit();

        });

    }

});
