import React from 'react';
import { Row, Col, Container, Form, InputGroup, Button } from 'react-bootstrap';
import CardHospedaje from './CardHospedaje';
import { FaSearch } from 'react-icons/fa';

const ListaHospedajes = ({ hospedajes, filtroOrden, setFiltroOrden, busqueda, setBusqueda }) => {
    return (
        <Container className="py-4" style={{
            backgroundColor: '#FDF2E0',
            padding: '20px',
            borderRadius: '8px'
        }}>
            <div className="d-flex flex-column flex-md-row justify-content-between mb-4 gap-3">
                <h2 style={{ color: '#9A1E47' }}>Hospedajes en la Huasteca</h2>
                <div className="d-flex gap-2 align-items-center">
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por nombre, ubicación..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            style={{ borderColor: '#1E8546', color: '#9A1E47' }}
                        />
                        <Button variant="outline-secondary" disabled>
                            <FaSearch style={{ color: '#9A1E47' }} />
                        </Button>
                    </InputGroup>
                    <Form.Select
                        style={{
                            width: '200px',
                            borderColor: '#1E8546',
                            color: '#9A1E47',
                            ':focus': {
                                boxShadow: '0 0 0 0.25rem rgba(242, 139, 39, 0.25)'
                            }
                        }}
                        value={filtroOrden}
                        onChange={(e) => setFiltroOrden(e.target.value)}
                    >
                        <option value="">Ordenar por...</option>
                        <option value="categoria">Categoría</option>
                        <option value="precio">Precio</option>
                        <option value="ubicacion">Ubicación</option>
                    </Form.Select>
                </div>
            </div>
            {hospedajes.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#9A1E47',
                    backgroundColor: '#FEF8ED',
                    borderRadius: '8px',
                    border: '1px dashed #9A1E47'
                }}>
                    No se encontraron hospedajes
                </div>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {hospedajes.map((hospedaje) => (
                        <Col key={hospedaje.idHotel}>
                            <CardHospedaje hospedaje={hospedaje} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default ListaHospedajes; 