import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminQuizzesPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const token = localStorage.getItem("jwtToken")?.replace(/^"|"$/g, '');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get("/api/quizResult/all", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Grupisanje po kvizu
                const quizMap = {};
                response.data.forEach(r => {
                    const qId = r.quiz.quizId;
                    if (!quizMap[qId]) {
                        quizMap[qId] = {
                            quiz: r.quiz,
                            totalAttempts: 0,
                            perfectAttempts: 0,
                            totalQuestions: r.quiz.questions ? r.quiz.questions.length : 0
                        };
                    }

                    quizMap[qId].totalAttempts += 1;

                    const totalQuestions = r.quiz.questions ? r.quiz.questions.length : 0;
                    const perfectScore = totalQuestions * 5; // 5 po pitanju
                    if (Math.round(r.totalObtainedMarks * 100) / 100 === perfectScore) {
                        quizMap[qId].perfectAttempts += 1;
                    }
                });

                setQuizzes(Object.values(quizMap));
            } catch (err) {
                console.error("Error fetching quizzes:", err);
            }
        };

        fetchQuizzes();
    }, [token]);

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4" style={{ color: "white" }}>Admin Quizzes Overview</h2>
            <Row xs={1} md={2} lg={3} className="g-4">
                {quizzes.map(({ quiz, totalAttempts, perfectAttempts }) => {
                    const perfectPercent = totalAttempts > 0 ? (perfectAttempts / totalAttempts) * 100 : 0;

                    return (
                        <Col key={quiz.quizId}>
                            <Card
                                bg="white"
                                text="dark"
                                onClick={() => navigate(`/adminQuiz/${quiz.quizId}`)}
                                style={{
                                    cursor: "pointer",
                                    transition: "transform 0.2s ease, box-shadow 0.2s ease"
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = "scale(1.03)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                <Card.Body>
                                    <Card.Title>{quiz.title}</Card.Title>
                                    <Card.Text>
                                        Total Attempts: {totalAttempts} <br />
                                        Perfect Scores: {perfectAttempts}
                                    </Card.Text>

                                    <div style={{
                                        height: '25px',
                                        width: '100%',
                                        borderRadius: '5px',
                                        backgroundColor: 'lightskyblue',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${perfectPercent}%`,
                                            backgroundColor: '#1b263b',
                                            textAlign: 'center',
                                            color: 'white',
                                            lineHeight: '25px',
                                            fontSize: '1rem'
                                        }}>
                                            {Math.round(perfectPercent)}%
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </Container>
    );
};

export default AdminQuizzesPage;
