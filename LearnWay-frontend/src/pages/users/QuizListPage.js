import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuizListPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/quiz')
            .then(res => {
                setQuizzes(res.data);
                setLoading(false);
            }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) return <Spinner animation="border" />;

    return (
        <div className="container mt-4">
            <h2>Available Quizzes</h2>
            <Row>
                {quizzes.map((quiz) => (
                    <Col md={4} key={quiz.quizId} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{quiz.title}</Card.Title>
                                <Card.Text>{quiz.description?.slice(0, 100)}...</Card.Text>
                                <Card.Text><strong>Questions:</strong> {quiz.numOfQuestions}</Card.Text>
                                <Button onClick={() => navigate(`/quizzes/${quiz.quizId}`)}>View Details</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default QuizListPage;
