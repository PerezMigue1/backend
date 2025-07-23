import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card, Badge } from 'react-bootstrap';
import axios from 'axios';

const PublicarHospedaje = () => {
    const [formData, setFormData] = useState({
        Nombre: '',
        Precio: '',
        Descripcion: '',
        Ubicacion: '',
        Horario: '',
        Telefono: '',
        Huespedes: '',
        Servicios: '',
        Categoria: '',
        Imagenes: [],
        lat: '',
        lng: ''
    });

    const [mensaje, setMensaje] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [idHospedero, setIdHospedero] = useState(null);
    const [datosHospedero, setDatosHospedero] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    const idUsuario = user?._id || user?.idUsuario;

    useEffect(() => {
        const obtenerHospedero = async () => {
            if (!idUsuario) return;
            try {
                const res = await axios.get(`http://localhost:5000/api/contactoHospedero/por-usuario/${idUsuario}`);
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setIdHospedero(res.data[0].idHospedero);
                    setDatosHospedero(res.data[0]);
                } else if (res.data.idHospedero) {
                    setIdHospedero(res.data.idHospedero);
                    setDatosHospedero(res.data);
                } else {
                    setIdHospedero(null);
                }
            } catch (error) {
                setIdHospedero(null);
            }
        };
        obtenerHospedero();
    }, [idUsuario]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'Imagenes') {
            setFormData({ ...formData, Imagenes: files });
            if (files && files.length > 0) {
                const previews = Array.from(files).map(file => URL.createObjectURL(file));
                setImagePreviews(previews);
            } else {
                setImagePreviews([]);
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        const newFiles = Array.from(formData.Imagenes).filter((_, index) => index !== indexToRemove);
        const newPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
        setFormData({ ...formData, Imagenes: newFiles });
        setImagePreviews(newPreviews);
        URL.revokeObjectURL(imagePreviews[indexToRemove]);
    };

    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (!token || !idUsuario || !idHospedero) {
            setMensaje('⚠️ Debes estar registrado como hospedero para publicar un hospedaje.');
            setIsSubmitting(false);
            return;
        }
        const data = new FormData();
        data.append('idUsuario', idUsuario);
        data.append('idHospedero', idHospedero);
        data.append('Nombre', formData.Nombre);
        data.append('Precio', formData.Precio);
        data.append('Descripcion', formData.Descripcion);
        data.append('Ubicacion', formData.Ubicacion);
        data.append('Horario', formData.Horario);
        data.append('Telefono', formData.Telefono);
        data.append('Huespedes', formData.Huespedes);
        data.append('Servicios', formData.Servicios);
        data.append('Categoria', formData.Categoria);
        data.append('Coordenadas.lat', formData.lat);
        data.append('Coordenadas.lng', formData.lng);
        if (formData.Imagenes && formData.Imagenes.length > 0) {
            for (let i = 0; i < formData.Imagenes.length; i++) {
                data.append('Imagenes', formData.Imagenes[i]);
            }
        }
        data.append('estadoRevision', 'pendiente');
        data.append('fechaSolicitud', new Date().toISOString());
        try {
            await axios.post('http://localhost:5000/api/publicaHospedaje', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setMensaje('✅ Hospedaje enviado para revisión');
            setFormData({
                Nombre: '', Precio: '', Descripcion: '', Ubicacion: '', Horario: '', Telefono: '', Huespedes: '', Servicios: '', Categoria: '', Imagenes: [], lat: '', lng: ''
            });
            setImagePreviews([]);
        } catch (error) {
            setMensaje('❌ Hubo un error al enviar tu hospedaje');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container fluid className="py-5" style={{
            background: 'linear-gradient(135deg, #FDF2E0 0%, #F8E8D0 100%)',
            minHeight: '100vh'
        }}>
            <Container>
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold" style={{ color: '#9A1E47' }}>
                        🏨 Publicar Hospedaje
                    </h1>
                    <p className="lead text-muted">
                        Comparte tu espacio con el mundo
                    </p>
                </div>

                {mensaje && (
                    <Alert 
                        variant={mensaje.startsWith('✅') ? 'success' : 'danger'}
                        className="border-0 shadow-sm"
                        style={{ borderRadius: '15px' }}
                    >
                        <div className="d-flex align-items-center">
                            <span className="me-2">
                                {mensaje.startsWith('✅') ? '✅' : '❌'}
                            </span>
                            {mensaje}
                        </div>
                    </Alert>
                )}

                {!idHospedero && (
                    <Alert variant="warning" className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center">
                            <span className="me-2">⚠️</span>
                            <div>
                                <strong>Registro requerido:</strong> Debes completar tu 
                                <a href="/RegistroHospedero" className="text-decoration-none ms-1">
                                    registro como hospedero
                                </a> para publicar hospedajes.
                            </div>
                        </div>
                    </Alert>
                )}

                {idHospedero && datosHospedero && (
                    <Alert variant="info" className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center">
                            <span className="me-2">👤</span>
                            <div>
                                <strong>Publicando como:</strong> {datosHospedero.nombre}
                                <Badge bg="secondary" className="ms-2">{datosHospedero.especialidad}</Badge>
                            </div>
                        </div>
                    </Alert>
                )}

                <Card className="border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    <Card.Body className="p-5">
                        <Form onSubmit={handleSubmit}>
                            {/* Información Básica */}
                            <div className="mb-5">
                                <h4 className="mb-4" style={{ color: '#9A1E47' }}>
                                    📋 Información Básica
                                </h4>
                                <Row>
                                    <Col lg={8} md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">
                                                🏨 Nombre del hospedaje <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control 
                                                name="Nombre" 
                                                value={formData.Nombre} 
                                                onChange={handleChange} 
                                                required 
                                                placeholder="Ej: Hotel Paraíso Huasteco"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={4} md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">
                                                💰 Precio por noche <span className="text-danger">*</span>
                                            </Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text border-0 bg-light">$</span>
                                                <Form.Control 
                                                    type="number" 
                                                    name="Precio" 
                                                    value={formData.Precio} 
                                                    onChange={handleChange} 
                                                    required 
                                                    placeholder="0.00"
                                                    className="border-0 shadow-sm"
                                                    style={{ borderRadius: '0 10px 10px 0', padding: '12px' }}
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">
                                        📝 Descripción <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={4} 
                                        name="Descripcion" 
                                        value={formData.Descripcion} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="Describe tu hospedaje, servicios, ubicación, etc..."
                                        className="border-0 shadow-sm"
                                        style={{ borderRadius: '10px', padding: '12px' }}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">
                                        📍 Ubicación <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control 
                                        name="Ubicacion" 
                                        value={formData.Ubicacion} 
                                        onChange={handleChange}
                                        required
                                        placeholder="Ej: Ciudad, Estado, País"
                                        className="border-0 shadow-sm"
                                        style={{ borderRadius: '10px', padding: '12px' }}
                                    />
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">⏰ Horario</Form.Label>
                                            <Form.Control 
                                                name="Horario" 
                                                value={formData.Horario} 
                                                onChange={handleChange}
                                                placeholder="Ej: 24 horas, 8am-10pm"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">📞 Teléfono</Form.Label>
                                            <Form.Control 
                                                name="Telefono" 
                                                value={formData.Telefono} 
                                                onChange={handleChange}
                                                placeholder="Ej: +52 55 1234 5678"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">👥 Capacidad (Huéspedes)</Form.Label>
                                            <Form.Control 
                                                name="Huespedes" 
                                                value={formData.Huespedes} 
                                                onChange={handleChange}
                                                placeholder="Ej: 2, 4, 10"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">🛎️ Servicios</Form.Label>
                                            <Form.Control 
                                                name="Servicios" 
                                                value={formData.Servicios} 
                                                onChange={handleChange}
                                                placeholder="Ej: Wi-Fi, Estacionamiento, Restaurante, Aire acondicionado"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">🏷️ Categoría</Form.Label>
                                            <Form.Select 
                                                name="Categoria" 
                                                value={formData.Categoria} 
                                                onChange={handleChange}
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            >
                                                <option value="">Seleccione una categoría</option>
                                                <option value="Economico">Económico</option>
                                                <option value="Estandar">Estándar</option>
                                                <option value="Premium">Premium</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">🌐 Latitud</Form.Label>
                                            <Form.Control 
                                                name="lat" 
                                                value={formData.lat} 
                                                onChange={handleChange}
                                                placeholder="Ej: 21.123456"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">🌐 Longitud</Form.Label>
                                            <Form.Control 
                                                name="lng" 
                                                value={formData.lng} 
                                                onChange={handleChange}
                                                placeholder="Ej: -98.123456"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                            {/* Imágenes */}
                            <div className="mb-5">
                                <h4 className="mb-4" style={{ color: '#9A1E47' }}>
                                    📸 Imágenes del Hospedaje
                                </h4>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">
                                        🖼️ Selecciona las imágenes <span className="text-muted">(Máximo 10 archivos, 5MB cada uno)</span>
                                    </Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        name="Imagenes" 
                                        multiple 
                                        onChange={handleChange}
                                        accept="image/*"
                                        className="border-0 shadow-sm"
                                        style={{ borderRadius: '10px', padding: '12px' }}
                                    />
                                    <Form.Text className="text-muted">
                                        Formatos permitidos: JPG, PNG, JPEG, WEBP, GIF
                                    </Form.Text>
                                </Form.Group>
                                {imagePreviews.length > 0 && (
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3">🖼️ Vista previa de imágenes:</h6>
                                        <Row>
                                            {imagePreviews.map((preview, index) => (
                                                <Col key={index} xs={6} sm={4} md={3} lg={2} className="mb-3">
                                                    <div 
                                                        className="position-relative"
                                                        style={{
                                                            borderRadius: '10px',
                                                            overflow: 'hidden',
                                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                    >
                                                        <img
                                                            src={preview}
                                                            alt={`Preview ${index + 1}`}
                                                            className="img-fluid"
                                                            style={{
                                                                width: '100%',
                                                                height: '120px',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                        <div 
                                                            className="position-absolute top-0 end-0 m-1"
                                                            style={{
                                                                background: 'rgba(0,0,0,0.7)',
                                                                color: 'white',
                                                                borderRadius: '50%',
                                                                width: '24px',
                                                                height: '24px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(index)}
                                                            className="position-absolute top-0 start-0 m-1 btn btn-danger btn-sm"
                                                            style={{
                                                                width: '24px',
                                                                height: '24px',
                                                                borderRadius: '50%',
                                                                border: 'none',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '10px',
                                                                padding: '0'
                                                            }}
                                                            title="Eliminar imagen"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                )}
                            </div>
                            {/* Botón de envío */}
                            <div className="text-center">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={!idHospedero || isSubmitting}
                                    className="px-5 py-3 fw-bold border-0 shadow"
                                    style={{ 
                                        backgroundColor: '#9A1E47', 
                                        borderRadius: '15px',
                                        minWidth: '200px'
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            📤 Enviar Publicación
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </Container>
    );
};

export default PublicarHospedaje; 