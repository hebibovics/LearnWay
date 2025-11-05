import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Button } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const StudentQuizResultsPage = () => {
    const [results, setResults] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem("jwtToken")?.replace(/^"|"$/g, '');

                const response = await axios.get(`/api/quizResult/`, {
                    params: { userId: user.userId },
                    headers: { Authorization: `Bearer ${token}` },
                });

                const resultsWithTotalQuestions = await Promise.all(
                    response.data.map(async (r) => {
                        try {
                            const questionRes = await axios.get(
                                `/api/question/quiz/${r.quiz.quizId}`,
                                {
                                    headers: { Authorization: `Bearer ${token}` },
                                }
                            );
                            const totalQuestions = questionRes.data?.length || 0;
                            return { ...r, totalQuestions };
                        } catch (e) {
                            return { ...r, totalQuestions: 0 };
                        }
                    })
                );

                setResults(resultsWithTotalQuestions);
            } catch (err) {
                console.error("Error fetching results:", err);
            }
        };

        fetchResults();
    }, [user.userId]);

    const downloadCertificate = async (quizResId) => {
        const cert = document.getElementById(`certificate-${quizResId}`);
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


    const getProgressColor = (percentage) => {
        if (percentage >= 80) return "bg-success";
        if (percentage >= 50) return "bg-warning";
        return "bg-danger";
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4" style={{ color: "white" }}>
                My Quiz Results
            </h2>

            <Table bordered style={{ backgroundColor: "#1b263b", color: "white" }}>
                <thead>
                <tr style={{ fontWeight: "bold", color: "white" }}>
                    <th>#</th>
                    <th>Quiz Title</th>
                    <th>Date & Time</th>
                    <th>Score</th>
                    <th>Certificate</th>
                </tr>
                </thead>
                <tbody>
                {results.map((res, index) => {
                    const correctCount = res.totalObtainedMarks / 5;
                    const percentage = (correctCount / res.totalQuestions) * 100;

                    return (
                        <tr key={res.quizResId}>
                            <td>{index + 1}</td>
                            <td>{res.quiz?.title || "-"}</td>
                            <td>{new Date(res.attemptDatetime).toLocaleString()}</td>
                            <td>
                                <div style={{ minWidth: "120px" }}>
                                    <div>{correctCount}/{res.totalQuestions}</div>
                                    <div className="progress" style={{ height: "10px" }}>
                                        <div
                                            className={`progress-bar ${getProgressColor(percentage)}`}
                                            role="progressbar"
                                            style={{ width: `${percentage}%` }}
                                            aria-valuenow={correctCount}
                                            aria-valuemin="0"
                                            aria-valuemax={res.totalQuestions}
                                        ></div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                {correctCount === res.totalQuestions && (
                                    <>
                                        <Button
                                            variant="outline-light"
                                            size="sm"
                                            onClick={() => downloadCertificate(res.quizResId)}
                                        >
                                            🏆 Download
                                        </Button>

                                        {/* Hidden certificate for PDF */}
                                        <div
                                            id={`certificate-${res.quizResId}`}
                                            style={{
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
                                            <h2>{user.firstName} {user.lastName}</h2>
                                            <p>has successfully completed the quiz</p>
                                            <h3>{res.quiz?.title}</h3>
                                            <p>Date: {new Date(res.attemptDatetime).toLocaleDateString()}</p>
                                            <p style={{ marginTop: "40px" }}>__________________________</p>
                                            <p>LearnWay</p>
                                        </div>
                                    </>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </Table>
        </Container>
    );
};

export default StudentQuizResultsPage;
