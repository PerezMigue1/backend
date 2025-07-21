
// src/screens/DetalleArtesania.js

import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge, ListGroup, Form, Spinner, Tab, Tabs, Carousel } from 'react-bootstrap';
import { FaShoppingCart, FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaStar, FaTruck, FaCalendarAlt, FaTags } from 'react-icons/fa';
import axios from 'axios';
import { CartContext } from '../Navigation/CartContext';

const DetalleArtesania = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [artesania, setArtesania] = useState(null);
    const [artesano, setArtesano] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductoYArtesano = async () => {
            try {
                const response = await axios.get(`https://backend-iota-seven-19.vercel.app/api/productos/${id}`);
                const producto = response.data;
                setArtesania(producto);

                // Cargar datos del artesano asociado
                const resArtesano = await axios.get(`https://backend-iota-seven-19.vercel.app/api/artesano/${producto.idArtesano}`);
                setArtesano(resArtesano.data);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProductoYArtesano();
    }, [id]);

    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [comentario, setComentario] = useState('');
    const [mensajeEnviado, setMensajeEnviado] = useState(null);

    const handleEnviarComentario = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://backend-iota-seven-19.vercel.app/api/contacto", {
                nombre,
                correo,
                telefono,
                comentario,
                idProducto: artesania.idProducto,
                idArtesano: artesano?.idArtesano
            });

            setMensajeEnviado("Comentario enviado correctamente.");
            setNombre('');
            setCorreo('');
            setTelefono('');
            setComentario('');
        } catch (error) {
            setMensajeEnviado("Error al enviar el comentario.");
            console.error(error);
        }
    };


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
                    Error al cargar el producto: {error}
                    <Button variant="link" onClick={() => window.location.reload()}>Intentar de nuevo</Button>
                </Alert>
            </Container>
        );
    }

    if (!artesania) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Alert variant="warning">
                    Producto no encontrado
                    <Button variant="link" onClick={() => navigate('/artesanias')}>Volver al catálogo</Button>
                </Alert>
            </Container>
        );
    }

    if (showSuccess) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh' }}>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Alert variant="success" style={{ backgroundColor: '#1E8546', color: 'white', textAlign: 'center' }}>
                            <h4>¡Compra realizada con éxito!</h4>
                            <p>El producto ha sido agregado a tu carrito.</p>
                            <div className="d-flex justify-content-center gap-3 mt-3">
                                <Button variant="light" style={{ color: '#1E8546' }} onClick={() => navigate('/carrito')}>
                                    Ver carrito
                                </Button>
                                <Button variant="outline-light" onClick={() => navigate('/artesanias')}>
                                    Seguir comprando
                                </Button>
                            </div>
                        </Alert>
                    </Col>
                </Row>
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
                        {Array.isArray(artesania.Imagen) ? (
                            <Carousel interval={3000} pause={false} indicators controls>
                                {artesania.Imagen.map((img, i) => (
                                    <Carousel.Item key={i}>
                                        <img
                                            src={img}
                                            alt={`Imagen ${i + 1}`}
                                            className="d-block w-100"
                                            style={{ objectFit: 'cover', height: '500px' }}
                                            onError={(e) => e.target.src = '/placeholder-product.jpg'}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        ) : (
                            <Card.Img
                                variant="top"
                                src={artesania.Imagen}
                                alt={artesania.Nombre}
                                style={{ maxHeight: '500px', objectFit: 'cover', borderBottom: '3px solid #F28B27' }}
                                onError={(e) => e.target.src = '/placeholder-product.jpg'}
                            />
                        )}
                    </Card>

                    <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <Tabs defaultActiveKey="descripcion" id="product-tabs" className="mb-3">
                                <Tab eventKey="descripcion" title="Descripción">
                                    <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Descripción del producto</h4>
                                    <p style={{ color: '#555' }}>{artesania.Descripción}</p>

                                    <h4 style={{ color: '#9A1E47', marginTop: '20px' }}>Comentarios adicionales</h4>
                                    <p style={{ color: '#555' }}>{artesania.Comentarios || 'No hay comentarios adicionales'}</p>
                                </Tab>

                                <Tab eventKey="especificaciones" title="Especificaciones">
                                    <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Detalles técnicos</h4>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Colores:</strong> {artesania.Colores || 'No especificado'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Dimensiones:</strong> {artesania.Dimensiones || 'No especificado'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Especificaciones:</strong> {artesania.Especificaciones || 'No especificado'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Materiales:</strong> {artesania.Materiales || 'No especificado'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Técnica de elaboración:</strong> {artesania.Técnica || 'No especificado'}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Tab>

                                <Tab eventKey="envio" title="Envío y disponibilidad">
                                    <div className="d-flex align-items-center mb-3" style={{ color: '#0FA89C' }}>
                                        <FaTruck className="me-2" size={20} />
                                        <h5 style={{ margin: 0 }}>Disponibilidad:
                                            <Badge bg={artesania.Disponibilidad === 'En stock' ? 'success' : 'danger'} className="ms-2">
                                                {artesania.Disponibilidad}
                                            </Badge>
                                        </h5>
                                    </div>

                                    <div className="d-flex align-items-center" style={{ color: '#0FA89C' }}>
                                        <FaTags className="me-2" size={20} />
                                        <div>
                                            <h5 style={{ margin: 0 }}>Etiquetas:</h5>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                                                {artesania.Etiquetas?.split(', ').map((tag, index) => (
                                                    <Badge key={index} bg="info" style={{ backgroundColor: '#50C2C4' }}>
                                                        {tag.trim()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={5}>
                    <Card className="sticky-top" style={{ top: '20px', borderColor: '#0FA89C' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <h3 style={{ color: '#9A1E47' }}>{artesania.Nombre}</h3>
                            <div className="d-flex align-items-center mb-3">
                                <Badge style={{ backgroundColor: '#1E8546', marginRight: '10px' }}>{artesania.idCategoria}</Badge>
                                <div style={{ color: '#F28B27' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color={i < 4 ? '#F28B27' : '#ddd'} />
                                    ))}
                                    <small style={{ color: '#A0C070', marginLeft: '5px' }}>(15 reseñas)</small>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3" style={{ color: '#0FA89C' }}>
                                <FaMapMarkerAlt className="me-2" />
                                <span>Elaborado en {artesania.Origen || 'origen no especificado'}</span>
                            </div>
                            <div className="d-flex align-items-baseline mb-3">
                                <h2 style={{ color: '#9A1E47', marginRight: '15px' }}>${artesania.Precio.toFixed(2)}</h2>
                            </div>

                            {/* 🔽 Contacto del Artesano (completo) */}
                            <div style={{
                                backgroundColor: '#FEF8ED',
                                border: '1px solid #F28B27',
                                borderRadius: '10px',
                                padding: '15px',
                                marginTop: '20px'
                            }}>
                                <h5 style={{ color: '#9A1E47', marginBottom: '15px' }}>Contacto del Artesano</h5>

                                {/* Imagen de perfil */}
                                {artesano?.imagenPerfil && (
                                    <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                        <img src={artesano.imagenPerfil} alt="Foto del artesano" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
                                    </div>
                                )}

                                <p><strong>Nombre:</strong> {artesano?.nombre || 'N/D'}</p>
                                <p><strong>Especialidad:</strong> {artesano?.especialidad || 'N/D'}</p>
                                <p><strong>Teléfono:</strong> {artesano?.telefono || 'N/D'}</p>
                                <p><strong>Email:</strong> {artesano?.correo || 'N/D'}</p>
                                <p><strong>Ubicación:</strong> {artesano?.ubicacion || 'N/D'}</p>

                                <p><strong>Descripción:</strong><br />{artesano?.descripcion || 'N/D'}</p>

                                {/* Redes sociales */}
                                <div style={{ marginTop: '10px' }}>
                                    <p><strong>Redes Sociales:</strong></p>
                                    <ul style={{ paddingLeft: '1rem', marginBottom: 0 }}>
                                        {artesano?.redesSociales?.facebook && (
                                            <li>
                                                <a href={artesano.redesSociales.facebook} target="_blank" rel="noopener noreferrer">
                                                    Facebook
                                                </a>
                                            </li>
                                        )}
                                        {artesano?.redesSociales?.instagram && (
                                            <li>
                                                <a href={artesano.redesSociales.instagram} target="_blank" rel="noopener noreferrer">
                                                    Instagram
                                                </a>
                                            </li>
                                        )}
                                        {artesano?.redesSociales?.whatsapp && (
                                            <li>
                                                <a href={artesano.redesSociales.whatsapp} target="_blank" rel="noopener noreferrer">
                                                    WhatsApp
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>


                        </Card.Body>
                    </Card>

                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={15}>
                    <Card className="sticky-top" style={{ top: '20px', borderColor: '#0FA89C', marginTop: '50px' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <h4 style={{ color: '#9A1E47', marginBottom: '20px' }}>¿Tienes dudas o deseas contactar al artesano?</h4>

                            {mensajeEnviado && (
                                <Alert variant={mensajeEnviado.includes("Error") ? "danger" : "success"}>
                                    {mensajeEnviado}
                                </Alert>
                            )}

                            <Form onSubmit={handleEnviarComentario}>
                                <Form.Group controlId="formNombre" className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tu nombre"
                                        required
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formCorreo" className="mb-3">
                                    <Form.Label>Correo electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="tu@email.com"
                                        required
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formTelefono" className="mb-3">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Opcional"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formComentario" className="mb-3">
                                    <Form.Label>Comentario</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="Escribe tu mensaje..."
                                        required
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                    />
                                </Form.Group>

                                <Button type="submit" variant="primary" style={{ backgroundColor: '#9A1E47', borderColor: '#9A1E47' }}>
                                    Enviar mensaje al artesano
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>


    );
};

export default DetalleArtesania;

