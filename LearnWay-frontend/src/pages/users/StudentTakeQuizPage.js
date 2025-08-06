import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, Button, Form } from "react-bootstrap";
import swal from "sweetalert";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const StudentTakeQuizPage = () => {
    const { quizId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState({ correct: 0, total: 0 });
    const [courseTitle, setCourseTitle] = useState("");

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

    useEffect(() => {
        const fetchCourseTitle = async () => {
            try {
                const response = await axios.get(`/api/quiz/${quizId}`);
                setCourseTitle(response.data.course?.title || response.data.title || "");
            } catch (error) {
                console.error("Error fetching course title:", error);
            }
        };
        fetchCourseTitle();
    }, [quizId]);

    const user = JSON.parse(localStorage.getItem("user"));
    const studentName = user ? `${user.firstName} ${user.lastName}` : "Student";
    const todayDate = new Date().toLocaleDateString();

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

        axios.post(`/api/quizResult/submit`, answers, {
            params: { userId: user.userId, quizId: quizId },
        })
            .then(res => {
                console.log("Saved result:", res.data);
            })
            .catch(err => {
                console.error("Error saving quiz result:", err);
            });

        swal(
            "Quiz submitted!",
            `You scored ${correct} out of ${questions.length} points.`,
            "success"
        );
    };

    const downloadCertificate = async () => {
        const cert = document.getElementById("certificate");
        if (!cert) return;

        cert.style.display = "block";
        await new Promise((resolve) => setTimeout(resolve, 100));

        const canvas = await html2canvas(cert);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("certificate.pdf");

        cert.style.display = "none";
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

            {submitted && result.correct === result.total && (
                <div className="text-center mt-4">
                    <Button onClick={downloadCertificate} variant="outline-primary">
                        🏆 Download Certificate
                    </Button>

                    {/* Hidden certificate for PDF generation */}
                    <div
                        id="certificate"
                        style={{
                            width: "595px", // A4 širina u px @ 72dpi
                            minHeight: "842px", // A4 visina u px @ 72dpi
                            boxSizing: "border-box",
                            display: "none",
                            padding: "40px",
                            backgroundColor: "white",
                            color: "black",
                            textAlign: "center",
                            fontFamily: "Georgia, serif",
                        }}
                    >
                        <h1 style={{ marginBottom: "20px" }}>🎓 Certificate of Completion</h1>
                        <p>This certifies that</p>
                        <h2>{studentName}</h2>
                        <p>has successfully completed the course</p>
                        <h3>{courseTitle}</h3>
                        <p>Date: {todayDate}</p>
                        <p style={{ marginTop: "40px" }}>__________________________</p>
                        <p>LearnWay</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentTakeQuizPage;
