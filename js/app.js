(function(){

    const listadoClientes = document.querySelector('#listado-clientes')

    // Cuando esté listo el HTML
    document.addEventListener('DOMContentLoaded', () => {
        crearDB();

        if (window.indexedDB.open('crm-clientes', 1)) {
            obtenerClientes();
        }

        listadoClientes.addEventListener('click', eliminarRegistro);
    })
    
    function eliminarRegistro(e) {
        
        if ( e.target.classList.contains('eliminar') ) {
            
            const idEliminar = Number(e.target.dataset.cliente);

            const confirmar = confirm('¿Deseas eliminar este cliente?');
            
            if (confirmar) {
                const transaction = DB.transaction('clientes', 'readwrite');
                const objectStore = transaction.objectStore('clientes');

                objectStore.delete(idEliminar);

                transaction.oncomplete = function() {
                    console.log('Registro eliminado');
                    e.target.parentElement.parentElement.remove();
                }

                transaction.onerror = function() {
                    console.log('Hubo un error');
                }
            }
        }
    }
    
    // Crear la base de datos
    function crearDB() {
    
        // Base de datos creada
        const crearDB = window.indexedDB.open('crm-clientes', 1);;
    
        // Si ocurre un error al crear la DB
        crearDB.onerror = function() {
            console.log('Hubo un error');
        }
    
        // Si todo sale bien, se asigna a la variable DB
        crearDB.onsuccess = function() {
            DB = crearDB.result;
        }
    
        crearDB.onupgradeneeded = function(e) {
            const db = e.target.result;
    
            // Crear la tabla
            const objectStore = db.createObjectStore('clientes', { keyPath: 'id', autoIncrement: true });
    
            // Columnas de la tabla
            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });
    
            console.log('DB Lista');
        }
    
    }

    function obtenerClientes() {

        const abrirConexion = window.indexedDB.open('crm-clientes', 1);

        abrirConexion.onerror = function() {
            console.log('Hubo un error');
        }

        abrirConexion.onsuccess = function() {

            DB = abrirConexion.result;

            const transaction = DB.transaction('clientes');
            const objectStore = transaction.objectStore('clientes');
            
            // Recorrer los registros
            objectStore.openCursor().onsuccess = function(e) {
    
                // Validar que existan registros en la BD para mostrar por pantalla
                const cursor = e.target.result;
    
                if (cursor) {
                    const { nombre, email, telefono, empresa, id  } = cursor.value;
    
                    listadoClientes.innerHTML +=  ` <tr>
                                                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                                            <p class="text-gray-700">${telefono}</p>
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                                            <p class="text-gray-600">${empresa}</p>
                                                        </td>
                                                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                                                        </td>
                                                    </tr>
                    `;

                    cursor.continue();
    
                } else {
                    console.log('No hay más registros...');
                }
            }
        }

    }

})();
