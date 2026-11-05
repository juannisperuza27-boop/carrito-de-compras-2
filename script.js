let idEnEdicion = null;

/* ============================
   API
   ============================ */

async function cargarProductos() {
    try {
        const resultado = await fetch("http://localhost:3000/productos");
        if (!resultado.ok) throw new Error("No hay respuesta de productos");
        return await resultado.json();
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        return [];
    }
}

async function productoPorId(id) {
    const resultado = await fetch(`http://localhost:3000/productos/${id}`);
    if (!resultado.ok) throw new Error("Producto no encontrado");
    return await resultado.json();
}

/* ============================
   Pintar listado
   ============================ */

async function pintarProductos() {
    const productos = await cargarProductos();
    const divProductos = document.getElementById("productos");
    if (!divProductos) return;

    if (productos.length === 0) {
        divProductos.innerHTML = "<p>No hay productos disponibles.</p>";
        return;
    }

    let html = "<ul>";
    productos.forEach(producto => {
        html += `
            <li>
                ${producto.nombre} 
                <a href="detalle.html?id=${encodeURIComponent(producto.id)}" class="detalle-link">Detalle</a>
                <button class="btn-editar" 
                    data-id="${producto.id}" 
                    data-nombre="${String(producto.nombre).replace(/"/g, '&quot;')}" 
                    data-stock="${producto.stock}" 
                    data-precio="${producto.precio}"
                    style="margin-left: 10px; font-size: 12px;">Actualizar</button>
            </li>
        `;
    });
    html += "</ul>";

    divProductos.innerHTML = html;

    // Listeners para los botones "Actualizar" de la lista
    divProductos.querySelectorAll(".btn-editar").forEach(btn => {
        btn.addEventListener("click", () => {
            consultarYllenar(
                btn.dataset.id,
                btn.dataset.nombre,
                Number(btn.dataset.stock),
                Number(btn.dataset.precio)
            );
        });
    });
}

/* ============================
   Consultar y Llenar (Editar)
   ============================ */

function consultarYllenar(id, nombre, stock, precio) {
    document.getElementById("nombre").value = nombre;
    document.getElementById("stock").value = stock;
    document.getElementById("precio").value = precio;

    idEnEdicion = id;

    // Mostrar el botón de Actualizar al lado de Crear y ocultar el de Crear
    document.getElementById("btnActualizar").style.display = "block";
    document.getElementById("btnCrear").style.display = "none";

    // Hacer scroll suavemente hacia el formulario
    document.getElementById("formularioProducto").scrollIntoView({ behavior: "smooth" });
}

function resetearFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("precio").value = "";

    idEnEdicion = null;

    // Ocultar el botón de Actualizar y mostrar el de Crear
    document.getElementById("btnActualizar").style.display = "none";
    document.getElementById("btnCrear").style.display = "block";
}

/* ============================
   Crear y Actualizar
   ============================ */

function inicializarFormulario() {
    const btnCrear = document.getElementById("btnCrear");
    const btnActualizar = document.getElementById("btnActualizar");
    
    if (!btnCrear || !btnActualizar) return;

    function obtenerDatosFormulario() {
        const nombre = document.getElementById("nombre").value.trim();
        const stock = document.getElementById("stock").value;
        const precio = document.getElementById("precio").value;

        if (!nombre || stock === "" || precio === "") {
            alert("Por favor completa todos los campos.");
            return null;
        }

        const stockNum = Number(stock);
        const precioNum = Number(precio);

        if (isNaN(stockNum) || isNaN(precioNum) || stockNum < 0 || precioNum < 0) {
            alert("Stock y precio deben ser números positivos.");
            return null;
        }

        return { nombre, stock: stockNum, precio: precioNum };
    }

    // Crear (POST)
    btnCrear.addEventListener("click", async function () {
        const data = obtenerDatosFormulario();
        if (!data) return;

        try {
            const respuesta = await fetch("http://localhost:3000/productos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!respuesta.ok) throw new Error("No se pudo crear el producto");

            await pintarProductos();
            resetearFormulario();
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al intentar crear el producto.");
        }
    });

    // Actualizar (PUT)
    btnActualizar.addEventListener("click", async function () {
        if (idEnEdicion === null) return; 

        const data = obtenerDatosFormulario();
        if (!data) return;

        data.id = Number(idEnEdicion);

        try {
            const respuesta = await fetch(`http://localhost:3000/productos/${idEnEdicion}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!respuesta.ok) throw new Error("No se pudo actualizar el producto");

            await pintarProductos();
            resetearFormulario();
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al intentar actualizar el producto.");
        }
    });
}

/* ============================
   Arranque
   ============================ */

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("productos")) {
        pintarProductos();
    }
    inicializarFormulario();
});

let html = "<ul>";
    productos.forEach(producto => {
        html += `
            <li>
                <strong>${producto.nombre}</strong> - Stock: ${producto.stock} - Precio: $${producto.precio}
                <a href="detalle.html?id=${encodeURIComponent(producto.id)}" class="detalle-link">Detalle</a>
                <button class="btn-editar" 
                    data-id="${producto.id}" 
                    data-nombre="${String(producto.nombre).replace(/"/g, '&quot;')}" 
                    data-stock="${producto.stock}" 
                    data-precio="${producto.precio}"
                    style="margin-left: 10px; font-size: 12px;">Actualizar</button>
            </li>
        `;
    });
    html += "</ul>";