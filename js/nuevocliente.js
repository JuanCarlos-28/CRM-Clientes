let DB;
(function(){
    
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', validarCliente)
    })

    function validarCliente(e) {
        e.preventDefault();

        // Leer los inputs
        const nombre = document.querySelector('#nombre').value.trim();
        const email = document.querySelector('#email').value.trim();
        const telefono = document.querySelector('#telefono').value.trim();
        const empresa = document.querySelector('#empresa').value.trim();

        if ( nombre === '' || email === '' || telefono === '' || empresa === '' ) {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        if ( !validarEmail(email) ) {
            imprimirAlerta('Correo no valido', 'error');
            return;
        }

        if ( !validarTelefono(telefono) ) {
            imprimirAlerta('Telefono no valido', 'error');
            return;
        }

        // Crear un objeto
        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id: Date.now(),
        }

        crearNuevoCliente(cliente);

    }

    function validarEmail(email) {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        const resultado = regex.test(email);
        return resultado;
    };

    function validarTelefono(telefono) {
        const regex = /^(?:\+\d{1,3}\s?)?\d{6,14}$/;
        const resultado = regex.test(telefono);
        return resultado;
    };

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['clientes'], 'readwrite');
        const objectStore = transaction.objectStore('clientes');

        objectStore.add(cliente);

        transaction.onerror = function() {
            imprimirAlerta('Hubo un error', 'error')
        }

        transaction.oncomplete = function() {
            imprimirAlerta('El cliente se ha agregado exitosamente', 'success');

            setTimeout(() => {
                location.href = '../index.html'
            }, 2000);
        }
    }

})();