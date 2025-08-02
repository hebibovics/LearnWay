import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import swal from "sweetalert";

const InstructorViewQuizzes = () => {
    const { id } = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`http://localhost:8081/api/quiz/course/${id}/quizzes`)
            .then((res) => setQuizzes(res.data))
            .catch((err) => console.error("Error fetching quizzes:", err));
    }, [id]);

    const handleAddQuestion = (quizId) => {
        navigate(`/instructor/quiz/${quizId}/add-questions`);
    };

    const handleEditQuiz = (quizId) => {
        navigate(`/instructor/quiz/${quizId}`);
    };

    const handleDeleteQuiz = (quizId) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this quiz!",
            icon: "warning",
            buttons: ["Cancel", "Delete"],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios
                    .delete(`http://localhost:8081/api/quiz/${quizId}`)
                    .then(() => {
                        setQuizzes(quizzes.filter((q) => q.quizId !== quizId));
                        swal("Deleted!", "The quiz has been deleted successfully.", "success");
                    })
                    .catch((err) => {
                        console.error("Error deleting the quiz:", err);
                        swal("Error", "There was an error deleting the quiz.", "error");
                    });
            }
        });
    };

    return (
        <div className="container mt-4">
            {quizzes.length === 0 ? (
                <p>No quizzes available for this course yet.</p>
            ) : (
                <div className="row">
                    {quizzes.map((quiz) => (
                        <div className="col-md-4 mb-3" key={quiz.quizId}>
                            <div className="card" style={{ color: "black" }}>
                                <div className="card-body">
                                    <h5 className="card-title">{quiz.title}</h5>
                                    <p className="card-text">{quiz.description}</p>
                                    <p className="card-text">
                                        Number of questions: {quiz.numOfQuestions}
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
