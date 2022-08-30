// identificamos nuestros id para poder manipularlos
const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
const templateCard = document.getElementById("template-card").content
const templateFoter = document.getElementById("template-footer").content
const templateCarrito = document.getElementById("template-carrito").content
const fragment = document.createDocumentFragment()
let carrito = {}

// precargamos nuestros datos antes de iniciar el codigo
document.addEventListener("DOMContentLoaded", () => {
    fetchData()
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        impCarrito()
    }
})

//sweet alert
setTimeout(() => {
    const { value: email } = Swal.fire({
        title: 'Reciba informacion sobre nuestros servicios',
        input: 'email',
        inputLabel: 'Suscribase aqui',
        inputPlaceholder: 'Su correo electronico',
        showCancelButton: true,
    })
}, 3000);

cards.addEventListener("click", e => {
    addCarrito(e)
})
items.addEventListener("click", e => {
    btnAccion(e)
})

// carga de api simulando el servidor
const fetchData = async () => {
    try {
        const res = await fetch("js/api.json")
        const data = await res.json()
        imprimirCards(data)
    } catch (error) {
        console.log(error);
    }
}

// identificamos los elementos para trabajar sobre las cards y el carrito
const imprimirCards = data => {
    data.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.title
        templateCard.querySelector("p").textContent = producto.precio
        templateCard.querySelector("img").setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector(".btn-dark").dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const addCarrito = e => {

    if ((e.target.classList.contains("btn-dark"))) {
        setCarrito((e.target.parentElement))
        //toastify
        Toastify({
            text: "Producto agregado correctamente",
            duration: 1000
        }).showToast();
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector(".btn-dark").dataset.id,
        title: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = { ...producto }
    impCarrito()
}

const impCarrito = () => {
    items.innerHTML = ""
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector("th").textContent = producto.id
        templateCarrito.querySelectorAll("td")[0].textContent = producto.title
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    impFooter()

    localStorage.setItem("carrito", JSON.stringify(carrito))
}

const impFooter = () => {
    footer.innerHTML = ""
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }
    // acumulador
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)
    templateFoter.querySelectorAll("td")[0].textContent = nCantidad
    templateFoter.querySelector("span").textContent = nPrecio
    const clone = templateFoter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)
    const btnVaciar = document.getElementById("vaciar-carrito")
    btnVaciar.addEventListener("click", () => {
        carrito = {}
        impCarrito()
    })
}

const btnAccion = e => {
    // funcion de los botones + y -
    if (e.target.classList.contains("btn-info")) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        impCarrito()
    }
    if (e.target.classList.contains("btn-danger")) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        impCarrito()
    }
    e.stopPropagation()
}


