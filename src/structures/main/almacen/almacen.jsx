'use client'

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Image from 'next/image';
import ComponentSubirImg from '@/components/subir-imagen';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [getUrlImage, setGetUrlImage] = useState("https://res.cloudinary.com/dd8snmdx4/image/upload/v1725910428/empleados/pgn6frd1zzwig3ovyrsc.png");
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const fetchProductos = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_INVENTARIO);
    const data = await res.json();
    setProductos(data);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleAddProduct = async () => {
    if (nombre.length < 3 || nombre.length > 50) {
      return Swal.fire('Error', 'El nombre debe tener entre 3 y 50 caracteres', 'error');
    }
    if (!categoria) {
      return Swal.fire('Error', 'Debes seleccionar una categoría', 'error');
    }
    if (cantidad.length === 0 || parseInt(cantidad) > 9999999) {
      return Swal.fire('Error', 'La cantidad debe ser un número de hasta 7 dígitos', 'error');
    }

    const newProduct = {
      nombre,
      categoria,
      cantidad,
      img: getUrlImage || "https://res.cloudinary.com/dd8snmdx4/image/upload/v1725910428/empleados/pgn6frd1zzwig3ovyrsc.png",
    };

    const response = await fetch(process.env.NEXT_PUBLIC_INVENTARIO, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    });

    if (response.ok) {
      Swal.fire('Producto agregado', '', 'success');
      fetchProductos();
      setShowModal(false);
      clearForm();
    } else {
      Swal.fire('Error', 'No se pudo agregar el producto', 'error');
    }
  };

  const handleEditProduct = async () => {
    if (nombre.length < 3 || nombre.length > 50) {
      return Swal.fire('Error', 'El nombre debe tener entre 3 y 50 caracteres', 'error');
    }
    if (!categoria) {
      return Swal.fire('Error', 'Debes seleccionar una categoría', 'error');
    }
    if (cantidad.length === 0 || parseInt(cantidad) > 9999999) {
      return Swal.fire('Error', 'La cantidad debe ser un número de hasta 7 dígitos', 'error');
    }

    const updatedProduct = {
      nombre,
      categoria,
      cantidad,
      img: getUrlImage || currentProduct.img,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_INVENTARIO}/${currentProduct.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    });

    if (response.ok) {
      Swal.fire('Producto actualizado', '', 'success');
      fetchProductos();
      setShowModal(false);
      clearForm();
    } else {
      Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
    }
  };

  const clearForm = () => {
    setNombre('');
    setCategoria('');
    setCantidad('');
    setGetUrlImage("https://res.cloudinary.com/dd8snmdx4/image/upload/v1725910428/empleados/pgn6frd1zzwig3ovyrsc.png");
    setCurrentProduct(null);
    setIsEditing(false);
  };

  const handleDeleteProduct = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
      await fetch(`${process.env.NEXT_PUBLIC_INVENTARIO}/${id}`, {
        method: 'DELETE',
      });
      Swal.fire('Producto eliminado', '', 'success');
      fetchProductos();
    }
  };

  const handleEditClick = (product) => {
    setNombre(product.nombre);
    setCategoria(product.categoria);
    setCantidad(product.cantidad);
    setGetUrlImage(product.img);
    setCurrentProduct(product);
    setIsEditing(true);
    setShowModal(true);
  };

  const filteredProducts = productos.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.cantidad.includes(searchTerm)
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Inventario de Servicios Generales UNC</h1>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out">
          + Añadir Producto
        </button>
      </div>

      <div className="relative flex justify-center my-4 mb-10">
        <div className="flex">
          <input
            type="text"
            placeholder="Buscar producto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xl px-4 py-2 border-2 border-gray-500 rounded-l-lg focus:outline-none focus:border-indigo-500 bg-gray-800 text-white placeholder-gray-400 h-12"
          />
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-600 transition duration-300 ease-in-out h-12 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19a8 8 0 100-16 8 8 0 000 16z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>

      <br />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 ease-in-out ">
            <div className="mb-4">
              <h3 className="text-xl font-semibold mt-4 text-center">{product.nombre}</h3>
              <div className="flex justify-center items-center">
                <Image
                  src={product.img}
                  alt={product.nombre}
                  width={200} // Tamaño reducido de ancho
                  height={200} // Tamaño reducido de alto
                  className="rounded-md object-cover"
                  style={{ aspectRatio: '1 / 1' }}
                />
              </div>



              <p className="text-gray-600">{product.categoria}</p>
              <p className="text-gray-600">Cantidad: {product.cantidad}</p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleEditClick(product)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
                Editar
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 w-full max-w-lg space-y-6 h-auto max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold text-center">{isEditing ? 'Editar Producto' : 'Añadir Producto'}</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500">
                <option value="">Selecciona una categoría</option>
                <option value="Gasfiteria">Gasfiteria</option>
                <option value="Electricidad">Electricidad</option>
                <option value="Carpinteria">Carpinteria</option>
                <option value="Mecanica fina">Mecanica fina</option>
                <option value="Albañilería">Albañilería</option>
              </select>

              <input
                type="number"
                placeholder="Cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-500 rounded-lg focus:outline-none focus:border-indigo-500"
              />

              <ComponentSubirImg
                setGetUrlImage={setGetUrlImage}
                getUrlImage={getUrlImage}
              />

              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={isEditing ? handleEditProduct : handleAddProduct}
                  className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition duration-300 ease-in-out">
                  {isEditing ? 'Actualizar' : 'Agregar'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); clearForm(); }}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default Inventario;




