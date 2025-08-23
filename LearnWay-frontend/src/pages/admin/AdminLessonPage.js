// src/pages/AdminLessonPage.js
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

const AdminLessonPage = () => {
    const { id } = useParams(); // lessonId
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);

    useEffect(() => {
        fetchLesson();
    }, [id]);

    const fetchLesson = async () => {
        try {
            const response = await axios.get(`/api/lesson/${id}`);
            setLesson(response.data);
        } catch (error) {
            console.error("Error fetching lesson:", error);
            swal("Error", "Failed to load lesson details.", "error");
        }
    };

    const handleDelete = async () => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this lesson!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                try {
                    await axios.delete(`/api/lesson/${id}`);
                    swal("Success", "Lesson has been deleted!", "success");
                    navigate(-1); // vrati na prethodnu stranicu (AdminCourseDetailsPage)
                } catch (error) {
                    console.error("Error deleting lesson:", error);
                    swal("Error", "Failed to delete lesson.", "error");
                }
            }
        });
    };

    if (!lesson) {
        return (
            <Container className="mt-4">
                <p>Loading lesson...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="mb-3 text-dark">
                        <Card.Body>
                            <Card.Title>{lesson.title}</Card.Title>
                            <Card.Text>{lesson.description}</Card.Text>

                            {lesson.videoUrl && (
                                <div className="mb-3">
                                    {lesson.videoUrl.includes("youtube.com") || lesson.videoUrl.includes("youtu.be") ? (
                                        <div className="ratio ratio-16x9">
                                            <iframe
                                                src={
                                                    lesson.videoUrl.includes("watch?v=")
                                                        ? lesson.videoUrl.replace("watch?v=", "embed/")
                                                        : lesson.videoUrl.replace("youtu.be/", "www.youtube.com/embed/")
                                                }
                                                title="Lesson Video"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    ) : (
                                        <video width="100%" height="400" controls>
                                            <source src={lesson.videoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>
                            )}



                            <Button variant="danger" onClick={handleDelete}>
                                Delete Lesson
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminLessonPage;
