import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Button,
    ListGroup,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

const AdminQuizDetailsPage = () => {
    const { id } = useParams(); // quizId
    const navigate = useNavigate();
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

                const questionsResponse = await axios.get(
                    `/api/question/quiz/${id}`,
                    axiosConfig
                );
                setQuestions(questionsResponse.data);
            } catch (err) {
                console.error("Error fetching quiz:", err);
                setError("Error loading quiz details");
            } finally {
                setLoading(false);
            }
        };

        fetchQuizAndQuestions();
    }, [id]);

    const handleDeleteQuiz = () => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, this quiz and all its questions will be permanently removed.",
            icon: "warning",
            buttons: ["Cancel", "Delete"],
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                try {
                    await axios.delete(`/api/quiz/${id}`, axiosConfig);
                    swal("Deleted!", "The quiz has been deleted successfully.", "success");
                    navigate("/admin/quizzes");
                } catch (err) {
                    console.error("Error deleting quiz:", err);
                    swal("Error", "There was an error deleting the quiz.", "error");
                }
            }
        });
    };

    if (loading)
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="light" />
            </div>
        );

    if (error) return <p className="text-danger text-center mt-5">{error}</p>;
    if (!quiz) return <p className="text-center mt-5">Quiz not found.</p>;

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={9}>
                    <Card
                        className="shadow-lg border-0"
                        style={{
                            borderRadius: "15px",
                            backgroundColor: "white",
                            color: "black",
                            padding: "25px",
                        }}
                    >
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h2 className="mb-0">{quiz.title}</h2>
                                <Button variant="danger" onClick={handleDeleteQuiz}>
                                    Delete Quiz
                                </Button>
                            </div>

                            <p className="text-muted">
                                {quiz.description || "No description provided."}
                            </p>

                            <ListGroup variant="flush" className="mb-4">
                                <ListGroup.Item>
                                    <strong>Course:</strong> {quiz.course?.title || "N/A"}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Instructor:</strong>{" "}
                                    {quiz.course?.instructor
                                        ? `${quiz.course.instructor.firstName} ${quiz.course.instructor.lastName}`
                                        : "N/A"}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Total Questions:</strong> {questions.length}
                                </ListGroup.Item>
                            </ListGroup>

                            <h4 className="mt-4 mb-3">Questions</h4>
                            {questions.length === 0 ? (
                                <p>No questions for this quiz yet.</p>
                            ) : (
                                questions.map((q, index) => (
                                    <Card
                                        key={q.quesId}
                                        className="mb-3"
                                        style={{
                                            backgroundColor: "#f9f9f9",
                                            borderRadius: "10px",
                                            border: "1px solid #ddd",
                                        }}
                                    >
                                        <Card.Body>
                                            <h5>
                                                <strong>Q{index + 1}:</strong> {q.content}
                                            </h5>
                                            {q.image && (
                                                <img
                                                    src={q.image}
                                                    alt="Question related"
                                                    style={{
                                                        maxWidth: "100%",
                                                        margin: "10px 0",
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                            )}

                                            <ListGroup>
                                                {["option1", "option2", "option3", "option4"].map(
                                                    (optKey) => {
                                                        const optionText = q[optKey];
                                                        if (!optionText) return null;
                                                        const isCorrect = q.answer === optKey;
                                                        return (
                                                            <ListGroup.Item
                                                                key={optKey}
                                                                style={{
                                                                    backgroundColor: isCorrect
                                                                        ? "#d4edda"
                                                                        : "transparent",
                                                                    fontWeight: isCorrect
                                                                        ? "bold"
                                                                        : "normal",
                                                                }}
                                                            >
                                                                {optionText}{" "}
                                                                {isCorrect && (
                                                                    <span role="img" aria-label="check">
                                                                        ✅
                                                                    </span>
                                                                )}
                                                            </ListGroup.Item>
                                                        );
                                                    }
                                                )}
                                            </ListGroup>
                                        </Card.Body>
                                    </Card>
                                ))
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminQuizDetailsPage;
