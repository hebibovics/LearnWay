import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import swal from 'sweetalert';
import { FaQuestionCircle } from "react-icons/fa"; // ikonica upitnika

const InstructorAddQuiz = () => {
    const { id } = useParams(); // courseId iz URL-a

    const token = localStorage.getItem("jwtToken")?.replace(/^"|"$/g, '');

    const [quizData, setQuizData] = useState({
        title: "",
        description: "",
        numOfQuestions: 0,
        iActive: true,
        course: {
            courseId: parseInt(id)
        }
    });

    const [createdQuizId, setCreatedQuizId] = useState(null);
    const [showInfo, setShowInfo] = useState(false); // za modal

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuizData({ ...quizData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:8081/api/quiz/",
                quizData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setCreatedQuizId(res.data.quizId);
            swal({
                title: "Success!",
                text: "Quiz has been added successfully.",
                icon: "success",
                button: "OK",
            });
        } catch (error) {
            console.error("Error adding quiz:", error);
            swal({
                title: "Error!",
                text: "There was a problem adding the quiz.",
                icon: "error",
                button: "OK",
            });
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex align-items-center mb-3">
                <h2 className="me-2">Add quiz for the course</h2>
                <FaQuestionCircle
                    size={22}
                    style={{ cursor: "pointer", color: "#0d6efd" }}
                    onClick={() => setShowInfo(true)}
                />
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Quiz title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={quizData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        rows="3"
                        value={quizData.description}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary me-2">Add Quiz</button>
            </form>

            {/* Modal */}
            {showInfo && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header text-dark">
                                <h5 className="modal-title">Quiz Information</h5>
                                <button type="button" className="btn-close" onClick={() => setShowInfo(false)}></button>
                            </div>
                            <div className="modal-body text-dark">
                                <p>
                                    Here you only add a quiz with its <b>title</b> and optionally a <b>description</b>.
                                    Questions will be added later – go to <i>View Quizzes</i> and choose the option
                                    <b> Add Question</b> for this quiz.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowInfo(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showInfo && <div className="modal-backdrop fade show"></div>}

        </div>
    );
};

export default InstructorAddQuiz;
