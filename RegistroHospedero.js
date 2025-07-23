import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

const RegistroHospedero = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        ubicacion: '',
        especialidad: 'Hospedaje',
        descripcion: '',
        imagenPerfil: null,
        facebook: '',
        instagram: '',
        whatsapp: '',
    });

    const [mensaje, setMensaje] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const usuarioLogeado = JSON.parse(localStorage.getItem("user"));
        if (usuarioLogeado) {
            setFormData(prev => ({
                ...prev,
                nombre: usuarioLogeado.nombre || '',
                correo: usuarioLogeado.email || '',
                telefono: usuarioLogeado.telefono || ''
            }));
        }
    }, []);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'imagenPerfil') {
            setFormData({ ...formData, imagenPerfil: files[0] });
            if (files[0]) {
                const preview = URL.createObjectURL(files[0]);
                setImagePreview(preview);
            } else {
                setImagePreview(null);
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleRemoveImage = () => {
        setFormData({ ...formData, imagenPerfil: null });
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const usuarioLogeado = JSON.parse(localStorage.getItem("user"));
        const token = usuarioLogeado?.token;
        const idUsuario = usuarioLogeado?._id;

        if (!token || !idUsuario) {
            setMensaje('⚠️ Debes iniciar sesión para registrar un hospedero.');
            setIsSubmitting(false);
            return;
        }

        const data = new FormData();
        data.append('idUsuario', idUsuario);
        data.append('nombre', formData.nombre);
        data.append('correo', formData.correo);
        data.append('telefono', formData.telefono);
        data.append('ubicacion', formData.ubicacion);
        data.append('especialidad', formData.especialidad);
        data.append('descripcion', formData.descripcion);
        if (formData.imagenPerfil) {
            data.append('imagenPerfil', formData.imagenPerfil);
        }
        data.append('redesSociales.facebook', formData.facebook);
        data.append('redesSociales.instagram', formData.instagram);
        data.append('redesSociales.whatsapp', formData.whatsapp);

        try {
            await axios.post('https://backend-iota-seven-19.vercel.app/api/contactoHospedero', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });

            setMensaje('✅ Registro exitoso');
            setFormData({
                nombre: '', correo: '', telefono: '', ubicacion: '',
                especialidad: 'Hospedaje', descripcion: '', imagenPerfil: null,
                facebook: '', instagram: '', whatsapp: ''
            });
            setImagePreview(null);
        } catch (error) {
            setMensaje('❌ Error al registrar hospedero');
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
                        🏨 Registro de Hospedero
                    </h1>
                    <p className="lead text-muted">
                        Únete a nuestra comunidad de hospedajes y comparte tu espacio
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

                <Card className="border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    <Card.Body className="p-5">
                        <Form onSubmit={handleSubmit}>
                            {/* Información Personal */}
                            <div className="mb-5">
                                <h4 className="mb-4" style={{ color: '#9A1E47' }}>
                                    👤 Información Personal
                                </h4>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">
                                                👤 Nombre completo <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control 
                                                name="nombre" 
                                                value={formData.nombre} 
                                                onChange={handleChange} 
                                                required 
                                                readOnly 
                                                className="border-0 shadow-sm bg-light"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                            <Form.Text className="text-muted">
                                                Este campo se llena automáticamente desde tu perfil
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">
                                                📧 Correo electrónico <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control 
                                                type="email" 
                                                name="correo" 
                                                value={formData.correo} 
                                                onChange={handleChange} 
                                                required 
                                                readOnly
                                                className="border-0 shadow-sm bg-light"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                            <Form.Text className="text-muted">
                                                Este campo se llena automáticamente desde tu perfil
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">
                                                📞 Teléfono <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control 
                                                name="telefono" 
                                                value={formData.telefono} 
                                                onChange={handleChange} 
                                                required 
                                                placeholder="Ej: +52 55 1234 5678"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">📍 Ubicación</Form.Label>
                                            <Form.Control 
                                                name="ubicacion" 
                                                value={formData.ubicacion} 
                                                onChange={handleChange}
                                                placeholder="Ej: Ciudad, Estado, País"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>

                            {/* Información Profesional */}
                            <div className="mb-5">
                                <h4 className="mb-4" style={{ color: '#9A1E47' }}>
                                    🏨 Información Profesional
                                </h4>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">🏨 Especialidad</Form.Label>
                                            <Form.Control 
                                                name="especialidad" 
                                                value={formData.especialidad} 
                                                onChange={handleChange}
                                                placeholder="Ej: Hotel, Hostal, Cabaña"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">📸 Foto de perfil</Form.Label>
                                            <Form.Control 
                                                type="file" 
                                                name="imagenPerfil" 
                                                onChange={handleChange}
                                                accept="image/*"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                            <Form.Text className="text-muted">
                                                Formatos: JPG, PNG, JPEG, WEBP, GIF (Máximo 5MB)
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">📝 Descripción</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={4} 
                                        name="descripcion" 
                                        value={formData.descripcion} 
                                        onChange={handleChange}
                                        placeholder="Cuéntanos sobre tu experiencia, tipo de hospedaje, etc..."
                                        className="border-0 shadow-sm"
                                        style={{ borderRadius: '10px', padding: '12px' }}
                                    />
                                </Form.Group>

                                {imagePreview && (
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3">🖼️ Vista previa de la imagen:</h6>
                                        <div className="position-relative d-inline-block">
                                            <div 
                                                className="position-relative"
                                                style={{
                                                    borderRadius: '15px',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                                }}
                                            >
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview de perfil"
                                                    style={{
                                                        width: '200px',
                                                        height: '200px',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="position-absolute top-0 end-0 m-2 btn btn-danger btn-sm"
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '50%',
                                                        border: 'none',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '16px',
                                                        padding: '0',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                                    }}
                                                    title="Eliminar imagen"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Redes Sociales */}
                            <div className="mb-5">
                                <h4 className="mb-4" style={{ color: '#9A1E47' }}>
                                    🌐 Redes Sociales
                                </h4>
                                <p className="text-muted mb-4">
                                    Conecta con tus clientes a través de tus redes sociales
                                </p>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">📘 Facebook</Form.Label>
                                            <Form.Control 
                                                name="facebook" 
                                                value={formData.facebook} 
                                                onChange={handleChange}
                                                placeholder="Ej: facebook.com/tuUsuario"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">📷 Instagram</Form.Label>
                                            <Form.Control 
                                                name="instagram" 
                                                value={formData.instagram} 
                                                onChange={handleChange}
                                                placeholder="Ej: @tuUsuario"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">📱 WhatsApp</Form.Label>
                                            <Form.Control 
                                                name="whatsapp" 
                                                value={formData.whatsapp} 
                                                onChange={handleChange}
                                                placeholder="Ej: +52 55 1234 5678"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>

                            {/* Botón de envío */}
                            <div className="text-center">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={isSubmitting}
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
                                            Registrando...
                                        </>
                                    ) : (
                                        <>
                                            ✅ Registrar Hospedero
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

export default RegistroHospedero; 