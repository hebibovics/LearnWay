// src/pages/InstructorViewQuizzes.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const InstructorViewQuizzes = () => {
    const { id } = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/quiz/course/${id}/quizzes`)
            .then((res) => setQuizzes(res.data))
            .catch((err) => console.error("Greška pri dohvatu kvizova:", err));
    }, [id]);

    const handleAddQuestion = (quizId) => {
        navigate(`/instructor/quiz/${quizId}/add-questions`);
    };

    const handleEditQuiz = (quizId) => {
        navigate(`/instructor/quiz/${quizId}`);
    };

    const handleDeleteQuiz = (quizId) => {
        if (window.confirm("Da li si siguran/na da želiš obrisati kviz?")) {
            axios
                .delete(`http://localhost:8081/api/quiz/${quizId}`)
                .then(() => {
                    setQuizzes(quizzes.filter((q) => q.quizId !== quizId));
                    alert("Kviz je uspješno obrisan.");
                })
                .catch((err) => {
                    console.error("Greška pri brisanju kviza:", err);
                    alert("Došlo je do greške.");
                });
        }
    };

    return (
        <div className="container mt-4">

            {quizzes.length === 0 ? (
                <p>Nema kvizova za ovaj kurs.</p>
            ) : (
                <div className="row">
                    {quizzes.map((quiz) => (
                        <div className="col-md-4 mb-3" key={quiz.quizId}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{quiz.title}</h5>
                                    <p className="card-text">{quiz.description}</p>
                                    <p className="card-text">
                                        Broj pitanja: {quiz.numOfQuestions}
                                    </p>
                                    <p className="card-text">
                                        Status:{" "}
                                        <span className={quiz.iActive ? "text-success" : "text-danger"}>
                      {quiz.iActive ? "Aktivan" : "Neaktivan"}
                    </span>
                                    </p>
                                    <button
                                        className="btn btn-success btn-sm me-2"
                                        onClick={() => handleAddQuestion(quiz.quizId)}
                                    >
                                        Dodaj pitanja
                                    </button>

                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => navigate(`/instructor/quiz/${quiz.quizId}/questions`)}
                                    >
                                        View Questions
                                    </button>


                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteQuiz(quiz.quizId)}
                                    >
                                        Obriši
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InstructorViewQuizzes;
