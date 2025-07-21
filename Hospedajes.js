import React, { useState, useEffect } from 'react';
import ListaHospedajes from './ListaHospedajes';
import axios from 'axios';

const Hospedajes = () => {
    const [hospedajes, setHospedajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroOrden, setFiltroOrden] = useState('');
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hospedajesRes = await axios.get('https://backend-iota-seven-19.vercel.app/api/hospedaje');
                setHospedajes(hospedajesRes.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filtrar por búsqueda
    let hospedajesFiltrados = hospedajes.filter(h => {
        const texto = `${h.Nombre} ${h.Ubicacion} ${h.Categoria}`.toLowerCase();
        return texto.includes(busqueda.toLowerCase());
    });

    // Ordenar
    if (filtroOrden === 'categoria') {
        hospedajesFiltrados = hospedajesFiltrados.sort((a, b) => (a.Categoria || '').localeCompare(b.Categoria || ''));
    } else if (filtroOrden === 'precio') {
        hospedajesFiltrados = hospedajesFiltrados.sort((a, b) => (a.Precio || 0) - (b.Precio || 0));
    } else if (filtroOrden === 'ubicacion') {
        hospedajesFiltrados = hospedajesFiltrados.sort((a, b) => (a.Ubicacion || '').localeCompare(b.Ubicacion || ''));
    }

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
                Error al cargar los hospedajes: {error}
            </div>
        </div>
    );

    return (
        <div style={{
            backgroundColor: '#FDF2E0',
            minHeight: '100vh',
            padding: '20px 0',
        }}>
            <ListaHospedajes
                hospedajes={hospedajesFiltrados}
                filtroOrden={filtroOrden}
                setFiltroOrden={setFiltroOrden}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
            />
        </div>
    );
};

export default Hospedajes; 