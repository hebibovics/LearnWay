import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";

const AdminQuizDetailsPage = () => {
    const { id } = useParams(); // quizId
    const [quiz, setQuiz] = useState(null);

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("jwtToken")?.replace(/^"|"$/g, "");
    const axiosConfig = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

    useEffect(() => {
            const fetchQuizAndQuestions = async () => {
                try {
                    const quizResponse = await axios.get(`/api/quiz/${id}`, axiosConfig);
                    setQuiz(quizResponse.data);

                    const questionsResponse = await axios.get(`/api/question/quiz/${id}`, axiosConfig);
                    setQuestions(questionsResponse.data);

                } catch (err) {
                    setError("Error loading quiz details");
                } finally {
                    setLoading(false);
                }
            };

            fetchQuizAndQuestions();
        }, [id]);

    if (loading) return <Spinner animation="border" />;
    if (error) return <p>{error}</p>;
    if (!quiz) return <p>Quiz not found.</p>;

    return (
        <Container className="mt-4">
            <h2 className="mb-4 text-center">{quiz.title}</h2>
            <Row className="mb-3">
                <Col>
                    <p><strong>Description:</strong> {quiz.description || "No description"}</p>
                    <p><strong>Course:</strong> {quiz.course?.title || "N/A"}</p>
                    <p> <strong>Instructor:</strong>{" "}
                        {quiz.course?.instructor?.firstName || ""}{" "}
                        {quiz.course?.instructor?.lastName || ""}</p>
                </Col>
            </Row>

        </Container>
    );
};

export default AdminQuizDetailsPage;
