import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card, Badge } from 'react-bootstrap';
import axios from 'axios';

const PublicarProducto = () => {
    const [formData, setFormData] = useState({
        Nombre: '',
        Precio: '',
        Descripción: '',
        Dimensiones: '',
        Colores: '',
        Etiquetas: '',
        Origen: '',
        Materiales: '',
        Técnica: '',
        Especificaciones: '',
        Comentarios: '',
        idCategoria: '',
        Imagen: []
    });

    const [mensaje, setMensaje] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [idArtesano, setIdArtesano] = useState(null);
    const [datosArtesano, setDatosArtesano] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    const idUsuario = user?._id || user?.idUsuario;

    // ✅ Obtener categorías
    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                const res = await axios.get('https://backend-iota-seven-19.vercel.app/api/categoriaProducto');
                setCategorias(res.data);
            } catch (error) {
                console.error("❌ Error al cargar categorías:", error);
            }
        };
        cargarCategorias();
    }, []);

    // ✅ Obtener artesano desde backend
    useEffect(() => {
        const obtenerArtesano = async () => {
            if (!idUsuario) return;

            try {
                const res = await axios.get(`https://backend-iota-seven-19.vercel.app/api/artesano/por-usuario/${idUsuario}`);
                setIdArtesano(res.data.idArtesano);
                setDatosArtesano(res.data);
            } catch (error) {
                console.warn("⚠️ Este usuario no está registrado como artesano.");
                setIdArtesano(null);
            }
        };
        obtenerArtesano();
    }, [idUsuario]);

    // ✅ Manejar cambios del formulario
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'Imagen') {
            setFormData({ ...formData, Imagen: files });
            
            // Crear previews de las imágenes
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

    // ✅ Eliminar imagen específica
    const handleRemoveImage = (indexToRemove) => {
        const newFiles = Array.from(formData.Imagen).filter((_, index) => index !== indexToRemove);
        const newPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
        
        setFormData({ ...formData, Imagen: newFiles });
        setImagePreviews(newPreviews);
        
        // Limpiar la URL del preview eliminado
        URL.revokeObjectURL(imagePreviews[indexToRemove]);
    };

    // ✅ Limpiar previews al desmontar
    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    // ✅ Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        console.log("🚀 Iniciando envío del formulario...");
        console.log("📋 Datos del formulario:", formData);
        console.log("📝 Descripción:", formData.Descripción);
        console.log("🎨 Técnica:", formData.Técnica);

        if (!token || !idUsuario || !idArtesano) {
            setMensaje('⚠️ Debes estar registrado como artesano para publicar un producto.');
            setIsSubmitting(false);
            return;
        }

        const data = new FormData();
        
        // Log de los datos antes de enviar
        console.log('📤 Datos del formulario antes de enviar:', formData);
        
        for (const key in formData) {
            if (key === 'Imagen') {
                for (let i = 0; i < formData.Imagen.length; i++) {
                    data.append('Imagen', formData.Imagen[i]);
                }
            } else {
                data.append(key, formData[key]);
                console.log(`📝 Agregando campo: ${key} = ${formData[key]}`);
                
                // Agregar también versiones sin tildes para compatibilidad
                if (key === 'Descripción') {
                    data.append('Descripcion', formData[key]);
                    console.log(`📝 Agregando campo alternativo: Descripcion = ${formData[key]}`);
                }
                if (key === 'Técnica') {
                    data.append('Tecnica', formData[key]);
                    console.log(`📝 Agregando campo alternativo: Tecnica = ${formData[key]}`);
                }
            }
        }

        // Agregar datos obligatorios del backend
        data.append('idUsuario', idUsuario);
        data.append('idArtesano', idArtesano);
        data.append('estadoRevision', 'pendiente');
        data.append('fechaSolicitud', new Date().toISOString());

        // Log del FormData completo
        console.log('📦 FormData completo:');
        for (let pair of data.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        try {
            
            const response = await axios.post('https://backend-iota-seven-19.vercel.app/api/publicaciones', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('✅ Respuesta del backend:', response.data);
            console.log('📋 Producto creado con datos:', response.data);

            setMensaje('✅ Producto enviado para revisión');
            setFormData({
                Nombre: '',
                Precio: '',
                Descripción: '',
                Dimensiones: '',
                Colores: '',
                Etiquetas: '',
                Origen: '',
                Materiales: '',
                Técnica: '',
                Especificaciones: '',
                Comentarios: '',
                idCategoria: '',
                Imagen: []
            });
            setImagePreviews([]);
        } catch (error) {
            console.error("❌ Error al enviar producto:", error.response?.data || error.message);
            setMensaje('❌ Hubo un error al enviar tu producto');
        } finally {
            setIsSubmitting(false);
        }
        
    };
console.log("🧾 idUsuario desde localStorage:", idUsuario);
console.log("🎨 idArtesano recuperado del backend:", idArtesano);
console.log("📋 Datos completos del artesano:", datosArtesano);

    return (
        <Container fluid className="py-5" style={{
            background: 'linear-gradient(135deg, #FDF2E0 0%, #F8E8D0 100%)',
            minHeight: '100vh'
        }}>
            <Container>
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold" style={{ color: '#9A1E47' }}>
                        🎨 Publicar Producto Artesanal
                    </h1>
                    <p className="lead text-muted">
                        Comparte tu creatividad con el mundo
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

            {!idArtesano && (
                    <Alert variant="warning" className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center">
                            <span className="me-2">⚠️</span>
                            <div>
                                <strong>Registro requerido:</strong> Debes completar tu 
                                <a href="/RegistroArtesano" className="text-decoration-none ms-1">
                                    registro como artesano
                                </a> para publicar productos.
                            </div>
                        </div>
                </Alert>
            )}

            {idArtesano && datosArtesano && (
                    <Alert variant="info" className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center">
                            <span className="me-2">👤</span>
                            <div>
                                <strong>Publicando como:</strong> {datosArtesano.nombre}
                                <Badge bg="secondary" className="ms-2">{datosArtesano.especialidad}</Badge>
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
                                                🏷️ Nombre del producto <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control 
                                                name="Nombre" 
                                                value={formData.Nombre} 
                                                onChange={handleChange} 
                                                required 
                                                placeholder="Ej: Jarrón de barro tradicional"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                        </Form.Group>
                    </Col>
                                    <Col lg={4} md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">
                                                💰 Precio <span className="text-danger">*</span>
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
                                        name="Descripción" 
                                        value={formData.Descripción} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="Describe tu producto, su historia, características especiales..."
                                        className="border-0 shadow-sm"
                                        style={{ borderRadius: '10px', padding: '12px' }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">
                                        📂 Categoría <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Select 
                                        name="idCategoria" 
                                        value={formData.idCategoria} 
                                        onChange={handleChange} 
                                        required
                                        className="border-0 shadow-sm"
                                        style={{ borderRadius: '10px', padding: '12px' }}
                                    >
                        <option value="">Seleccione una categoría</option>
                        {categorias.map((cat) => (
                            <option key={cat.idCategoria} value={cat.idCategoria}>{cat.Nombre}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                            </div>

                            {/* Características del Producto */}
                            <div className="mb-5">
                                <h4 className="mb-4" style={{ color: '#9A1E47' }}>
                                    🎨 Características del Producto
                                </h4>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">📏 Dimensiones</Form.Label>
                                            <Form.Control 
                                                name="Dimensiones" 
                                                value={formData.Dimensiones} 
                                                onChange={handleChange}
                                                placeholder="Ej: 20cm x 15cm x 10cm"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">🎨 Colores</Form.Label>
                                            <Form.Control 
                                                name="Colores" 
                                                value={formData.Colores} 
                                                onChange={handleChange}
                                                placeholder="Ej: Rojo, Verde, Azul"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">🏺 Materiales</Form.Label>
                                            <Form.Control 
                                                name="Materiales" 
                                                value={formData.Materiales} 
                                                onChange={handleChange}
                                                placeholder="Ej: Barro, Madera, Tela"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">🖌️ Técnica</Form.Label>
                                            <Form.Control 
                                                name="Técnica" 
                                                value={formData.Técnica} 
                                                onChange={handleChange}
                                                placeholder="Ej: Moldeado a mano, Tejido, Pintura"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">📍 Origen</Form.Label>
                                            <Form.Control 
                                                name="Origen" 
                                                value={formData.Origen} 
                                                onChange={handleChange}
                                                placeholder="Ej: Oaxaca, México"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">🏷️ Etiquetas</Form.Label>
                                            <Form.Control 
                                                name="Etiquetas" 
                                                value={formData.Etiquetas} 
                                                onChange={handleChange}
                                                placeholder="Ej: Tradicional, Único, Hecho a mano"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">📋 Especificaciones</Form.Label>
                                    <Form.Control 
                                        name="Especificaciones" 
                                        value={formData.Especificaciones} 
                                        onChange={handleChange}
                                        placeholder="Detalles técnicos, cuidados especiales, etc."
                                        className="border-0 shadow-sm"
                                        style={{ borderRadius: '10px', padding: '12px' }}
                                    />
                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">💬 Comentarios adicionales</Form.Label>
                                    <Form.Control 
                                        as="textarea"
                                        rows={3}
                                        name="Comentarios" 
                                        value={formData.Comentarios} 
                                        onChange={handleChange}
                                        placeholder="Información adicional que quieras compartir..."
                                        className="border-0 shadow-sm"
                                        style={{ borderRadius: '10px', padding: '12px' }}
                                    />
                                </Form.Group>
                            </div>

                            {/* Imágenes */}
                            <div className="mb-5">
                                <h4 className="mb-4" style={{ color: '#9A1E47' }}>
                                    📸 Imágenes del Producto
                                </h4>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">
                                        🖼️ Selecciona las imágenes <span className="text-muted">(Máximo 10 archivos, 5MB cada uno)</span>
                                    </Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        name="Imagen" 
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

                                {/* Preview de imágenes */}
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
                                    disabled={!idArtesano || isSubmitting}
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

export default PublicarProducto;
