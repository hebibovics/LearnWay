import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminQuizzesPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get("/api/quiz/");
                setQuizzes(response.data);
            } catch (error) {
                console.error("Greška pri dohvaćanju kvizova:", error);
            }
        };

        fetchQuizzes();
    }, []);

    const filteredQuizzes = quizzes.filter(
        (quiz) =>
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.course?.instructor?.firstName
                    ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="mt-4">
            <h2 className="mb-4 text-center">All Quizzes</h2>

            <Form className="mb-4">
                <Form.Control
                    type="text"
                    placeholder="Search quiz title, course or instructor"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Form>

            <Row>
                {filteredQuizzes.length > 0 ? (
                    filteredQuizzes.map((quiz) => (
                        <Col md={4} className="mb-4" key={quiz.id}>
                            <Card
                                className="h-100 shadow-sm text-dark"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/adminQuiz/${quiz.quizId}`)}
                            >
                                <Card.Body>
                                    <Card.Title>{quiz.title}</Card.Title>
                                    <Card.Text>
                                        <strong>Kurs:</strong>{" "}
                                        {quiz.course?.title || quiz.course?.name || "N/A"}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Instructor:</strong>{" "}
                                        {quiz.course?.instructor?.firstName || ""}{" "}
                                        {quiz.course?.instructor?.lastName || ""}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="text-center">No available quizzes.</p>
                )}
            </Row>
        </Container>
    );
};

export default AdminQuizzesPage;
