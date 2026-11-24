/* =========================================
   CASA DEL DISCO - CARRITO DE COMPRAS
   Archivo encargado de administrar
   los productos y el proceso de compra.
========================================= */

/* =========================================
   1. OBTENER CARRITO
   Recupera los productos guardados
   en el almacenamiento local del navegador.
========================================= */

function obtenerCarrito() {

    // Recupera los productos guardados o devuelve un arreglo vacío
    return JSON.parse(localStorage.getItem("carrito")) || [];
}


/* =========================================
   2. GUARDAR CARRITO
   Almacena los productos seleccionados
   utilizando localStorage.
========================================= */

function guardarCarrito(carrito) {

    // Convierte el arreglo a JSON y lo guarda
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


/* =========================================
   3. FORMATO DE PRECIOS
   Convierte los números a formato
   de moneda mexicana.
========================================= */

function formatoPrecio(precio) {

    // Agrega el signo de pesos y separadores de miles
    return "$" + precio.toLocaleString("es-MX") + " MXN";
}


/* =========================================
   4. CALCULAR TOTAL
   Suma los subtotales de todos
   los productos del carrito.
========================================= */

function calcularTotal(carrito) {

    return carrito.reduce(
        (total, producto) =>
            total + producto.precio * producto.cantidad,
        0
    );
}


/* =========================================
   5. AGREGAR PRODUCTOS AL CARRITO
   Detecta los botones que contienen
   el atributo data-agregar.
========================================= */

document.addEventListener("click", function(event) {

    // Identifica el botón presionado
    const boton = event.target.closest("[data-agregar]");

    // Si no es un botón para agregar, termina el evento
    if (!boton) return;

    // Recupera el nombre y precio del producto
    const nombre = boton.dataset.nombre;
    const precio = Number(boton.dataset.precio);

    // Comprueba que los datos sean correctos
    if (!nombre || !Number.isFinite(precio) || precio <= 0) {
        alert("No se pudo agregar el producto.");
        return;
    }

    // Recupera el carrito actual
    let carrito = obtenerCarrito();

    // Busca si el producto ya existe
    const existente = carrito.find(
        producto => producto.nombre === nombre
    );

    // Si existe, aumenta su cantidad
    if (existente) {

        existente.cantidad++;

    } else {

        // Si no existe, agrega un producto nuevo
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    // Guarda los cambios realizados
    guardarCarrito(carrito);

    // Muestra una confirmación
    alert(nombre + " se agregó al carrito.");

    // Redirige a la página del carrito
    window.location.href = "carrito.html";
});


/* =========================================
   6. MOSTRAR CARRITO
   Coloca los productos seleccionados
   dentro de la tabla y muestra el total.
========================================= */

function mostrarCarrito() {

    // Identifica la tabla del carrito
    const tabla = document.getElementById("productos-carrito");

    // Si no existe la tabla, termina la función
    if (!tabla) return;

    // Recupera los productos guardados
    const carrito = obtenerCarrito();

    // Identifica los elementos del resumen
    const resumen = document.getElementById("resumen-productos");
    const totalElemento = document.getElementById("total");

    // Limpia el contenido anterior
    tabla.innerHTML = "";
    resumen.innerHTML = "";

    // Inicializa el total
    let total = 0;

    // Comprueba si el carrito está vacío
    if (carrito.length === 0) {

        // Crea una fila para mostrar el mensaje
        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        // La celda ocupa las cinco columnas
        celda.colSpan = 5;
        celda.textContent = "Tu carrito está vacío.";

        // Agrega la celda a la fila
        fila.appendChild(celda);

        // Agrega la fila a la tabla
        tabla.appendChild(fila);

        // Muestra el total en cero
        totalElemento.textContent = formatoPrecio(0);

        return;
    }

    // Recorre todos los productos guardados
    carrito.forEach((producto, indice) => {

        // Calcula el subtotal de cada producto
        const subtotal = producto.precio * producto.cantidad;

        // Suma el subtotal al total general
        total += subtotal;

        // Crea una fila para el producto
        const fila = document.createElement("tr");

        // Organiza los datos del producto
        const datos = [
            producto.nombre,
            formatoPrecio(producto.precio),
            producto.cantidad,
            formatoPrecio(subtotal)
        ];

        // Agrega los datos a las celdas
        datos.forEach(dato => {

            const celda = document.createElement("td");
            celda.textContent = dato;

            fila.appendChild(celda);
        });

        // Crea la celda de acciones
        const acciones = document.createElement("td");

        // Botón para disminuir la cantidad
        const menos = document.createElement("button");
        menos.type = "button";
        menos.textContent = "-";
        menos.dataset.accion = "menos";
        menos.dataset.indice = indice;

        // Botón para aumentar la cantidad
        const mas = document.createElement("button");
        mas.type = "button";
        mas.textContent = "+";
        mas.dataset.accion = "mas";
        mas.dataset.indice = indice;

        // Botón para eliminar el producto
        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.textContent = "Eliminar";
        eliminar.dataset.accion = "eliminar";
        eliminar.dataset.indice = indice;

        // Agrega los botones a la celda
        acciones.append(menos, mas, eliminar);

        // Agrega la celda de acciones a la fila
        fila.appendChild(acciones);

        // Coloca la fila en la tabla
        tabla.appendChild(fila);

        // Crea un párrafo para el resumen
        const parrafo = document.createElement("p");

        parrafo.textContent =
            producto.nombre + ": " + formatoPrecio(subtotal);

        // Agrega el producto al resumen
        resumen.appendChild(parrafo);
    });

    // Actualiza el total de la compra
    totalElemento.textContent = formatoPrecio(total);
}


/* =========================================
   7. MODIFICAR CANTIDADES
   Permite aumentar, disminuir o eliminar
   productos del carrito.
========================================= */

document.addEventListener("click", function(event) {

    // Identifica los botones de acciones
    const boton = event.target.closest("[data-accion]");

    // Si no se presionó una acción, termina
    if (!boton) return;

    // Recupera los productos guardados
    let carrito = obtenerCarrito();

    // Obtiene el índice y el tipo de acción
    const indice = Number(boton.dataset.indice);
    const accion = boton.dataset.accion;

    // Comprueba que el producto exista
    if (!carrito[indice]) return;

    // Aumenta la cantidad
    if (accion === "mas") {
        carrito[indice].cantidad++;
    }

    // Disminuye la cantidad
    if (accion === "menos") {

        carrito[indice].cantidad--;

        // Elimina el producto si llega a cero
        if (carrito[indice].cantidad <= 0) {
            carrito.splice(indice, 1);
        }
    }

    // Elimina completamente el producto
    if (accion === "eliminar") {
        carrito.splice(indice, 1);
    }

    // Guarda los cambios
    guardarCarrito(carrito);

    // Actualiza la tabla y el resumen
    mostrarCarrito();
});


/* =========================================
   8. MOSTRAR UNA ETAPA A LA VEZ
   Controla las cuatro etapas del proceso
   de compra y oculta las demás secciones.
========================================= */

function mostrarEtapa(etapa) {

    // Identifica las secciones de compra
    const carrito = document.getElementById("seccion-carrito");
    const transferencia = document.getElementById("seccion-transferencia");
    const resumen = document.getElementById("seccion-resumen");
    const finalizada = document.getElementById("seccion-finalizada");

    // Comprueba que las secciones existan antes de modificarlas
    if (carrito) {
        carrito.hidden = etapa !== "carrito";
    }

    if (transferencia) {
        transferencia.hidden = etapa !== "transferencia";
    }

    if (resumen) {
        resumen.hidden = etapa !== "resumen";
    }

    if (finalizada) {
        finalizada.hidden = etapa !== "finalizada";
    }
}


/* =========================================
   9. ETAPA 1: CONFIRMAR COMPRA
   Verifica que existan productos y muestra
   el total que se debe transferir.
========================================= */

// Identifica el formulario de pago
const formularioPago = document.getElementById("formulario-pago");

// Comprueba que el formulario exista
if (formularioPago) {

    // Evento que se ejecuta al enviar el formulario
    formularioPago.addEventListener("submit", function(event) {

        // Evita que la página se recargue
        event.preventDefault();

        // Recupera los productos
        const carrito = obtenerCarrito();

        // Comprueba que el carrito tenga productos
        if (carrito.length === 0) {
            alert("Tu carrito está vacío. Agrega productos primero.");
            return;
        }

        // Calcula el total
        const total = calcularTotal(carrito);

        // Muestra el total de la transferencia
        document.getElementById("total-transferencia").textContent =
            formatoPrecio(total);

        // Pasa a la etapa de transferencia
        mostrarEtapa("transferencia");
    });
}


/* =========================================
   10. ETAPA 2: CONFIRMAR TRANSFERENCIA
   Después de confirmar la transferencia,
   muestra el resumen de la compra.
========================================= */

// Identifica el formulario de transferencia
const formularioTransferencia =
    document.getElementById("formulario-transferencia");

// Comprueba que exista el formulario
if (formularioTransferencia) {

    // Evento al enviar el formulario
    formularioTransferencia.addEventListener("submit", function(event) {

        // Evita recargar la página
        event.preventDefault();

        // Recupera los productos
        const carrito = obtenerCarrito();

        // Comprueba que todavía existan productos
        if (carrito.length === 0) {
            alert("No hay productos en tu carrito.");
            mostrarEtapa("carrito");
            return;
        }

        // Genera el resumen final
        mostrarResumenFinal();

        // Cambia a la etapa del resumen
        mostrarEtapa("resumen");
    });
}


/* =========================================
   11. ETAPA 3: MOSTRAR RESUMEN FINAL
   Muestra los productos, cantidades,
   subtotales y total de la compra.
========================================= */

function mostrarResumenFinal() {

    // Recupera los productos
    const carrito = obtenerCarrito();

    // Identifica los elementos del resumen
    const tabla = document.getElementById("resumen-final-productos");
    const totalElemento = document.getElementById("total-final");
    const cantidadElemento = document.getElementById("cantidad-final");

    // Si no existe la tabla, termina
    if (!tabla) return;

    // Limpia la tabla anterior
    tabla.innerHTML = "";

    // Inicializa la cantidad total
    let cantidadTotal = 0;

    // Recorre los productos
    carrito.forEach(producto => {

        // Crea una fila
        const fila = document.createElement("tr");

        // Calcula el subtotal
        const subtotal = producto.precio * producto.cantidad;

        // Suma la cantidad de productos
        cantidadTotal += producto.cantidad;

        // Organiza los datos
        const datos = [
            producto.nombre,
            formatoPrecio(producto.precio),
            producto.cantidad,
            formatoPrecio(subtotal)
        ];

        // Crea las celdas
        datos.forEach(dato => {

            const celda = document.createElement("td");
            celda.textContent = dato;

            fila.appendChild(celda);
        });

        // Agrega la fila a la tabla
        tabla.appendChild(fila);
    });

    // Muestra el total final
    totalElemento.textContent = formatoPrecio(calcularTotal(carrito));

    // Muestra la cantidad de productos
    cantidadElemento.textContent = cantidadTotal;
}


/* =========================================
   12. ETAPA 4: FINALIZAR COMPRA
   Vacía el carrito y muestra el mensaje
   de confirmación de compra.
========================================= */

// Identifica el botón de finalizar
const botonFinalizar = document.getElementById("finalizar-compra");

// Comprueba que exista el botón
if (botonFinalizar) {

    // Evento al presionar finalizar compra
    botonFinalizar.addEventListener("click", function() {

        // Recupera los productos
        const carrito = obtenerCarrito();

        // Comprueba que haya productos
        if (carrito.length === 0) {
            alert("No hay productos para finalizar.");
            return;
        }

        // Vacía el carrito guardado
        localStorage.removeItem("carrito");

        // Muestra la pantalla de compra finalizada
        mostrarEtapa("finalizada");
    });
}


/* =========================================
   13. INICIAR PÁGINA
   Ejecuta las funciones necesarias
   cuando el documento termina de cargar.
========================================= */

document.addEventListener("DOMContentLoaded", function() {

    // Muestra los productos guardados
    mostrarCarrito();

    // Muestra la etapa inicial si corresponde
    mostrarEtapa("carrito");

});
