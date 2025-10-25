import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { useSelector } from "react-redux";

const InstructorMessagesPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const loginReducer = useSelector((state) => state.loginReducer);
    const token = localStorage.getItem("jwtToken")?.replace(/^"|"$/g, '');
    const axiosConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    const instructorId = loginReducer?.user?.userId;

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await axios.get(`/api/tickets/instructor/${instructorId}/received`, axiosConfig);
                setTickets(res.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [instructorId]);

    const handleMarkAsRead = async (ticketId) => {
        try {
            await axios.patch(`/api/tickets/${ticketId}/status?status=READ`, axiosConfig);
            setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: "READ" } : t));
            swal("Marked as read!", "This ticket is now marked as read.", "success");
        } catch (err) {
            swal("Error", "Failed to update ticket status.", "error");
        }
    };

    if (loading) return <p>Loading tickets...</p>;
    if (error) return <p>Error loading tickets.</p>;

    const sortedTickets = [...tickets].sort((a, b) => {
        if (a.status === "OPEN" && b.status !== "OPEN") return -1;
        if (a.status !== "OPEN" && b.status === "OPEN") return 1;
        return new Date(b.createdAt) - new Date(a.createdAt); // po datumu unutar iste kategorije
    });

    const extractYouTubeEmbed = (text) => {
        // regex za standardni i embed link
        const regex = /https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
        const match = text.match(regex);
        if (match) {
            return `https://www.youtube.com/embed/${match[4]}`;
        }
        return null;
    };


    return (
        <Container className="mt-4">
            <h2 className="mb-4 text-center">Messages from Admin</h2>
            <Row style={{color: "black"}}>
                {sortedTickets.length ? (
                    sortedTickets.map(ticket => {
                        const videoEmbed = extractYouTubeEmbed(ticket.description);
                        return (
                            <Col key={ticket.id} md={6} className="mb-3">
                                <Card className={`shadow-sm ${ticket.status === "OPEN" ? 'border-primary' : ''}`}>
                                    <Card.Body>
                                        <Card.Title>
                                            {ticket.title}{" "}
                                            {ticket.status === "OPEN" && <Badge bg="danger">New</Badge>}
                                        </Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            Category: {ticket.category} | {new Date(ticket.createdAt).toLocaleString()}
                                        </Card.Subtitle>
                                        <Card.Text style={{ whiteSpace: "pre-line" }}>
                                            {ticket.description}
                                        </Card.Text>

                                        {/* Video preview ako postoji */}
                                        {videoEmbed && (
                                            <div className="ratio ratio-16x9 mb-2">
                                                <iframe
                                                    src={videoEmbed}
                                                    title="Instruction Video"
                                                    allowFullScreen
                                                />
                                            </div>
                                        )}

                                        {ticket.status === "OPEN" && (
                                            <Button variant="primary" size="sm" onClick={() => handleMarkAsRead(ticket.id)}>
                                                Mark as Read
                                            </Button>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })
                ) : (
                    <p>No messages received yet.</p>
                )}
            </Row>
        </Container>
    );
};

export default InstructorMessagesPage;
