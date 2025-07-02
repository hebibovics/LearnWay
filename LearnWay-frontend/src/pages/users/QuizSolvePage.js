import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const QuizSolvePage = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/quiz/${quizId}`)
            .then(res => setQuiz(res.data))
            .catch(err => console.error(err));
    }, [quizId]);

    const handleChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleSubmit = () => {
        axios.post(`/api/quiz/${quizId}/submit`, { answers })
            .then(res => {
                setScore(res.data.score);
                setSubmitted(true);
            })
            .catch(err => console.error(err));
    };

    if (!quiz) return <Spinner animation="border" />;

    return (
        <div className="container mt-4">
            <h2>Solve: {quiz.title}</h2>
            <Form>
                {quiz.questions?.map((q, idx) => (
                    <Form.Group key={q.quesId} className="mb-3">
                        <Form.Label><strong>Q{idx + 1}:</strong> {q.content}</Form.Label>
                        {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => (
                            <Form.Check
                                key={i}
                                type="radio"
                                label={opt}
                                name={`q_${q.quesId}`}
                                value={opt}
                                onChange={() => handleChange(q.quesId, opt)}
                            />
                        ))}
                    </Form.Group>
                ))}
                {!submitted ? (
                    <Button onClick={handleSubmit}>Submit Quiz</Button>
                ) : (
                    <Alert variant="success" className="mt-3">
                        Your score: {score}
                    </Alert>
                )}
            </Form>
        </div>
    );
};

export default QuizSolvePage;
