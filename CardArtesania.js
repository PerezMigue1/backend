import React, { useContext } from 'react';
import { Card, Button, Badge, OverlayTrigger, Tooltip, Carousel } from 'react-bootstrap';
import { FaShoppingCart, FaHeart, FaStar, FaShippingFast, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CartContext } from '../Navigation/CartContext';

const CardArtesania = ({ artesania }) => {
    const { agregarAlCarrito } = useContext(CartContext);

    const handleAgregarAlCarrito = () => {
        agregarAlCarrito({
            id: artesania.idProducto,
            nombre: artesania.Nombre,
            precio: artesania.Precio,
            imagen: Array.isArray(artesania.Imagen) ? artesania.Imagen[0] : artesania.Imagen,
            categoria: artesania.categoria
        });
    };

    const renderTooltip = (props) => (
        <Tooltip id="info-tooltip" {...props}>
            <div style={{ textAlign: 'left' }}>
                <p><strong>Materiales:</strong> {artesania.Materiales}</p>
                <p><strong>Dimensiones:</strong> {artesania.Dimensiones}</p>
                <p><strong>Técnica:</strong> {artesania.Técnica}</p>
            </div>
        </Tooltip>
    );

    return (
        <Card className="h-100" style={{
            border: '2px solid #0FA89C',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(154, 30, 71, 0.15)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            backgroundColor: 'white',
        }}>
            {artesania.Disponibilidad === 'En stock' && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: '#0FA89C',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <FaShippingFast style={{ marginRight: '5px' }} />
                    Envío disponible
                </div>
            )}

            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1
            }}>
                <OverlayTrigger placement="left" overlay={renderTooltip}>
                    <Button variant="light" size="sm" style={{
                        padding: '5px',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        border: '1px solid #9A1E47'
                    }}>
                        <FaInfoCircle style={{ color: '#9A1E47' }} />
                    </Button>
                </OverlayTrigger>
            </div>

            <Link to={`/artesanias/${artesania.idProducto}`}>
                {Array.isArray(artesania.Imagen) && artesania.Imagen.length > 1 ? (
                    <Carousel interval={3000} controls={false} indicators={false} pause={false}>
                        {artesania.Imagen.map((img, idx) => (
                            <Carousel.Item key={idx}>
                                <Card.Img
                                    variant="top"
                                    src={img}
                                    style={{
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderBottom: '3px solid #F28B27'
                                    }}
                                    alt={`Imagen ${idx + 1}`}
                                    onError={(e) => {
                                        e.target.src = '/placeholder-product.jpg';
                                    }}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                ) : (
                    <Card.Img
                        variant="top"
                        src={Array.isArray(artesania.Imagen) ? artesania.Imagen[0] : artesania.Imagen}
                        style={{
                            height: '200px',
                            objectFit: 'cover',
                            borderBottom: '3px solid #F28B27'
                        }}
                        alt={artesania.Nombre}
                        onError={(e) => {
                            e.target.src = '/placeholder-product.jpg';
                        }}
                    />
                )}
            </Link>

            <Card.Body className="d-flex flex-column" style={{ backgroundColor: '#FEF8ED' }}>
                <div className="mb-2">
                    <Badge bg="success" style={{ backgroundColor: '#1E8546' }} className="me-2">
                        {artesania.idCategoria}
                    </Badge>
                    <Badge bg="info" style={{ backgroundColor: '#50C2C4' }}>
                        {artesania.Origen}
                    </Badge>
                </div>
                <Card.Title style={{ color: '#9A1E47', minHeight: '48px' }}>
                    <Link to={`/artesanias/${artesania.idProducto}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {artesania.Nombre}
                    </Link>
                </Card.Title>
                <Card.Text className="flex-grow-1" style={{ color: '#555', minHeight: '60px' }}>
                    {artesania.Descripción?.substring(0, 100)}...
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div style={{ color: '#F28B27' }}>
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} color={i < 4 ? '#F28B27' : '#ddd'} />
                        ))}
                    </div>
                    <div>
                        <h5 style={{ color: '#9A1E47', margin: 0 }}>
                            {artesania.Precio !== undefined ? `$${parseFloat(artesania.Precio).toFixed(2)}` : 'N/D'}
                        </h5>
                    </div>
                </div>
                <div className="d-grid gap-2">
                    <Button
                        variant="outline"
                        style={{
                            color: '#9A1E47',
                            borderColor: '#9A1E47'
                        }}
                    >
                        <FaHeart />
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CardArtesania;
