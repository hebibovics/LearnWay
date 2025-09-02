import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, ListGroup, Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import swal from "sweetalert";

const InstructorQuestionsPage = () => {
    const { quizId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = JSON.parse(localStorage.getItem("jwtToken"));

    const fetchQuestions = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/api/question/quiz/${quizId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQuestions(res.data);
        } catch (err) {
            console.error("Greska pri dohvatu pitanjaaaa:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [quizId]);

    const handleDelete = async (questionId) => {
        const confirm = await swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this question!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });

        if (confirm) {
            try {
                await axios.delete(`http://localhost:8081/api/question/${questionId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                swal("Deleted!", "The question has been deleted.", "success");
                setQuestions(
                    questions.filter((q) => {
                        console.log("Question ID u listi:", q.quesId);
                        return q.quesId !== questionId;
                    })
                );

            } catch (err) {
                console.error("Error deleting question:", err);
                swal("Error", "Failed to delete the question.", "error");
            }
        }
    };

    if (loading) return <p>Loading questions...</p>;
    if (questions.length === 0) return <p>No questions for this quiz yet.</p>;

    return (
        <div className="container mt-4">
            <h2>Questions for quiz:</h2>
            {questions.map((q) => (
                <Card className="mb-3 text-dark" key={q.quesId}>
                    <Card.Body className="d-flex justify-content-between align-items-start">

                        <div style={{ flex: 1, marginRight: "10px" }}>
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
                        </div>

                        <div style={{ alignSelf: "flex-start" }}>
                            <Button
                                variant="outline-danger"
                                onClick={() => handleDelete(q.quesId)}
                            >
                                <FaTrash />
                            </Button>
                        </div>
                    </Card.Body>
                </Card>

            ))}
        </div>
    );
};

export default InstructorQuestionsPage;
