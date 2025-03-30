// Datos de ejemplo para productos
const productos = [
    {
        id: 1,
        nombre: "Hoodie Oversized",
        precio: 59.99,
        imagen: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        categoria: "hoodies"
    },
    {
        id: 2,
        nombre: "Cargo Pants Baggy",
        precio: 79.99,
        imagen: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        categoria: "pantalones"
    },
    {
        id: 3,
        nombre: "T-Shirt Oversized",
        precio: 34.99,
        imagen: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        categoria: "camisetas"
    },
    {
        id: 4,
        nombre: "Jersey Deportivo",
        precio: 49.99,
        imagen: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        categoria: "jerseys"
    },
    {
        id: 5,
        nombre: "Cargo Shorts",
        precio: 45.99,
        imagen: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        categoria: "shorts"
    },
    {
        id: 6,
        nombre: "Hoodie Crop Top",
        precio: 54.99,
        imagen: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        categoria: "hoodies"
    }
];

// Carrito de compras
let carrito = [];

// Función para manejar la navegación
function navegarA(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(s => {
        s.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(seccion).classList.add('active');
    
    // Actualizar enlaces activos
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
    });
    document.querySelector(`[data-section="${seccion}"]`).classList.add('active');
    
    // Actualizar URL sin recargar la página
    history.pushState(null, '', `#${seccion}`);
}

// Función para cargar productos en la página
function cargarProductos(productosAMostrar = productos) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = ''; // Limpiar productos existentes
    
    productosAMostrar.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.className = 'producto';
        productoElement.innerHTML = `
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p class="precio">$${producto.precio.toFixed(2)}</p>
                <p class="categoria">${producto.categoria}</p>
                <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
            </div>
        `;
        productGrid.appendChild(productoElement);
    });
}

// Función para filtrar productos
function filtrarProductos() {
    const categoria = document.getElementById('categoria-filter').value;
    const ordenarPor = document.getElementById('ordenar-por').value;
    
    let productosFiltrados = [...productos];
    
    // Filtrar por categoría
    if (categoria !== 'todos') {
        productosFiltrados = productosFiltrados.filter(p => p.categoria === categoria);
    }
    
    // Ordenar productos
    if (ordenarPor === 'precio-asc') {
        productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (ordenarPor === 'precio-desc') {
        productosFiltrados.sort((a, b) => b.precio - a.precio);
    }
    
    cargarProductos(productosFiltrados);
}

// Función para actualizar el carrito
function actualizarCarrito() {
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    
    // Limpiar el contenido actual del carrito
    cartItems.innerHTML = '';
    
    if (carrito.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        totalAmount.textContent = '$0.00';
        return;
    }
    
    // Calcular el total
    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    totalAmount.textContent = `$${total.toFixed(2)}`;
    
    // Mostrar cada item del carrito
    carrito.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="cart-item-details">
                <h3>${item.nombre}</h3>
                <p>$${item.precio.toFixed(2)}</p>
            </div>
            <button class="remove-item" onclick="eliminarDelCarrito(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Función para eliminar items del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
    actualizarContadorCarrito();
    mostrarNotificacion('Producto eliminado del carrito');
}

// Función para agregar productos al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        carrito.push(producto);
        actualizarContadorCarrito();
        actualizarCarrito();
        mostrarNotificacion('Producto agregado al carrito');
        // Navegar automáticamente al carrito
        navegarA('carrito');
    }
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const contador = document.createElement('span');
    contador.className = 'carrito-contador';
    contador.textContent = carrito.length;
    
    const carritoIcon = document.querySelector('.fa-shopping-cart');
    const contadorExistente = document.querySelector('.carrito-contador');
    
    if (contadorExistente) {
        contadorExistente.remove();
    }
    
    carritoIcon.parentElement.appendChild(contador);
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion';
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    // Configurar navegación
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const seccion = a.getAttribute('data-section');
            navegarA(seccion);
        });
    });
    
    // Manejar navegación del historial
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.slice(1) || 'home';
        navegarA(hash);
    });
    
    // Configurar filtros de la tienda
    document.getElementById('categoria-filter').addEventListener('change', filtrarProductos);
    document.getElementById('ordenar-por').addEventListener('change', filtrarProductos);
    
    // Cargar productos iniciales
    cargarProductos();
    
    // Inicializar el carrito
    actualizarCarrito();
    
    // Agregar estilos para las notificaciones
    const style = document.createElement('style');
    style.textContent = `
        .notificacion {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            animation: slideIn 0.3s ease-out;
        }
        
        .carrito-contador {
            position: absolute;
            top: -8px;
            right: -8px;
            background-color: var(--accent-color);
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 0.8rem;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}); 