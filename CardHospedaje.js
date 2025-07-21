import React from 'react';
import { Card, Button, Badge, OverlayTrigger, Tooltip, Carousel } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaBed, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CardHospedaje = ({ hospedaje }) => {
    const renderTooltip = (props) => (
        <Tooltip id="info-tooltip" {...props}>
            <div style={{ textAlign: 'left' }}>
                <p><strong>Servicios:</strong> {hospedaje.Servicios}</p>
                <p><strong>Horario:</strong> {hospedaje.Horario}</p>
                <p><strong>Teléfono:</strong> {hospedaje.Telefono}</p>
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

            <Link to={`/hospedajes/${hospedaje.idHotel}`}>
                {Array.isArray(hospedaje.Imagenes) && hospedaje.Imagenes.length > 1 ? (
                    <Carousel interval={3000} controls={false} indicators={false} pause={false}>
                        {hospedaje.Imagenes.map((img, idx) => (
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
                                        e.target.src = '/placeholder-hotel.jpg';
                                    }}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                ) : (
                    <Card.Img
                        variant="top"
                        src={Array.isArray(hospedaje.Imagenes) ? hospedaje.Imagenes[0] : hospedaje.Imagenes}
                        style={{
                            height: '200px',
                            objectFit: 'cover',
                            borderBottom: '3px solid #F28B27'
                        }}
                        alt={hospedaje.Nombre}
                        onError={(e) => {
                            e.target.src = '/placeholder-hotel.jpg';
                        }}
                    />
                )}
            </Link>

            <Card.Body className="d-flex flex-column" style={{ backgroundColor: '#FEF8ED' }}>
                <div className="mb-2">
                    <Badge bg="success" style={{ backgroundColor: '#1E8546' }} className="me-2">
                        {hospedaje.Categoria}
                    </Badge>
                    <Badge bg="info" style={{ backgroundColor: '#50C2C4' }}>
                        <FaMapMarkerAlt /> {hospedaje.Ubicacion}
                    </Badge>
                </div>
                <Card.Title style={{ color: '#9A1E47', minHeight: '48px' }}>
                    <Link to={`/hospedajes/${hospedaje.idHotel}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {hospedaje.Nombre}
                    </Link>
                </Card.Title>
                <Card.Text className="flex-grow-1" style={{ color: '#555', minHeight: '60px' }}>
                    {hospedaje.Servicios?.substring(0, 100)}...
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div style={{ color: '#F28B27' }}>
                        <FaBed /> {hospedaje.Huespedes || 'N/D'} huéspedes
                    </div>
                    <div>
                        <h5 style={{ color: '#9A1E47', margin: 0 }}>
                            {hospedaje.Precio !== undefined ? `$${parseFloat(hospedaje.Precio).toFixed(2)}` : 'N/D'}
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
                        as={Link}
                        to={`/hospedajes/${hospedaje.idHotel}`}
                    >
                        Ver detalles
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CardHospedaje; 