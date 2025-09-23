import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Card, Button, Row, Col } from "react-bootstrap";
import { FaQuestionCircle } from "react-icons/fa";

const StudentQuizzesPage = () => {
    const { id } = useParams(); // id kursa
    const [quizzes, setQuizzes] = useState([]);
    const [showInfo, setShowInfo] = useState(false); // za modal

    const token = localStorage.getItem("jwtToken")?.replace(/^"|"$/g, '');

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(`/api/quiz/course/${id}/quizzes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuizzes(response.data);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            }
        };
        fetchQuizzes();
    }, [id, token]);

    return (
        <div className="container mt-4">
            {/* Naslov + upitnik */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                <h2 className="me-2">Available Quizzes</h2>
                <FaQuestionCircle
                    size={22}
                    style={{ cursor: "pointer", color: "#0d6efd" }}
                    onClick={() => setShowInfo(true)}
                />
            </div>

            {quizzes.length === 0 ? (
                <p className="text-center">No quizzes available for this course.</p>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {quizzes.map((quiz) => (
                        <Col key={quiz.quizId}>
                            <Card className="h-100 shadow-sm text-dark">
                                <Card.Body>
                                    <Card.Title>{quiz.title || "Untitled Quiz"}</Card.Title>
                                    <Card.Text>
                                        {quiz.description || "No description provided."}
                                    </Card.Text>
                                    <Link to={`/studentTakeQuiz/${quiz.quizId}`}>
                                        <Button variant="success">Take Quiz</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Modal s uputama */}
            {showInfo && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header text-dark">
                                <h5 className="modal-title text-dark">Quiz Information</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowInfo(false)}
                                ></button>
                            </div>
                            <div className="modal-body text-dark">
                                <p>
                                    Each quiz can be attempted multiple times. Every attempt is stored in the database,
                                    so your progress can be tracked. Questions are of <b>multiple choice</b> type with
                                    <b> one correct answer</b>. Once you complete a quiz successfully, you can earn a certificate.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowInfo(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showInfo && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default StudentQuizzesPage;