/*

Crea una interfaz bonita con los estilos tailwind CSS que cumpla con las siguientes instrucciones : 

1. Comenzará con un titulo con letra grande y llamativo que dira "Inventario de servios generales UNC", ten en cuenta la caligrafia que este bien escrito.

2. Luego del titulo que se menciono anteriormente mas abajo tendra un boton que diga añadir producto, este al dar click se abrira un modal que es resposive tanto para pc como para movil, se llenarán los siguientes campos : 
 - nombre
 - categoria
 - cantidad
 - img (Para este usa el siguiente componente  <ComponentSubirImg setGetUrlImage={setGetUrlImage} getUrlImage={getUrlImage} />, lo importas de la siguiente manera "import ComponentSubirImg from '@/components/subir-imagen';" el cual ese campo ese campo tiene que ser manejado por un usesate). Para esto usa Image que es usando por Next.js
 Debe tener boton de agregar y cancelar, que salga una advertencia diciendo producto creado con exito. La imagen debe inicar con esta imagen por defecto "https://res.cloudinary.com/dd8snmdx4/image/upload/v1725910428/empleados/pgn6frd1zzwig3ovyrsc.png" Si es que no se agrega ninguna imagen igualemente se debera crear el producto con esa imagen. La iamgen deberá ser cuadrada.
 
 ¡Todos esos campos tendrán condiciones estrictas para poder enviar los datos caso contrario no se enviaran los datos, utiliza para eso "import Swal from 'sweetalert2'"

 -Todos esos datos se guardarán en una variable de entorno .env el cual es el siguiente : NEXT_PUBLIC_INVENTARIO= 'https://66ca95fa59f4350f064f7413.mockapi.io/inventario', esa api por medio de una función fetch con el método POST se subirán los datos.

 condiciones para los campos
  - nombre : tiene que tener minimo 3 letras, pero no mas de 50 letras
 - categoria: tiene que ser select, que aparesca las lista desplegable con : Gasfiteria, Electricidad, Soldadura, Carpinteria, Mecanica fina, Albañilería
 - cantidad; solo debe permitir ingresar número, pero que no permita ingresar un número de mas de 7 digitos

 Luego de enviar los datos el modal se tiene que cerrar solo.

 3. Luego del boton para agregar productos que mencione anteriormente, mas abajo debe aparecer un buscador con estilos bonitos, debe ser un input (placeholder: 'Buscar producto') con un icono a su lado que se vea muy elegante. que cumpla las siguientes funciones:

- Que al no escribir nada en el buscador se vea una lista de cards con función map y en cada card se vea la foto del prodcuto, el nombre, categoria y cantidad. Asimimo tendra iconos el cual a dar click editarán y eliminarán , todo ese card tiene que estar responsive. 

 - El eliminar, y editar teine que ser por id, utiliza de igual manera la varaible de entorno que tiene un link de acceso a su api el cual es " NEXT_PUBLIC_INVENTARIO= 'https://66ca95fa59f4350f064f7413.mockapi.io/inventario'"

 - En eL buscador se podra mostrar un producto con tal solo escribri un letra de su nombre, saldran todos los productos relacionados, por los siguientes campos, nombre, categoria, cantidad. El buscador no olvidar que tendra a su lado una lupita que será extraido de. El buscador tendta estilos algo asi :  "    <input
          type="text"
          placeholder="Ingrese nombre, DNI, cargo o permiso"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full max-w-lg px-4 py-2 border-2 border-gray-500 rounded-l-lg focus:outline-none focus:border-indigo-500 bg-gray-800 text-white placeholder-gray-400 h-12"
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-600 transition duration-300 ease-in-out h-12 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19a8 8 0 100-16 8 8 0 000 16z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35" />
          </svg>
        </button>
      </form>"

 - En editar que mencione anteriormente, y eliminar lo harás con funciones fetch., el eliminar tiene que tener una opción que diga estas seguro de eliminar producto.

 El editar debe abrir el mismo modal que mencione anteriormente con el unico cambio que ahora no dirá crear producto, si no el formulario modal dira editar producto, donde este dormulario estará lleno con los campos por el card que se selcciono, y en lugar de tener un boton que diga crear producto diga guardar cambios y se cierre el modal al finalizar

- oJO algo muy importante, cada cambio que se haga tiene que actualizarse los datos, puedes usar useeefect para eso. Osea cada cambio que se haga se debe ver automaticamente en la lsita de cards. 


*/