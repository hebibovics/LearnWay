import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import swal from "sweetalert";

const InstructorViewQuizzes = () => {
    const { id } = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const [quizResults, setQuizResults] = useState({});
    const navigate = useNavigate();

    const token = localStorage.getItem("jwtToken")?.replace(/^"|"$/g, '');

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8081/api/quiz/course/${id}/quizzes`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setQuizzes(res.data);

                // Za svaki quiz, fetchamo sve quizResults
                const resultsRes = await axios.get(
                    `http://localhost:8081/api/quizResult/all`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const results = resultsRes.data;
                const resultsByQuiz = {};

                res.data.forEach((quiz) => {
                    const filtered = results.filter(r => r.quiz.quizId === quiz.quizId);
                    resultsByQuiz[quiz.quizId] = filtered;
                });

                setQuizResults(resultsByQuiz);

            } catch (err) {
                console.error("Error fetching quizzes:", err);
                swal("Error", "Could not fetch quizzes or results.", "error");
            }
        };

        fetchQuizzes();
    }, [id, token]);

    const handleAddQuestion = (quizId) => {
        navigate(`/instructor/quiz/${quizId}/add-questions`);
    };

    const handleDeleteQuiz = (quizId) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this quiz!",
            icon: "warning",
            buttons: ["Cancel", "Delete"],
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                try {
                    await axios.delete(
                        `http://localhost:8081/api/quiz/${quizId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setQuizzes(quizzes.filter((q) => q.quizId !== quizId));
                    swal("Deleted!", "The quiz has been deleted successfully.", "success");
                } catch (err) {
                    console.error("Error deleting the quiz:", err);
                    swal("Error", "There was an error deleting the quiz.", "error");
                }
            }
        });
    };

    return (
        <div className="container mt-4">
            {quizzes.length === 0 ? (
                <p>No quizzes available for this course yet.</p>
            ) : (
                <div className="row">
                    {quizzes.map((quiz) => {
                        const results = quizResults[quiz.quizId] || [];
                        const totalAttempts = results.length;

                        // isti princip kao kod admina
                        const totalQuestions = quiz.questions ? quiz.questions.length : quiz.numOfQuestions || 0;
                        const perfectScore = totalQuestions * 5; // 5 po pitanju
                        const perfectAttempts = results.filter(r =>
                            Math.round(r.totalObtainedMarks * 100) / 100 === perfectScore
                        ).length;

                        const perfectPercent = totalAttempts > 0 ? (perfectAttempts / totalAttempts) * 100 : 0;

                        return (
                            <div className="col-md-4 mb-3" key={quiz.quizId}>
                                <div className="card" style={{ color: "black" }}>
                                    <div className="card-body">
                                        <h5 className="card-title">{quiz.title}</h5>
                                        <p className="card-text">{quiz.description}</p>
                                        <p className="card-text">
                                            Number of questions: {totalQuestions}
                                        </p>

                                        <button
                                            className="btn btn-success btn-sm me-2"
                                            onClick={() => handleAddQuestion(quiz.quizId)}
                                        >
                                            Add Questions
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
                                            Delete
                                        </button>

                                        {/* Progress bar kao kod admina */}
                                        <div className="mt-3">
                                            <p>Total Attempts: {totalAttempts}</p>
                                            <p>Perfect Scores: {perfectAttempts}</p>
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
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>
            )}
        </div>
    );
};

export default InstructorViewQuizzes;
