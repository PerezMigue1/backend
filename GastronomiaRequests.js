import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container, Table, Button, Modal, Badge, Alert, Form, Toast, Spinner, Row, Col, Card, ButtonGroup, ProgressBar
} from "react-bootstrap";
import { FaCheck, FaTimes, FaEye, FaSpinner, FaFilter, FaChartBar, FaSync, FaInfoCircle, FaImage } from "react-icons/fa";

const GastronomiaRequests = () => {
    const [platillos, setPlatillos] = useState([]);
    const [platilloSeleccionado, setPlatilloSeleccionado] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [motivo, setMotivo] = useState("");
    const [accion, setAccion] = useState(""); // "aprobar" o "rechazar"
    const [toast, setToast] = useState({ show: false, mensaje: "", bg: "success" });
    const [loading, setLoading] = useState(false);
    const [filtroActual, setFiltroActual] = useState("todos");
    const [estadisticas, setEstadisticas] = useState({
        total: 0, pendientes: 0, aprobados: 0, rechazados: 0
    });
    const [platillosFiltrados, setPlatillosFiltrados] = useState([]);
    const [showDetalleModal, setShowDetalleModal] = useState(false);

    const customStyles = {
        primary: { backgroundColor: '#C2410C', borderColor: '#C2410C' },
        secondary: { backgroundColor: '#0FA89C', borderColor: '#0FA89C' },
        success: { backgroundColor: '#1E8546', borderColor: '#1E8546' },
        warning: { backgroundColor: '#F28B27', borderColor: '#F28B27' },
        danger: { backgroundColor: '#D24D1C', borderColor: '#D24D1C' },
        info: { backgroundColor: '#50C2C4', borderColor: '#50C2C4' },
        light: { backgroundColor: '#FFF5EB', borderColor: '#FFF5EB' }
    };

    const obtenerPlatillos = async () => {
        try {
            const response = await axios.get("/api/publicacionGastronomia");
            setPlatillos(response.data);
        } catch (error) {
            console.error("❌ Error al obtener platillos:", error);
        }
    };

    const obtenerEstadisticas = async () => {
        try {
            const response = await axios.get("/api/publicacionGastronomia/estadisticas/totales");
            setEstadisticas(response.data.estadisticas || {
                total: platillos.length,
                pendientes: platillos.filter(p => p.estadoRevision === "pendiente").length,
                aprobados: platillos.filter(p => p.estadoRevision === "aprobado").length,
                rechazados: platillos.filter(p => p.estadoRevision === "rechazado").length
            });
        } catch (error) {
            setEstadisticas({
                total: platillos.length,
                pendientes: platillos.filter(p => p.estadoRevision === "pendiente").length,
                aprobados: platillos.filter(p => p.estadoRevision === "aprobado").length,
                rechazados: platillos.filter(p => p.estadoRevision === "rechazado").length
            });
        }
    };

    const filtrarPlatillos = () => {
        let filtrados = [...platillos];
        if (filtroActual !== "todos") {
            filtrados = platillos.filter(p => p.estadoRevision === filtroActual);
        }
        setPlatillosFiltrados(filtrados);
    };

    useEffect(() => { obtenerPlatillos(); }, []);
    useEffect(() => { filtrarPlatillos(); obtenerEstadisticas(); }, [platillos, filtroActual]);

    const mostrarToast = (mensaje, bg = "success") => {
        setToast({ show: true, mensaje, bg });
        setTimeout(() => setToast({ show: false, mensaje: "", bg }), 3000);
    };

    const handleAccion = (platillo, tipoAccion) => {
        setPlatilloSeleccionado(platillo);
        setAccion(tipoAccion);
        setMensaje(
            tipoAccion === "aprobar"
                ? `Tu platillo "${platillo.nombre}" ha sido aprobado y publicado exitosamente.`
                : `Tu platillo "${platillo.nombre}" ha sido rechazado. Por favor revisa el motivo.`
        );
        setMotivo("");
        setShowModal(true);
    };

    const enviarNotificacion = async () => {
        if (!platilloSeleccionado) return;
        try {
            setLoading(true);
            if (accion === "aprobar") {
                await axios.put(`/api/publicacionGastronomia/${platilloSeleccionado._id}/aprobar`, { revisadoPor: "admin" });
            } else {
                await axios.put(`/api/publicacionGastronomia/${platilloSeleccionado._id}/rechazar`, {
                    revisadoPor: "admin",
                    motivoRechazo: motivo || "No especificado"
                });
            }
            mostrarToast(`Platillo ${accion === "aprobar" ? "aprobado" : "rechazado"} y notificación enviada`, "success");
            setShowModal(false);
            obtenerPlatillos();
        } catch (error) {
            console.error("❌ Error al realizar la acción:", error);
            mostrarToast("Error al procesar la solicitud", "danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="py-4" style={customStyles.light}>
            {/* Panel de Estadísticas */}
            <Row className="mb-4">
                <Col>
                    <h1 style={{ color: customStyles.primary.backgroundColor }}>
                        <strong>Platillos en Revisión</strong>
                    </h1>
                    <div style={{ width: '80px', height: '4px', backgroundColor: customStyles.secondary.backgroundColor, borderRadius: '2px' }}></div>
                </Col>
            </Row>
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
                                        Todos ({platillos.length})
                                    </Button>
                                    <Button 
                                        variant={filtroActual === "pendiente" ? "warning" : "outline-warning"}
                                        onClick={() => setFiltroActual("pendiente")}
                                        style={filtroActual === "pendiente" ? customStyles.warning : {}}
                                    >
                                        Pendientes ({platillos.filter(p => p.estadoRevision === "pendiente").length})
                                    </Button>
                                    <Button 
                                        variant={filtroActual === "aprobado" ? "success" : "outline-success"}
                                        onClick={() => setFiltroActual("aprobado")}
                                        style={filtroActual === "aprobado" ? customStyles.success : {}}
                                    >
                                        Aprobados ({platillos.filter(p => p.estadoRevision === "aprobado").length})
                                    </Button>
                                    <Button 
                                        variant={filtroActual === "rechazado" ? "danger" : "outline-danger"}
                                        onClick={() => setFiltroActual("rechazado")}
                                        style={filtroActual === "rechazado" ? customStyles.danger : {}}
                                    >
                                        Rechazados ({platillos.filter(p => p.estadoRevision === "rechazado").length})
                                    </Button>
                                </ButtonGroup>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => {
                                        obtenerPlatillos();
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
            {platillosFiltrados.length === 0 ? (
                <Alert variant="info" className="mt-3">
                    {filtroActual === "todos" 
                        ? "No hay platillos en el sistema." 
                        : `No hay platillos ${filtroActual} para mostrar.`
                    }
                </Alert>
            ) : (
                <Card className="shadow-sm">
                    <Card.Body className="p-0">
                        <Table responsive hover className="mb-0">
                            <thead style={customStyles.secondary}>
                                <tr className="text-white">
                                    <th>Platillo</th>
                                    <th>Chef</th>
                                    <th className="text-center">Tipo</th>
                                    <th className="text-center">Estado</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {platillosFiltrados.map((plat) => (
                                    <tr key={plat._id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                {plat.imagen?.[0] && (
                                                    <img 
                                                        src={plat.imagen[0]} 
                                                        alt="" 
                                                        className="rounded me-3" 
                                                        style={{ width: 50, height: 50, objectFit: 'cover' }} 
                                                    />
                                                )}
                                                <div>
                                                    <div className="fw-bold">{plat.nombre}</div>
                                                    <small className="text-muted text-truncate d-block" style={{ maxWidth: 200 }}>
                                                        {plat.descripcion}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="align-middle">{plat.idChef || plat.idUsuario}</td>
                                        <td className="text-center align-middle">{plat.tipoPlatillo || 'N/A'}</td>
                                        <td className="text-center align-middle">
                                            <Badge 
                                                bg={
                                                    plat.estadoRevision === "pendiente" ? "warning" :
                                                    plat.estadoRevision === "aprobado" ? "success" :
                                                    plat.estadoRevision === "rechazado" ? "danger" : "secondary"
                                                }
                                            >
                                                {plat.estadoRevision || "Sin estado"}
                                            </Badge>
                                        </td>
                                        <td className="text-center align-middle">
                                            {plat.estadoRevision === "pendiente" && (
                                                <>
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleAccion(plat, "aprobar")}
                                                        style={customStyles.success}
                                                    >
                                                        <FaCheck /> Aprobar
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleAccion(plat, "rechazar")}
                                                        style={customStyles.danger}
                                                    >
                                                        <FaTimes /> Rechazar
                                                    </Button>
                                                </>
                                            )}
                                            <Button 
                                                size="sm" 
                                                onClick={() => { setPlatilloSeleccionado(plat); setShowDetalleModal(true); }} 
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
            {/* Modal de Detalles del Platillo */}
            <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} size="lg" centered>
                <Modal.Header closeButton style={customStyles.secondary}>
                    <Modal.Title className="text-white">Detalles del Platillo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {platilloSeleccionado && (
                        <>
                            <Row>
                                <Col md={5}>
                                    <Card className="mb-4">
                                        <Card.Header style={customStyles.primary} className="text-white">
                                            Imágenes del Platillo
                                        </Card.Header>
                                        <Card.Body>
                                            {platilloSeleccionado.imagen?.length > 0 ? (
                                                <Row>
                                                    {platilloSeleccionado.imagen.map((img, i) => (
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
                                                    <p>{platilloSeleccionado.nombre}</p>
                                                </Col>
                                                <Col sm={6}>
                                                    <h6 className="text-muted">Tipo</h6>
                                                    <p>{platilloSeleccionado.tipoPlatillo || 'N/A'}</p>
                                                </Col>
                                                <Col sm={6}>
                                                    <h6 className="text-muted">Chef</h6>
                                                    <p>{platilloSeleccionado.idChef || platilloSeleccionado.idUsuario}</p>
                                                </Col>
                                                <Col sm={6}>
                                                    <h6 className="text-muted">Región de Origen</h6>
                                                    <p>{platilloSeleccionado.regionOrigen || 'N/A'}</p>
                                                </Col>
                                                <Col sm={12}>
                                                    <h6 className="text-muted">Estado</h6>
                                                    <Badge 
                                                        bg={
                                                            platilloSeleccionado.estadoRevision === "pendiente" ? "warning" :
                                                            platilloSeleccionado.estadoRevision === "aprobado" ? "success" :
                                                            platilloSeleccionado.estadoRevision === "rechazado" ? "danger" : "secondary"
                                                        }
                                                    >
                                                        {platilloSeleccionado.estadoRevision || "Sin estado"}
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
                                            <p>{platilloSeleccionado.descripcion || 'No disponible'}</p>
                                        </Card.Body>
                                    </Card>
                                    <Row>
                                        <Col md={6}>
                                            <Card className="mb-4">
                                                <Card.Header style={customStyles.primary} className="text-white">
                                                    Ingredientes
                                                </Card.Header>
                                                <Card.Body>
                                                    <p>{Array.isArray(platilloSeleccionado.ingredientes) ? platilloSeleccionado.ingredientes.join(', ') : platilloSeleccionado.ingredientes || 'N/A'}</p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={6}>
                                            <Card className="mb-4">
                                                <Card.Header style={customStyles.primary} className="text-white">
                                                    Consejos para Servir
                                                </Card.Header>
                                                <Card.Body>
                                                    <p>{Array.isArray(platilloSeleccionado.consejosServir) ? platilloSeleccionado.consejosServir.join(', ') : platilloSeleccionado.consejosServir || 'N/A'}</p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <Card className="mb-4">
                                                <Card.Header style={customStyles.primary} className="text-white">
                                                    Receta
                                                </Card.Header>
                                                <Card.Body>
                                                    {platilloSeleccionado.receta && (
                                                        <>
                                                            <h6 className="text-muted">Pasos</h6>
                                                            <ol>
                                                                {platilloSeleccionado.receta.pasos && platilloSeleccionado.receta.pasos.map((paso, idx) => (
                                                                    <li key={idx}>{paso}</li>
                                                                ))}
                                                            </ol>
                                                            <h6 className="text-muted">Tiempo de preparación</h6>
                                                            <p>{platilloSeleccionado.receta.tiempoPreparacionMinutos || 'N/A'} minutos</p>
                                                            <h6 className="text-muted">Tiempo de cocción</h6>
                                                            <p>{platilloSeleccionado.receta.tiempoCoccionHoras || 'N/A'} horas</p>
                                                            <h6 className="text-muted">Porciones</h6>
                                                            <p>{platilloSeleccionado.receta.porciones || 'N/A'}</p>
                                                        </>
                                                    )}
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
                        {accion === "aprobar" ? "Aprobar platillo" : "Rechazar platillo"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="mensaje">
                            <Form.Label>Mensaje para el chef</Form.Label>
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

export default GastronomiaRequests; 