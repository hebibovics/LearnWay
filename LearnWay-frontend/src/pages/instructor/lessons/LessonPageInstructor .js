import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Card } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";

const LessonPageInstructor = () => {
    const { courseId, lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("jwtToken")?.replace(/^"|"$/g, '');

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const res = await axios.get(`/api/lesson/${lessonId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLesson(res.data);
            } catch (err) {
                swal("Error!", "Could not fetch lesson details.", "error");
            }
        };
        fetchLesson();
    }, [lessonId, token]);

    const handleDelete = async () => {
        const confirm = await swal({
            title: "Are you sure?",
            text: "You won't be able to recover this lesson!",
            icon: "warning",
            buttons: ["Cancel", "Delete"],
            dangerMode: true,
        });
        if (confirm) {
            try {
                await axios.delete(`/api/lesson/${lessonId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                swal("Deleted!", "Lesson has been deleted.", "success");
                navigate(`/instructorLessons/${courseId}`);
            } catch (err) {
                swal("Error!", "Could not delete lesson.", "error");
            }
        }
    };

    return (
        <Container className="mt-4">
            <Card className="text-dark">
                <Card.Body>
                    {lesson ? (
                        <>
                            <Card.Title>{lesson.title}</Card.Title>
                            <Card.Text>{lesson.description}</Card.Text>

                            {lesson.videoUrl && (
                                <Card.Text>
                                    Video:{" "}
                                    <a
                                        href={lesson.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: "blue", textDecoration: "underline" }}
                                    >
                                        {lesson.videoUrl}
                                    </a>
                                </Card.Text>
                            )}

                            <div className="d-flex gap-2">
                                <Button
                                    variant="warning"
                                    onClick={() => navigate(`/updateLesson/${courseId}/${lessonId}`)}
                                >
                                    Update Lesson
                                </Button>
                                <Button variant="danger" onClick={handleDelete}>
                                    Delete Lesson
                                </Button>
                            </div>
                        </>
                    ) : (
                        <p>Loading lesson details...</p>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LessonPageInstructor;
