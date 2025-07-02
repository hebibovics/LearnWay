import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const InstructorAddQuiz = () => {
    const navigate = useNavigate();
    const { id  } = useParams(); // courseId iz URL-a

    const [quizData, setQuizData] = useState({
        title: "",
        description: "",
        numOfQuestions: 0,
        iActive: true,
        course: {
            courseId: parseInt(id) // odmah postavi kurs
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
            const res = await axios.post("http://localhost:8081/api/quiz/", quizData);
            setCreatedQuizId(res.data.quizId);
            alert("Kviz je uspješno dodan!");
        } catch (error) {
            console.error("Greška pri dodavanju kviza:", error);
            alert("Greška pri dodavanju kviza.");
        }
    };


    return (
        <div className="container mt-4">
            <h2>Dodaj kviz za kurs</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Naziv kviza</label>
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
                    <label>Opis</label>
                    <textarea
                        className="form-control"
                        name="description"
                        rows="3"
                        value={quizData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label>Broj pitanja</label>
                    <input
                        type="number"
                        className="form-control"
                        name="numOfQuestions"
                        value={quizData.numOfQuestions}
                        onChange={handleChange}
                        min={0}
                    />
                </div>

                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="iActive"
                        checked={quizData.iActive}
                        onChange={(e) =>
                            setQuizData({ ...quizData, iActive: e.target.checked })
                        }
                    />
                    <label className="form-check-label">Aktivan</label>
                </div>

                <button type="submit" className="btn btn-primary me-2">Dodaj kviz</button>

            </form>
        </div>
    );
};

export default InstructorAddQuiz;
