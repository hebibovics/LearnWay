import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import swal from 'sweetalert';

const InstructorAddQuiz = () => {
    const { id  } = useParams(); // courseId iz URL-a

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
            <h2>Add quiz for the course</h2>
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
        </div>
    );
};

export default InstructorAddQuiz;
