import React, { useEffect, useState } from "react";
import { Container, Button, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

const LessonPageStudent = () => {
    const { courseId, lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await axios.get(`/api/lesson/${lessonId}`);
                setLesson(response.data);
            } catch (error) {
                swal("Error!", "Could not fetch lesson details.", "error");
            }
        };
        fetchLesson();
    }, [lessonId]);

    // Funkcija koja pretvara youtube watch link u embeddable
    const getEmbedUrl = (url) => {
        if (!url) return "";
        if (url.includes("watch?v=")) {
            return url.replace("watch?v=", "embed/");
        }
        return url;
    };

    return (
        <Container className="mt-4">
            <Button variant="secondary" onClick={() => navigate(`/course/${courseId}`)}>
                ← Back to lessons
            </Button>
            <Card className="mt-3 text-dark">
                <Card.Body>
                    {lesson ? (
                        <>
                            <Card.Title>{lesson.title}</Card.Title>
                            <Card.Text>{lesson.description}</Card.Text>

                            {lesson.videoUrl ? (
                                <div className="video-container" style={{ maxWidth: "100%", aspectRatio: "16/9" }}>
                                    <iframe
                                        width="100%"
                                        height="315"
                                        src={getEmbedUrl(lesson.videoUrl)}
                                        title={lesson.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <p><i>No video available</i></p>
                            )}
                        </>
                    ) : (
                        <p>Loading lesson details...</p>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LessonPageStudent;
