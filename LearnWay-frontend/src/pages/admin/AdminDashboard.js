import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Table, Spinner, ProgressBar } from "react-bootstrap";
import axios from "axios";

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [incidents, setIncidents] = useState([]);
    const [topCourses, setTopCourses] = useState([]);
    const [activeUsersTrend, setActiveUsersTrend] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 🔹 API pozivi (ti zamijeni rute prema backendu)
                const statsRes = await axios.get("/api/admin/stats");
                const incidentsRes = await axios.get("/api/admin/incidents");
                const topCoursesRes = await axios.get("/api/admin/top-courses");
                const trendRes = await axios.get("/api/admin/active-users-trend");

                setStats(statsRes.data);
                setIncidents(incidentsRes.data);
                setTopCourses(topCoursesRes.data);
                setActiveUsersTrend(trendRes.data);

                setLoading(false);
            } catch (error) {
                console.error("Greška pri učitavanju podataka:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <Container className="text-center mt-5 text-dark">
                <Spinner animation="border" /> Učitavanje...
            </Container>
        );
    }

    return (
        <Container fluid className="mt-4 text-dark">
            <h2 className="mb-4">📊 Admin Dashboard</h2>

            {/* Gornje kartice */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="shadow-sm text-center text-dark">
                        <Card.Body>
                            <h5>👥 Korisnici</h5>
                            <h3>{stats.users}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="shadow-sm text-center text-dark">
                        <Card.Body>
                            <h5>📚 Kursevi</h5>
                            <h3>{stats.courses}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="shadow-sm text-center text-dark">
                        <Card.Body>
                            <h5>💸 Prihodi</h5>
                            <h3>{stats.revenue} KM</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="shadow-sm text-center text-dark">
                        <Card.Body>
                            <h5>⏱ Uptime</h5>
                            <h3>{stats.uptime}%</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Aktivni korisnici - Progress barovi */}
            <Row className="mb-4">
                <Col md={12}>
                    <Card className="shadow-sm text-dark">
                        <Card.Body>
                            <h5>📈 Aktivni korisnici po danima</h5>
                            {activeUsersTrend.map((t, i) => (
                                <div key={i} className="mb-2">
                                    <strong>{t.date}</strong>
                                    <ProgressBar
                                        now={t.count}
                                        max={stats.maxUsers || 100}
                                        label={`${t.count}`}
                                    />
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Top kursevi */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="shadow-sm text-dark">
                        <Card.Body>
                            <h5>⭐ Top kursevi</h5>
                            {topCourses.map((course, i) => (
                                <div key={i} className="mb-2">
                                    <strong>{course.name}</strong>
                                    <ProgressBar
                                        now={course.rating * 20} // ako rating ide 1-5
                                        label={`Ocjena: ${course.rating}`}
                                    />
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Release notes */}
                <Col md={6}>
                    <Card className="shadow-sm text-dark">
                        <Card.Body>
                            <h5>🔄 Release notes</h5>
                            <ul>
                                <li>V2.1 – Dodani kvizovi (25.09.2025)</li>
                                <li>V2.0 – Certifikati dostupni (01.09.2025)</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Incidenti + SLA */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="shadow-sm text-dark">
                        <Card.Body>
                            <h5>🚨 Incidenti</h5>
                            <Table striped bordered hover className="text-dark">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Opis</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {incidents.map((incident) => (
                                    <tr key={incident.id}>
                                        <td>{incident.id}</td>
                                        <td>{incident.description}</td>
                                        <td>{incident.status}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="shadow-sm text-dark">
                        <Card.Body>
                            <h5>📑 SLA (Service Level Agreement)</h5>
                            <p>Uptime: {stats.uptime}%</p>
                            <p>Prosječno vrijeme rješavanja incidenata: 2h</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Status servisa */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="shadow-sm text-dark">
                        <Card.Body>
                            <h5>⚙️ Status servisa</h5>
                            <ul>
                                <li>Frontend: ✅</li>
                                <li>Backend: ✅</li>
                                <li>Baza: ✅</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Strateški ciljevi */}
                <Col md={6}>
                    <Card className="shadow-sm text-dark">
                        <Card.Body>
                            <h5>🎯 Strateški ciljevi</h5>
                            <ul>
                                <li>500 novih korisnika do kraja godine</li>
                                <li>AI modul do decembra 2025</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Service desk */}
            <Row>
                <Col md={12}>
                    <Card className="shadow-sm text-dark text-center">
                        <Card.Body>
                            <h5>📞 Service Desk</h5>
                            <Button variant="primary">Kontaktiraj podršku</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
