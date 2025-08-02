import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, ListGroup } from "react-bootstrap";

const InstructorQuestionsPage = () => {
    const { quizId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("jwtToken"));

        axios
            .get(`http://localhost:8081/api/question/quiz/${quizId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setQuestions(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Greška pri dohvatu pitanja:", err);
                setLoading(false);
            });
    }, [quizId]);

    if (loading) {
        return <p>Loading questions...</p>;
    }

    if (questions.length === 0) {
        return <p>No questions for this quiz yet.</p>;
    }

    return (
        <div className="container mt-4">
            <h2>Pitanja za kviz #{quizId}</h2>
            {questions.map((q) => (
                <Card className="mb-3" key={q.quesId} className="text-dark">
                    <Card.Body>
                        <Card.Title>{q.content}</Card.Title>
                        {q.image && (
                            <img
                                src={q.image}
                                alt="Question related"
                                style={{ maxWidth: "100%", marginBottom: "10px" }}
                            />
                        )}

                        <ListGroup>
                            {["option1", "option2", "option3", "option4"].map((optKey) => {
                                const optionText = q[optKey];
                                if (!optionText) return null;
                                const isCorrect = q.answer === optKey;
                                return (
                                    <ListGroup.Item
                                        key={optKey}
                                        style={{
                                            fontWeight: isCorrect ? "bold" : "normal",
                                            backgroundColor: isCorrect ? "#d4edda" : "transparent",
                                        }}
                                    >
                                        {optionText} {isCorrect && <span>✅</span>}
                                    </ListGroup.Item>
                                );
                            })}
                        </ListGroup>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default InstructorQuestionsPage;
