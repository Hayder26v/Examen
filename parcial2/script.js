// URL de la API de The Dog API (cambia `YOUR_API_KEY` por tu clave)
const apiUrl = "https://api.thedogapi.com/v1/breeds";
const apiKey = "live_xRq40I3w6ra0dOB1CRidzIgKMpPYzwe7Aogfdy0ZVgW3RjjZSG6HJtQYhEVF15DC";  // Reemplaza con tu clave API

// Array para almacenar las razas de perros (catalogo)
let catalog = [];

// Array para almacenar las razas únicas (para el filtro)
let breeds = [];

// Mostrar el modal de agregar ítem (si se desea agregar un ítem manualmente)
function showAddItemModal() {
    $('#addItemModal').modal('show');
}

// Cerrar el modal de agregar ítem
function closeAddItemModal() {
    $('#addItemModal').modal('hide');
}

// Agregar ítem al catálogo (función opcional si quieres agregar manualmente)
function addItem() {
    const name = document.getElementById("itemName").value;
    const image = document.getElementById("itemImage").value;

    if (name && image) {
        const newItem = {
            id: catalog.length + 1,
            name: name,
            image: image
        };
        catalog.push(newItem);
        renderCatalog(); // Vuelve a renderizar el catálogo
        closeAddItemModal(); // Cierra el modal
    } else {
        alert("Por favor, completa todos los campos.");
    }
}

// Eliminar ítem del catálogo
function deleteItem(id) {
    catalog = catalog.filter(item => item.id !== id);
    renderCatalog(); // Vuelve a renderizar el catálogo
}

// Ver detalles del ítem
function viewDetails(id) {
    const item = catalog.find(item => item.id === id);
    alert(`Detalles del ítem: \nNombre: ${item.name}\nImagen: ${item.image}`);
}

// Hacer la solicitud a la API para obtener razas de perros
async function fetchDogBreeds() {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                "x-api-key": apiKey
            }
        });
        const data = await response.json();
        catalog = data; // Asignamos las razas de perros al catálogo

        // Obtener un array único de razas para el filtro
        breeds = [...new Set(data.map(item => item.name))];

        // Llenar el dropdown con las razas disponibles
        const breedFilter = document.getElementById("breedFilter");
        breeds.forEach(breed => {
            const option = document.createElement("option");
            option.value = breed;
            option.textContent = breed;
            breedFilter.appendChild(option);
        });

        renderCatalog(); // Renderizamos los perros
    } catch (error) {
        console.error("Error al obtener los datos de la API", error);
    }
}

// Filtrar el catálogo según la raza seleccionada
function filterCatalog() {
    const breedFilter = document.getElementById("breedFilter");
    const selectedBreed = breedFilter.value;

    if (selectedBreed) {
        // Filtrar el catálogo solo con la raza seleccionada
        const filteredCatalog = catalog.filter(item => item.name === selectedBreed);
        renderFilteredCatalog(filteredCatalog);
    } else {
        // Si no hay filtro, mostramos todos los ítems
        renderCatalog();
    }
}

// Renderizar los ítems del catálogo (limitando los resultados a 10)
function renderCatalog() {
    const catalogList = document.getElementById("catalogList");
    catalogList.innerHTML = ""; // Limpiar la lista actual

    // Limitar a 10 elementos
    const limitedCatalog = catalog.slice(0, 10);

    limitedCatalog.forEach(item => {
        const catalogItem = document.createElement("div");
        catalogItem.className = "catalog-item card";
        catalogItem.innerHTML = `
            <img src="${item.image.url}" class="card-img-top" alt="${item.name}">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <button class="btn btn-info" onclick="viewDetails(${item.id})">Ver Detalles</button>
                <button class="btn btn-danger" onclick="deleteItem(${item.id})">Eliminar</button>
            </div>
        `;
        catalogList.appendChild(catalogItem);
    });
}

// Renderizar el catálogo filtrado (limitando los resultados a 10)
function renderFilteredCatalog(filteredCatalog) {
    const catalogList = document.getElementById("catalogList");
    catalogList.innerHTML = ""; // Limpiar la lista actual

    // Limitar a 10 elementos
    const limitedCatalog = filteredCatalog.slice(0, 10);

    limitedCatalog.forEach(item => {
        const catalogItem = document.createElement("div");
        catalogItem.className = "catalog-item card";
        catalogItem.innerHTML = `
            <img src="${item.image.url}" class="card-img-top" alt="${item.name}">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <button class="btn btn-info" onclick="viewDetails(${item.id})">Ver Detalles</button>
                <button class="btn btn-danger" onclick="deleteItem(${item.id})">Eliminar</button>
            </div>
        `;
        catalogList.appendChild(catalogItem);
    });
}

// Iniciar la visualización de los perros cuando se cargue la página
window.onload = function() {
    fetchDogBreeds(); // Obtener razas de perros desde la API
};
