//PublicarGastronomia.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card, Badge } from 'react-bootstrap';
import axios from 'axios';

const PublicarGastronomia = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        ingredientes: [''],
        receta: {
            pasos: [''],
            tiempoPreparacionMinutos: '',
            tiempoCoccionHoras: '',
            porciones: ''
        },
        consejosServir: [''],
        tipoPlatillo: '',
        regionOrigen: '',
        historiaOrigen: '',
        ocasion: [''],
        ubicacionDondeEncontrar: [{
            nombreLugar: '',
            tipoLugar: '',
            direccion: '',
            coordenadas: {
                lat: '',
                lng: ''
            }
        }],
        imagen: []
    });

    const [mensaje, setMensaje] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [idChef, setIdChef] = useState(null);
    const [datosChef, setDatosChef] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    const idUsuario = user?._id || user?.idUsuario;

    useEffect(() => {
        const obtenerChef = async () => {
            if (!idUsuario) return;
            try {
                const res = await axios.get(`https://backend-iota-seven-19.vercel.app/api/contactoChef/por-usuario/${idUsuario}`);
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setIdChef(res.data[0].idChef);
                    setDatosChef(res.data[0]);
                } else if (res.data.idChef) {
                    setIdChef(res.data.idChef);
                    setDatosChef(res.data);
                } else {
                    setIdChef(null);
                }
            } catch (error) {
                setIdChef(null);
            }
        };
        obtenerChef();
    }, [idUsuario]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'imagen') {
            setFormData({ ...formData, imagen: files });
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
        const newFiles = Array.from(formData.imagen).filter((_, index) => index !== indexToRemove);
        const newPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
        setFormData({ ...formData, imagen: newFiles });
        setImagePreviews(newPreviews);
        URL.revokeObjectURL(imagePreviews[indexToRemove]);
    };

    const handleArrayChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addToArray = (field, value = '') => {
        setFormData({ ...formData, [field]: [...formData[field], value] });
    };

    const removeFromArray = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArray });
    };

    const handleNestedArrayChange = (field, subfield, index, value) => {
        const updated = [...formData[field]];
        updated[index][subfield] = value;
        setFormData({ ...formData, [field]: updated });
    };

    const handleNestedCoordinateChange = (index, coord, value) => {
        const updated = [...formData.ubicacionDondeEncontrar];
        updated[index].coordenadas[coord] = value;
        setFormData({ ...formData, ubicacionDondeEncontrar: updated });
    };
    const addUbicacion = () => {
        setFormData({
            ...formData,
            ubicacionDondeEncontrar: [
                ...formData.ubicacionDondeEncontrar,
                {
                    nombreLugar: '',
                    tipoLugar: '',
                    direccion: '',
                    coordenadas: { lat: '', lng: '' }
                }
            ]
        });
    };

    const removeUbicacion = (index) => {
        const updated = formData.ubicacionDondeEncontrar.filter((_, i) => i !== index);
        setFormData({ ...formData, ubicacionDondeEncontrar: updated });
    };


    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        console.log("🚀 Iniciando envío del formulario...");
        console.log("📋 Datos del formulario:", formData);

        if (!token || !idUsuario || !idChef) {
            setMensaje('⚠️ Debes estar registrado como chef para publicar un platillo.');
            setIsSubmitting(false);
            return;
        }

        const data = new FormData();

        // Agregar todos los campos del formData
        for (const key in formData) {
            if (key === 'imagen') {
                if (formData.imagen && formData.imagen.length > 0) {
                    for (let i = 0; i < formData.imagen.length; i++) {
                        data.append('imagen', formData.imagen[i]);
                    }
                }
            } else if (Array.isArray(formData[key]) || typeof formData[key] === 'object') {
                data.append(key, JSON.stringify(formData[key]));
            } else {
                data.append(key, formData[key]);
            }
        }
        data.append('idUsuario', idUsuario);
        data.append('idChef', idChef);
        data.append('estadoRevision', 'pendiente');
        data.append('fechaSolicitud', new Date().toISOString());

        // Log del FormData completo
        console.log('📦 FormData completo:');
        for (let pair of data.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        try {
            const response = await axios.post('https://backend-iota-seven-19.vercel.app/api/publicacionGastronomia', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('✅ Respuesta del backend:', response.data);
            setMensaje('✅ Platillo enviado para revisión');
            setFormData({
                nombre: '',
                descripcion: '',
                ingredientes: [''],
                receta: { pasos: [''], tiempoPreparacionMinutos: '', tiempoCoccionHoras: '', porciones: '' },
                consejosServir: [''],
                tipoPlatillo: '',
                regionOrigen: '',
                historiaOrigen: '',
                ocasion: [''],
                ubicacionDondeEncontrar: [{
                    nombreLugar: '',
                    tipoLugar: '',
                    direccion: '',
                    coordenadas: { lat: '', lng: '' }
                }],
                imagen: []
            });
            setImagePreviews([]);
        } catch (error) {
            console.error("❌ Error al enviar platillo:", error.response?.data || error.message);
            setMensaje('❌ Hubo un error al enviar tu platillo');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container fluid className="py-5" style={{ background: 'linear-gradient(135deg, #FFF5EB 0%, #FEEBD6 100%)', minHeight: '100vh' }}>
            <Container>
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold" style={{ color: '#C2410C' }}>
                        🍽️ Publicar Platillo
                    </h1>
                    <p className="lead text-muted">Comparte tu creación culinaria</p>
                </div>

                {mensaje && (
                    <Alert variant={mensaje.startsWith('✅') ? 'success' : 'danger'} className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center">
                            <span className="me-2">{mensaje.startsWith('✅') ? '✅' : '❌'}</span>
                            {mensaje}
                        </div>
                    </Alert>
                )}

                {!idChef && (
                    <Alert variant="warning" className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center">
                            <span className="me-2">⚠️</span>
                            <div>
                                <strong>Registro requerido:</strong> Debes completar tu
                                <a href="/RegistroChef" className="text-decoration-none ms-1">
                                    registro como chef
                                </a> para publicar platillos.
                            </div>
                        </div>
                    </Alert>
                )}

                {idChef && datosChef && (
                    <Alert variant="info" className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center">
                            <span className="me-2">👨‍🍳</span>
                            <div>
                                <strong>Publicando como:</strong> {datosChef.nombre}
                                <Badge bg="secondary" className="ms-2">{datosChef.especialidad}</Badge>
                            </div>
                        </div>
                    </Alert>
                )}

                <Card className="border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    <Card.Body className="p-5">
                        <Form onSubmit={handleSubmit}>
                            <h4 className="mb-4" style={{ color: '#C2410C' }}>🧾 Información del Platillo</h4>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-4">
                                        <Form.Label>🍲 Nombre del platillo</Form.Label>
                                        <Form.Control
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                            placeholder="Ej: Zacahuil"
                                            className="border-0 shadow-sm"
                                            style={{ borderRadius: '10px', padding: '12px' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-4">
                                        <Form.Label>📍 Región de origen</Form.Label>
                                        <Form.Control
                                            name="regionOrigen"
                                            value={formData.regionOrigen}
                                            onChange={handleChange}
                                            placeholder="Ej: Huasteca Potosina"
                                            className="border-0 shadow-sm"
                                            style={{ borderRadius: '10px', padding: '12px' }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-4">
                                <Form.Label>📝 Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Describe tu platillo..."
                                    className="border-0 shadow-sm"
                                    style={{ borderRadius: '10px' }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>📖 Historia del platillo</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="historiaOrigen"
                                    value={formData.historiaOrigen}
                                    onChange={handleChange}
                                    placeholder="Comparte la historia detrás del platillo..."
                                    className="border-0 shadow-sm"
                                    style={{ borderRadius: '10px' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                    <Form.Label>🍽️ Tipo de Platillo</Form.Label>
                                    <Form.Control
                                    as="textarea"
                                    rows={1}
                                    name="tipoPlatillo"
                                    value={formData.tipoPlatillo}
                                    onChange={handleChange}
                                    placeholder="Postre,Plato fuerte..."
                                    className="border-0 shadow-sm"
                                    style={{ borderRadius: '10px' }}
                                />
                            </Form.Group>

                            {/* Ingredientes */}
                            <Form.Label>🧂 Ingredientes</Form.Label>
                            {formData.ingredientes.map((ingrediente, index) => (
                                <Row key={index} className="mb-2">
                                    <Col>
                                        <Form.Control
                                            value={ingrediente}
                                            onChange={(e) => handleArrayChange('ingredientes', index, e.target.value)}
                                            placeholder="Ej: Maíz, chile, carne..."
                                        />
                                    </Col>
                                    <Col xs="auto">
                                        <Button variant="danger" onClick={() => removeFromArray('ingredientes', index)}>✖️</Button>
                                    </Col>
                                </Row>
                            ))}
                            <Button variant="outline-primary" onClick={() => addToArray('ingredientes')}>➕ Agregar ingrediente</Button>

                            {/* Receta */}
                            <hr />
                            <h5 className="mt-4">👩‍🍳 Receta</h5>
                            <Row className="mb-3">
                                <Col md>
                                    <Form.Label>⏱️ Tiempo de preparación (min)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.receta.tiempoPreparacionMinutos}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            receta: { ...formData.receta, tiempoPreparacionMinutos: e.target.value }
                                        })}
                                    />
                                </Col>
                                <Col md>
                                    <Form.Label>🔥 Tiempo de cocción (hrs)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.receta.tiempoCoccionHoras}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            receta: { ...formData.receta, tiempoCoccionHoras: e.target.value }
                                        })}
                                    />
                                </Col>
                                <Col md>
                                    <Form.Label>🍽️ Porciones</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.receta.porciones}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            receta: { ...formData.receta, porciones: e.target.value }
                                        })}
                                    />
                                </Col>
                            </Row>

                        <Form.Label>📝 Pasos</Form.Label>
                        {formData.receta.pasos.map((paso, index) => (
                            <Row key={index} className="mb-2">
                                <Col>
                                    <Form.Control
                                        value={paso}
                                        onChange={(e) => {
                                            const pasos = [...formData.receta.pasos];
                                            pasos[index] = e.target.value;
                                            setFormData({ ...formData, receta: { ...formData.receta, pasos } });
                                        }}
                                        placeholder={`Paso ${index + 1}`}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button variant="danger" onClick={() => {
                                        const pasos = formData.receta.pasos.filter((_, i) => i !== index);
                                        setFormData({ ...formData, receta: { ...formData.receta, pasos } });
                                    }}>✖️</Button>
                                </Col>
                            </Row>
                        ))}
                        <Button variant="outline-primary" onClick={() => setFormData({
                            ...formData,
                            receta: { ...formData.receta, pasos: [...formData.receta.pasos, ''] }
                        })}>➕ Agregar paso</Button>
                        
                        {/* Consejos */}
                        <hr />
                        <Form.Label className="mt-4">💡 Consejos para servir</Form.Label>
                        {formData.consejosServir.map((consejo, index) => (
                            <Row key={index} className="mb-2">
                                <Col>
                                    <Form.Control
                                        value={consejo}
                                        onChange={(e) => handleArrayChange('consejosServir', index, e.target.value)}
                                        placeholder="Consejo..."
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button variant="danger" onClick={() => removeFromArray('consejosServir', index)}>✖️</Button>
                                </Col>
                            </Row>
                        ))}
                        <Button variant="outline-primary" onClick={() => addToArray('consejosServir')}>➕ Agregar consejo</Button>

                        {/* Ocasión */}
                        <hr />
                        <Form.Label className="mt-4">🎉 Ocasión</Form.Label>
                        {formData.ocasion.map((ocas, index) => (
                            <Row key={index} className="mb-2">
                                <Col>
                                    <Form.Control
                                        value={ocas}
                                        onChange={(e) => handleArrayChange('ocasion', index, e.target.value)}
                                        placeholder="Ej: Fiesta patronal, Día de muertos..."
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button variant="danger" onClick={() => removeFromArray('ocasion', index)}>✖️</Button>
                                </Col>
                            </Row>
                        ))}
                        <Button variant="outline-primary" onClick={() => addToArray('ocasion')}>➕ Agregar ocasión</Button>

                        {/* Ubicaciones */}
                        <hr />
                        <h5 className="mt-4">📍 Dónde encontrar este platillo</h5>
                        {formData.ubicacionDondeEncontrar.map((lugar, index) => (
                            <div key={index} className="border rounded p-3 mb-3">
                                <Row>
                                    <Col md>
                                        <Form.Label>Nombre del lugar</Form.Label>
                                        <Form.Control
                                            value={lugar.nombreLugar}
                                            onChange={(e) => handleNestedArrayChange('ubicacionDondeEncontrar', 'nombreLugar', index, e.target.value)}
                                        />
                                    </Col>
                                    <Col md>
                                        <Form.Label>Tipo de lugar</Form.Label>
                                        <Form.Control
                                            value={lugar.tipoLugar}
                                            onChange={(e) => handleNestedArrayChange('ubicacionDondeEncontrar', 'tipoLugar', index, e.target.value)}
                                        />
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col md>
                                        <Form.Label>Dirección</Form.Label>
                                        <Form.Control
                                            value={lugar.direccion}
                                            onChange={(e) => handleNestedArrayChange('ubicacionDondeEncontrar', 'direccion', index, e.target.value)}
                                        />
                                    </Col>
                                    <Col md>
                                        <Form.Label>Latitud</Form.Label>
                                        <Form.Control
                                            value={lugar.coordenadas.lat}
                                            onChange={(e) => handleNestedCoordinateChange(index, 'lat', e.target.value)}
                                        />
                                    </Col>
                                    <Col md>
                                        <Form.Label>Longitud</Form.Label>
                                        <Form.Control
                                            value={lugar.coordenadas.lng}
                                            onChange={(e) => handleNestedCoordinateChange(index, 'lng', e.target.value)}
                                        />
                                    </Col>
                                </Row>
                                <Button className="mt-2" variant="danger" onClick={() => removeUbicacion(index)}>Eliminar ubicación</Button>
                            </div>
                        ))}
                        <Button variant="outline-success" onClick={addUbicacion}>➕ Agregar ubicación</Button>

                        <Form.Group className="mb-4">
                                <Form.Label>📸 Imágenes del platillo</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="imagen"
                                    multiple
                                    onChange={handleChange}
                                    accept="image/*"
                                    className="border-0 shadow-sm"
                                    style={{ borderRadius: '10px' }}
                                />
                            </Form.Group>
                            {imagePreviews.length > 0 && (
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3">Vista previa:</h6>
                                    <Row>
                                        {imagePreviews.map((preview, index) => (
                                            <Col key={index} xs={6} sm={4} md={3} className="mb-3">
                                                <div className="position-relative">
                                                    <img
                                                        src={preview}
                                                        alt={`Imagen ${index + 1}`}
                                                        className="img-fluid"
                                                        style={{
                                                            borderRadius: '10px',
                                                            width: '100%',
                                                            height: '140px',
                                                            objectFit: 'cover',
                                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index)}
                                                        className="btn btn-danger btn-sm position-absolute top-0 start-0 m-2"
                                                        style={{ borderRadius: '50%' }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            )}

                            <div className="text-center">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={!idChef || isSubmitting}
                                    className="px-5 py-3 fw-bold border-0 shadow"
                                    style={{ backgroundColor: '#C2410C', borderRadius: '15px', minWidth: '200px' }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>📤 Publicar Platillo</>
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

export default PublicarGastronomia;