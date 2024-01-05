(function(){

    // Cuando esté listo el HTML
    document.addEventListener('DOMContentLoaded', () => {
        crearDB();
    })
    
    let DB;
    
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

})();
