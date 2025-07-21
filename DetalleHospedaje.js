import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge, ListGroup, Spinner, Carousel } from 'react-bootstrap';
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaBed, FaMoneyBillWave } from 'react-icons/fa';
import axios from 'axios';

const DetalleHospedaje = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hospedaje, setHospedaje] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHospedaje = async () => {
            try {
                const response = await axios.get(`https://backend-iota-seven-19.vercel.app/api/hospedaje/${id}`);
                setHospedaje(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchHospedaje();
    }, [id]);

    if (loading) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Alert variant="danger">
                    Error al cargar el hospedaje: {error}
                    <Button variant="link" onClick={() => window.location.reload()}>Intentar de nuevo</Button>
                </Alert>
            </Container>
        );
    }

    if (!hospedaje) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Alert variant="warning">
                    Hospedaje no encontrado
                    <Button variant="link" onClick={() => navigate('/hospedajes')}>Volver al catálogo</Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh' }}>
            <Button
                variant="link"
                onClick={() => navigate(-1)}
                style={{ color: '#9A1E47', textDecoration: 'none', marginBottom: '20px' }}
            >
                <FaArrowLeft /> Volver al catálogo
            </Button>

            <Row>
                <Col md={7}>
                    <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
                        {Array.isArray(hospedaje.Imagenes) ? (
                            <Carousel interval={3000} pause={false} indicators controls>
                                {hospedaje.Imagenes.map((img, i) => (
                                    <Carousel.Item key={i}>
                                        <img
                                            src={img}
                                            alt={`Imagen ${i + 1}`}
                                            className="d-block w-100"
                                            style={{ objectFit: 'cover', height: '500px' }}
                                            onError={(e) => e.target.src = '/placeholder-hotel.jpg'}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        ) : (
                            <Card.Img
                                variant="top"
                                src={hospedaje.Imagenes}
                                alt={hospedaje.Nombre}
                                style={{ maxHeight: '500px', objectFit: 'cover', borderBottom: '3px solid #F28B27' }}
                                onError={(e) => e.target.src = '/placeholder-hotel.jpg'}
                            />
                        )}
                    </Card>

                    <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Descripción</h4>
                            <p style={{ color: '#555' }}>{hospedaje.Servicios || 'No hay descripción disponible.'}</p>
                            <ListGroup variant="flush">
                                <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                    <strong>Ubicación:</strong> {hospedaje.Ubicacion || 'No especificado'}
                                </ListGroup.Item>
                                <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                    <strong>Horario:</strong> {hospedaje.Horario || 'No especificado'}
                                </ListGroup.Item>
                                <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                    <strong>Teléfono:</strong> {hospedaje.Telefono || 'No especificado'}
                                </ListGroup.Item>
                                <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                    <strong>Huéspedes:</strong> {hospedaje.Huespedes || 'No especificado'}
                                </ListGroup.Item>
                                <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                    <strong>Precio:</strong> {hospedaje.Precio !== undefined ? `$${parseFloat(hospedaje.Precio).toFixed(2)}` : 'No especificado'}
                                </ListGroup.Item>
                                <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                    <strong>Categoría:</strong> {hospedaje.Categoria || 'No especificado'}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={5}>
                    <Card className="sticky-top" style={{ top: '20px', borderColor: '#0FA89C' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <h3 style={{ color: '#9A1E47' }}>{hospedaje.Nombre}</h3>
                            <div className="d-flex align-items-center mb-3">
                                <Badge style={{ backgroundColor: '#1E8546', marginRight: '10px' }}>{hospedaje.Categoria}</Badge>
                                <div style={{ color: '#F28B27' }}>
                                    <FaBed /> {hospedaje.Huespedes || 'N/D'} huéspedes
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3" style={{ color: '#0FA89C' }}>
                                <FaMapMarkerAlt className="me-2" />
                                <span>{hospedaje.Ubicacion || 'Ubicación no especificada'}</span>
                            </div>
                            <div className="d-flex align-items-baseline mb-3">
                                <h2 style={{ color: '#9A1E47', marginRight: '15px' }}>{hospedaje.Precio !== undefined ? `$${parseFloat(hospedaje.Precio).toFixed(2)}` : 'N/D'}</h2>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DetalleHospedaje; 