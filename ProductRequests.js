import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Table,
    Button,
    Modal,
    Badge,
    Alert,
    Form,
    Toast,
    Spinner,
    Row,
    Col,
    Card,
    ButtonGroup,
    ProgressBar
} from "react-bootstrap";
import {
    FaCheck,
    FaTimes,
    FaEye,
    FaExclamationTriangle,
    FaSpinner,
    FaFilter,
    FaChartBar,
    FaSync,
    FaInfoCircle,
    FaImage
} from "react-icons/fa";

const ProductoRevision = () => {
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [motivo, setMotivo] = useState("");
    const [accion, setAccion] = useState(""); // "aprobar" o "rechazar"
    const [toast, setToast] = useState({ show: false, mensaje: "", bg: "success" });
    const [loading, setLoading] = useState(false);

    // Nuevos estados para funcionalidades avanzadas
    const [filtroActual, setFiltroActual] = useState("todos");
    const [estadisticas, setEstadisticas] = useState({
        total: 0,
        pendientes: 0,
        aprobados: 0,
        rechazados: 0
    });
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [showDetalleModal, setShowDetalleModal] = useState(false);

    // Estilos personalizados
    const customStyles = {
        primary: { backgroundColor: '#9A1E47', borderColor: '#9A1E47' },
        secondary: { backgroundColor: '#0FA89C', borderColor: '#0FA89C' },
        success: { backgroundColor: '#1E8546', borderColor: '#1E8546' },
        warning: { backgroundColor: '#F28B27', borderColor: '#F28B27' },
        danger: { backgroundColor: '#D24D1C', borderColor: '#D24D1C' },
        info: { backgroundColor: '#50C2C4', borderColor: '#50C2C4' },
        light: { backgroundColor: '#FDF2E0', borderColor: '#FDF2E0' }
    };

    const obtenerProductosRevision = async () => {
        try {
            const response = await axios.get("https://backend-iota-seven-19.vercel.app/api/publicaciones");
            setProductos(response.data);
        } catch (error) {
            console.error("❌ Error al obtener productos:", error);
        }
    };

    const obtenerEstadisticas = async () => {
        try {
            const response = await axios.get("https://backend-iota-seven-19.vercel.app/api/publicaciones/estadisticas/totales");
            setEstadisticas(response.data.estadisticas || {
                total: productos.length,
                pendientes: productos.filter(p => p.estadoRevision === "pendiente").length,
                aprobados: productos.filter(p => p.estadoRevision === "aprobado").length,
                rechazados: productos.filter(p => p.estadoRevision === "rechazado").length
            });
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            // Calcular estadísticas locales si falla la API
            setEstadisticas({
                total: productos.length,
                pendientes: productos.filter(p => p.estadoRevision === "pendiente").length,
                aprobados: productos.filter(p => p.estadoRevision === "aprobado").length,
                rechazados: productos.filter(p => p.estadoRevision === "rechazado").length
            });
        }
    };

    const filtrarProductos = () => {
        let filtrados = [...productos];
        
        if (filtroActual !== "todos") {
            filtrados = productos.filter(producto => 
                producto.estadoRevision === filtroActual
            );
        }
        
        setProductosFiltrados(filtrados);
    };

    useEffect(() => {
        obtenerProductosRevision();
    }, []);

    useEffect(() => {
        filtrarProductos();
        obtenerEstadisticas();
    }, [productos, filtroActual]);

    const mostrarToast = (mensaje, bg = "success") => {
        setToast({ show: true, mensaje, bg });
        setTimeout(() => {
            setToast({ show: false, mensaje: "", bg });
        }, 3000);
    };

    const handleAccion = (producto, tipoAccion) => {
        setProductoSeleccionado(producto);
        setAccion(tipoAccion);
        setMensaje(
            tipoAccion === "aprobar"
                ? `Tu producto "${producto.Nombre}" ha sido aprobado y publicado exitosamente.`
                : `Tu producto "${producto.Nombre}" ha sido rechazado. Por favor revisa el motivo.`
        );
        setMotivo("");
        setShowModal(true);
    };

    const enviarNotificacion = async () => {
        if (!productoSeleccionado) return;

        try {
            setLoading(true);

            // Primero aprueba o rechaza el producto
            if (accion === "aprobar") {
                await axios.put(
                    `https://backend-iota-seven-19.vercel.app/api/publicaciones/${productoSeleccionado.idProducto}/aprobar`,
                    { revisadoPor: "admin" }
                );
            } else {
                await axios.put(
                    `https://backend-iota-seven-19.vercel.app/api/publicaciones/${productoSeleccionado.idProducto}/rechazar`,
                    {
                        revisadoPor: "admin",
                        motivoRechazo: motivo || "No especificado"
                    }
                );
            }

            // Luego envía la notificación
            const notificacion = {
                idUsuario: productoSeleccionado.idUsuario,
                tipo: "publicacion",
                producto: productoSeleccionado.Nombre,
                estado: accion === "aprobar" ? "aprobado" : "rechazado",
                mensaje: mensaje,
                Motivo: accion === "rechazar" ? motivo : "",
                fecha: new Date()
            };

            await axios.post("https://backend-iota-seven-19.vercel.app/api/notificaciones", notificacion);

            mostrarToast(`Producto ${accion === "aprobar" ? "aprobado" : "rechazado"} y notificación enviada`, "success");
            setShowModal(false);
            obtenerProductosRevision();
        } catch (error) {
            console.error("❌ Error al realizar la acción:", error);
            mostrarToast("Error al procesar la solicitud", "danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="py-4" style={customStyles.light}>
            <Row className="mb-4">
                <Col>
                    <h1 style={{ color: customStyles.primary.backgroundColor }}>
                        <strong>Productos en Revisión</strong>
                    </h1>
                    <div style={{ width: '80px', height: '4px', backgroundColor: customStyles.secondary.backgroundColor, borderRadius: '2px' }}></div>
                </Col>
            </Row>

            {/* Panel de Estadísticas */}
            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header style={customStyles.info} className="text-white">
                            <FaChartBar className="me-2" />
                            Estadísticas
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={3} className="text-center">
                                    <h4 style={{ color: customStyles.primary.backgroundColor }}>{estadisticas.total}</h4>
                                    <small className="text-muted">Total</small>
                                </Col>
                                <Col md={3} className="text-center">
                                    <h4 style={{ color: customStyles.warning.backgroundColor }}>{estadisticas.pendientes}</h4>
                                    <small className="text-muted">Pendientes</small>
                                </Col>
                                <Col md={3} className="text-center">
                                    <h4 style={{ color: customStyles.success.backgroundColor }}>{estadisticas.aprobados}</h4>
                                    <small className="text-muted">Aprobados</small>
                                </Col>
                                <Col md={3} className="text-center">
                                    <h4 style={{ color: customStyles.danger.backgroundColor }}>{estadisticas.rechazados}</h4>
                                    <small className="text-muted">Rechazados</small>
                                </Col>
                            </Row>
                            {estadisticas.total > 0 && (
                                <ProgressBar className="mt-3">
                                    <ProgressBar 
                                        variant="warning" 
                                        now={(estadisticas.pendientes / estadisticas.total) * 100} 
                                        label={`${Math.round((estadisticas.pendientes / estadisticas.total) * 100)}%`}
                                    />
                                    <ProgressBar 
                                        variant="success" 
                                        now={(estadisticas.aprobados / estadisticas.total) * 100} 
                                        label={`${Math.round((estadisticas.aprobados / estadisticas.total) * 100)}%`}
                                    />
                                    <ProgressBar 
                                        variant="danger" 
                                        now={(estadisticas.rechazados / estadisticas.total) * 100} 
                                        label={`${Math.round((estadisticas.rechazados / estadisticas.total) * 100)}%`}
                                    />
                                </ProgressBar>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filtros */}
            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <FaFilter className="me-2" />
                                    <strong>Filtros:</strong>
                                </div>
                                <ButtonGroup>
                                    <Button 
                                        variant={filtroActual === "todos" ? "primary" : "outline-primary"}
                                        onClick={() => setFiltroActual("todos")}
                                        style={filtroActual === "todos" ? customStyles.primary : {}}
                                    >
                                        Todos ({productos.length})
                                    </Button>
                                    <Button 
                                        variant={filtroActual === "pendiente" ? "warning" : "outline-warning"}
                                        onClick={() => setFiltroActual("pendiente")}
                                        style={filtroActual === "pendiente" ? customStyles.warning : {}}
                                    >
                                        Pendientes ({productos.filter(p => p.estadoRevision === "pendiente").length})
                                    </Button>
                                    <Button 
                                        variant={filtroActual === "aprobado" ? "success" : "outline-success"}
                                        onClick={() => setFiltroActual("aprobado")}
                                        style={filtroActual === "aprobado" ? customStyles.success : {}}
                                    >
                                        Aprobados ({productos.filter(p => p.estadoRevision === "aprobado").length})
                                    </Button>
                                    <Button 
                                        variant={filtroActual === "rechazado" ? "danger" : "outline-danger"}
                                        onClick={() => setFiltroActual("rechazado")}
                                        style={filtroActual === "rechazado" ? customStyles.danger : {}}
                                    >
                                        Rechazados ({productos.filter(p => p.estadoRevision === "rechazado").length})
                                    </Button>
                                </ButtonGroup>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => {
                                        obtenerProductosRevision();
                                        obtenerEstadisticas();
                                    }}
                                >
                                    <FaSync />
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {productosFiltrados.length === 0 ? (
                <Alert variant="info" className="mt-3">
                    {filtroActual === "todos" 
                        ? "No hay productos en el sistema." 
                        : `No hay productos ${filtroActual} para mostrar.`
                    }
                </Alert>
            ) : (
                <Card className="shadow-sm">
                    <Card.Body className="p-0">
                        <Table responsive hover className="mb-0">
                            <thead style={customStyles.secondary}>
                                <tr className="text-white">
                                    <th>Producto</th>
                                    <th>Artesano</th>
                                    <th className="text-center">Precio</th>
                                    <th className="text-center">Estado</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosFiltrados.map((prod) => (
                                    <tr key={prod.idProducto}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                {prod.Imagen?.[0] && (
                                                    <img 
                                                        src={prod.Imagen[0]} 
                                                        alt="" 
                                                        className="rounded me-3" 
                                                        style={{ width: 50, height: 50, objectFit: 'cover' }} 
                                                    />
                                                )}
                                                <div>
                                                    <div className="fw-bold">{prod.Nombre}</div>
                                                    <small className="text-muted text-truncate d-block" style={{ maxWidth: 200 }}>
                                                        {prod.Descripcion}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="align-middle">{prod.idArtesano || prod.idUsuario}</td>
                                        <td className="text-center align-middle fw-bold" style={{ color: customStyles.success.backgroundColor }}>
                                            ${prod.Precio}
                                        </td>
                                        <td className="text-center align-middle">
                                            <Badge 
                                                bg={
                                                    prod.estadoRevision === "pendiente" ? "warning" :
                                                    prod.estadoRevision === "aprobado" ? "success" :
                                                    prod.estadoRevision === "rechazado" ? "danger" : "secondary"
                                                }
                                            >
                                                {prod.estadoRevision || "Sin estado"}
                                            </Badge>
                                        </td>
                                        <td className="text-center align-middle">
                                            {prod.estadoRevision === "pendiente" && (
                                                <>
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleAccion(prod, "aprobar")}
                                                        style={customStyles.success}
                                                    >
                                                        <FaCheck /> Aprobar
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleAccion(prod, "rechazar")}
                                                        style={customStyles.danger}
                                                    >
                                                        <FaTimes /> Rechazar
                                                    </Button>
                                                </>
                                            )}
                                            <Button 
                                                size="sm" 
                                                onClick={() => { setProductoSeleccionado(prod); setShowDetalleModal(true); }} 
                                                style={customStyles.warning}
                                            >
                                                <FaEye />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            {/* Modal de Detalles del Producto */}
            <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} size="lg" centered>
                <Modal.Header closeButton style={customStyles.secondary}>
                    <Modal.Title className="text-white">Detalles del Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {productoSeleccionado && (
                        <>
                            <Row>
                                <Col md={5}>
                                    <Card className="mb-4">
                                        <Card.Header style={customStyles.primary} className="text-white">
                                            Imágenes del Producto
                                        </Card.Header>
                                        <Card.Body>
                                            {productoSeleccionado.Imagen?.length > 0 ? (
                                                <Row>
                                                    {productoSeleccionado.Imagen.map((img, i) => (
                                                        <Col xs={6} key={i} className="mb-3">
                                                            <Card>
                                                                <Card.Img variant="top" src={img} style={{ height: 120, objectFit: 'cover' }} />
                                                            </Card>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <FaImage size={48} style={{ color: customStyles.info.backgroundColor }} className="mb-3" />
                                                    <p>No hay imágenes disponibles</p>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={7}>
                                    <Card className="mb-4">
                                        <Card.Header style={customStyles.primary} className="text-white">
                                            Información Básica
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col sm={6}>
                                                    <h6 className="text-muted">Nombre</h6>
                                                    <p>{productoSeleccionado.Nombre}</p>
                                                </Col>
                                                <Col sm={6}>
                                                    <h6 className="text-muted">Precio</h6>
                                                    <p style={{ color: customStyles.success.backgroundColor, fontWeight: 'bold' }}>
                                                        ${productoSeleccionado.Precio}
                                                    </p>
                                                </Col>
                                                <Col sm={6}>
                                                    <h6 className="text-muted">Artesano</h6>
                                                    <p>{productoSeleccionado.idArtesano || productoSeleccionado.idUsuario}</p>
                                                </Col>
                                                <Col sm={6}>
                                                    <h6 className="text-muted">Categoría</h6>
                                                    <p>{productoSeleccionado.idCategoria || 'N/A'}</p>
                                                </Col>
                                                <Col sm={6}>
                                                    <h6 className="text-muted">Origen</h6>
                                                    <p>{productoSeleccionado.Origen || 'N/A'}</p>
                                                </Col>
                                                <Col sm={6}>
                                                    <h6 className="text-muted">Estado</h6>
                                                    <Badge 
                                                        bg={
                                                            productoSeleccionado.estadoRevision === "pendiente" ? "warning" :
                                                            productoSeleccionado.estadoRevision === "aprobado" ? "success" :
                                                            productoSeleccionado.estadoRevision === "rechazado" ? "danger" : "secondary"
                                                        }
                                                    >
                                                        {productoSeleccionado.estadoRevision || "Sin estado"}
                                                    </Badge>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="mb-4">
                                        <Card.Header style={customStyles.primary} className="text-white">
                                            Descripción
                                        </Card.Header>
                                        <Card.Body>
                                            <p>{productoSeleccionado.Descripcion || productoSeleccionado.Descripción || 'No disponible'}</p>
                                        </Card.Body>
                                    </Card>
                                    <Row>
                                        <Col md={6}>
                                            <Card className="mb-4">
                                                <Card.Header style={customStyles.primary} className="text-white">
                                                    Especificaciones
                                                </Card.Header>
                                                <Card.Body>
                                                    <h6 className="text-muted">Dimensiones</h6>
                                                    <p>{productoSeleccionado.Dimensiones || 'N/A'}</p>
                                                    <h6 className="text-muted">Materiales</h6>
                                                    <p>{productoSeleccionado.Materiales || 'N/A'}</p>
                                                    <h6 className="text-muted">Técnica</h6>
                                                    <p>{productoSeleccionado.Técnica || 'N/A'}</p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={6}>
                                            <Card className="mb-4">
                                                <Card.Header style={customStyles.primary} className="text-white">
                                                    Detalles Adicionales
                                                </Card.Header>
                                                <Card.Body>
                                                    <h6 className="text-muted">Colores</h6>
                                                    <p>
                                                        {Array.isArray(productoSeleccionado.Colores) 
                                                            ? productoSeleccionado.Colores.join(', ') 
                                                            : productoSeleccionado.Colores || 'N/A'
                                                        }
                                                    </p>
                                                    <h6 className="text-muted">Etiquetas</h6>
                                                    <p>
                                                        {Array.isArray(productoSeleccionado.Etiquetas) 
                                                            ? productoSeleccionado.Etiquetas.join(', ') 
                                                            : productoSeleccionado.Etiquetas || 'N/A'
                                                        }
                                                    </p>
                                                    <h6 className="text-muted">Disponibilidad</h6>
                                                    <p>{productoSeleccionado.Disponibilidad || 'N/A'}</p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowDetalleModal(false)} style={customStyles.primary}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Notificación */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton style={accion === "aprobar" ? customStyles.success : customStyles.danger}>
                    <Modal.Title className="text-white">
                        {accion === "aprobar" ? "Aprobar producto" : "Rechazar producto"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="mensaje">
                            <Form.Label>Mensaje para el artesano</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                            />
                        </Form.Group>

                        {accion === "rechazar" && (
                            <Form.Group controlId="motivo" className="mt-3">
                                <Form.Label>Motivo del rechazo</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    placeholder="Indica el motivo del rechazo"
                                />
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant={accion === "aprobar" ? "success" : "danger"}
                        onClick={enviarNotificacion}
                        disabled={loading}
                        style={accion === "aprobar" ? customStyles.success : customStyles.danger}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="spin me-2" /> Procesando...
                            </>
                        ) : (
                            accion === "aprobar" ? "Aprobar y Notificar" : "Rechazar y Notificar"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Toast de Mensaje */}
            <Toast
                bg={toast.bg}
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                delay={3000}
                autohide
                style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}
            >
                <Toast.Body className="text-white">{toast.mensaje}</Toast.Body>
            </Toast>
        </Container>
    );
};

export default ProductoRevision;
