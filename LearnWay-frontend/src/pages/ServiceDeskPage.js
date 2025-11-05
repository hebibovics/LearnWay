import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Form, Row, Col, Alert } from "react-bootstrap";
import swal from "sweetalert";

const ServiceDeskPage = () => {
    const [tickets, setTickets] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Problem");
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId;


    const fetchTickets = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8081/api/tickets/user/${userId}`
            );
            setTickets(res.data);
        } catch (err) {
            console.error(err);
            swal("Error", "Failed to load tickets", "error");
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) {
            swal("Warning", "Please fill in all fields", "warning");
            return;
        }
        if (!userId) {
            swal("Error", "User not logged in", "error");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(
                `http://localhost:8081/api/tickets/${userId}`,
                { title, description, category }
            );
            setTickets([res.data, ...tickets]);
            setTitle("");
            setDescription("");
            setCategory("Problem");
            swal("Success", "Ticket submitted successfully", "success");
        } catch (err) {
            console.error(err);
            swal("Error", "Failed to submit ticket", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Service Desk</h2>

            {!userId && <Alert variant="warning">You must be logged in to submit tickets.</Alert>}




            <Card className="mb-4 shadow-sm" style={{ color: "black" }}>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="ticketTitle">
                                    <Form.Label style={{ color: "black" }}>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        disabled={!userId}
                                        style={{ color: "white" }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="ticketCategory">
                                    <Form.Label style={{ color: "black" }}>Category</Form.Label>
                                    <Form.Select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        disabled={!userId}
                                        style={{ color: "black" }}
                                    >
                                        <option value="Problem">Problem</option>
                                        <option value="Suggestion">Suggestion</option>
                                        <option value="Question">Question</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId="ticketDescription" className="mb-3">
                            <Form.Label style={{ color: "black" }}>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Describe your issue or suggestion"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={!userId}
                                style={{ color: "white" }}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={loading || !userId}>
                            {loading ? "Submitting..." : "Submit Ticket"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>


            <Row>
                {tickets.map((ticket) => (
                    <Col md={4} key={ticket.id} className="mb-3">
                        <Card className="h-100 shadow-sm" style={{ color: "black" }}>
                            <Card.Body>
                                <Card.Title style={{ color: "black" }}>{ticket.title}</Card.Title>
                                <Card.Subtitle style={{ color: "black" }} className="mb-2">
                                    {ticket.category} - {ticket.status}
                                </Card.Subtitle>
                                <Card.Text style={{ color: "black" }}>{ticket.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

        </div>
    );
};

export default ServiceDeskPage;
