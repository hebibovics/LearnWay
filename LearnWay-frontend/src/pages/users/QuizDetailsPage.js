import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const QuizDetailsPage = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/quiz/${quizId}`)
            .then(res => setQuiz(res.data))
            .catch(err => console.error(err));
    }, [quizId]);

    if (!quiz) return <Spinner animation="border" />;

    return (
        <div className="container mt-4">
            <h2>{quiz.title}</h2>
            <p>{quiz.description}</p>
            <h5>Questions:</h5>
            {quiz.questions?.map((q, idx) => (
                <Card key={q.quesId} className="mb-2">
                    <Card.Body>
                        <Card.Title>Q{idx + 1}: {q.content}</Card.Title>
                        <ul>
                            {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => (
                                <li key={i}>{opt}</li>
                            ))}
                        </ul>
                    </Card.Body>
                </Card>
            ))}
            <Button className="mt-3" onClick={() => navigate(`/quizzes/${quizId}/solve`)}>
                Solve Quiz
            </Button>
        </div>
    );
};

export default QuizDetailsPage;
