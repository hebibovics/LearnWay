// src/pages/student/StudentTakeQuizPage.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, Button, Form } from "react-bootstrap";
import swal from "sweetalert";

const StudentTakeQuizPage = () => {
    const { quizId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { quesId: 'option1' }
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState({ correct: 0, total: 0 });

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`/api/question/quiz/${quizId}`);
                setQuestions(response.data);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [quizId]);

    const handleOptionChange = (quesId, optLabel) => {
        setAnswers((prev) => ({ ...prev, [quesId]: optLabel }));
    };

    const handleSubmit = () => {
        let correct = 0;
        questions.forEach((q) => {
            if (answers[q.quesId] === q.answer) {
                correct++;
            }
        });

        setResult({ correct, total: questions.length });
        setSubmitted(true);

        swal(
            "Quiz submitted!",
            `You scored ${correct} out of ${questions.length} points.`,
            "success"
        );
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">Take Quiz</h2>

            {questions.map((q, index) => (
                <Card className="mb-4 shadow-sm text-dark" key={q.quesId}>
                    <Card.Body>
                        <Card.Title>
                            {index + 1}. {q.content}
                        </Card.Title>
                        <Form>
                            {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => {
                                const optLabel = `option${i + 1}`;
                                const isCorrect = submitted && q.answer === optLabel;
                                const isSelected = answers[q.quesId] === optLabel;

                                return (
                                    <Form.Check
                                        key={optLabel}
                                        type="radio"
                                        name={`question-${q.quesId}`}
                                        label={
                                            submitted
                                                ? `${opt}${isCorrect ? " ✔️" : isSelected ? " ❌" : ""}`
                                                : opt
                                        }
                                        value={optLabel}
                                        checked={isSelected}
                                        onChange={() => handleOptionChange(q.quesId, optLabel)}
                                        disabled={submitted}
                                    />
                                );
                            })}
                        </Form>
                    </Card.Body>
                </Card>
            ))}

            {!submitted && (
                <div className="text-center">
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit Quiz
                    </Button>
                </div>
            )}

            {submitted && (
                <div className="text-center mt-4">
                    <h4>
                        Your Score: {result.correct} / {result.total}
                    </h4>
                </div>
            )}
        </div>
    );
};

export default StudentTakeQuizPage;
