(function() {

    let DB;
    let nombreInput = document.querySelector('#nombre');
    let emailInput = document.querySelector('#email');
    let telefonoInput = document.querySelector('#telefono');
    let empresaInput = document.querySelector('#empresa');

    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();

        // Verificar el ID de la url
        const parametrosURL = new URLSearchParams(window.location.search);
        const idCliente = parametrosURL.get('id');

        if (idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);
        }
    });

    function obtenerCliente(id) {

        const transaction = DB.transaction('clientes', 'readonly');
        const objectStore = transaction.objectStore('clientes');

        const cliente = objectStore.openCursor();

        cliente.onsuccess = function(e) {
            const cursor = e.target.result;
            
            if (cursor) {
                
                if ( cursor.value.id === Number(id) ) {
                    llenarFormulario(cursor.value)
                }
                cursor.continue();
            }
        }

    }

    function llenarFormulario(datosCliente) {

        const { nombre, email, telefono, empresa } = datosCliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;

    }

    function conectarDB() {

        const abrirConexion = window.indexedDB.open('crm-clientes', 1);;
    
        abrirConexion.onerror = function() {
            console.log('Hubo un error');
        }
    
        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
        }
    }

})();