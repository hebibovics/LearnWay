// src/pages/student/StudentQuizzesPage.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Card, Button, Row, Col } from "react-bootstrap";

const StudentQuizzesPage = () => {
    const { id } = useParams(); // id kursa
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(`/api/quiz/course/${id}/quizzes`);
                setQuizzes(response.data);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            }
        };

        fetchQuizzes();
    }, [id]);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Available Quizzes</h2>
            {quizzes.length === 0 ? (
                <p className="text-center">No quizzes available for this course.</p>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {quizzes.map((quiz) => (
                        <Col key={quiz.id}>
                            <Card className="h-100 shadow-sm">
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
        </div>
    );
};

export default StudentQuizzesPage;
