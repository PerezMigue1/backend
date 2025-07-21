// src/screens/Artesanias.js
import React, { useState, useEffect } from 'react';
import ListaArtesanias from '../components/ListaArtesanias';
import axios from 'axios';

const Artesanias = () => {
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [artesanos, setArtesanos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener productos y categorías en paralelo
                const [productosRes, categoriasRes, artesanosRes] = await Promise.all([
                    axios.get('https://backend-iota-seven-19.vercel.app/api/productos'),
                    axios.get('https://backend-iota-seven-19.vercel.app/api/categoriaProducto'),
                    axios.get('https://backend-iota-seven-19.vercel.app/api/artesano')
                ]);

                setProductos(productosRes.data);
                setCategorias(categoriasRes.data);
                setArtesanos(artesanosRes.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Mapear los datos de la API al formato esperado
    const artesanias = productos.map(producto => {
    const categoria = categorias.find(cat => cat.idCategoria === producto.idCategoria);
    const artesano = artesanos.find(a => a.idArtesano === producto.idArtesano);


    return {
        idProducto: producto.idProducto,
        Nombre: producto.Nombre,
        Descripción: producto.Descripción,
        Precio: producto.Precio,
        Imagen: producto.Imagen,
        idCategoria: producto.idCategoria,
        categoria: categoria ? categoria.Nombre : producto.idCategoria,
        Origen: producto.Origen,
        envio: producto.Disponibilidad === 'En stock',
        valoracion: 4,
        Forma: producto.Forma,
        Dimensiones: producto.Dimensiones,
        Materiales: producto.Materiales,
        Técnica: producto.Técnica,
        Especificaciones: producto.Especificaciones,
        Colores: producto.Colores,
        Disponibilidad: producto.Disponibilidad,
        Comentarios: producto.Comentarios,
        Artesano: artesano || {}
    };
});


    const artesaniasFiltradas = categoriaFiltro
        ? artesanias.filter(artesania => artesania.idCategoria === categoriaFiltro)
        : artesanias;

    if (loading) return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#FDF2E0'
        }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    if (error) return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#FDF2E0',
            color: '#9A1E47'
        }}>
            <div className="alert alert-danger" role="alert">
                Error al cargar los productos: {error}
            </div>
        </div>
    );

    return (
        <div style={{
            backgroundColor: '#FDF2E0',
            minHeight: '100vh',
            padding: '20px 0',
        }}>
            <ListaArtesanias
                artesanias={artesaniasFiltradas}
                categorias={categorias}
                categoriaFiltro={categoriaFiltro}
                setCategoriaFiltro={setCategoriaFiltro}
            />
        </div>
    );
};

export default Artesanias;