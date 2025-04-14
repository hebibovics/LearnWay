// LessonPageInstructor.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Card } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";

const LessonPageInstructor = () => {
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
                await axios.delete(`/api/lesson/${lessonId}`);
                swal("Deleted!", "Lesson has been deleted.", "success");
                navigate(`/instructorLessons`);
            } catch (error) {
                swal("Error!", "Could not delete lesson.", "error");
            }
        }
    };



    return (
        <Container className="mt-4">
            <Card>
                <Card.Body>
                    {lesson ? (
                        <>
                            <Card.Title>{lesson.title}</Card.Title>

                            <Card.Text>{lesson.description}</Card.Text>
                            <Button variant="danger" onClick={handleDelete}>
                                Delete Lesson
                            </Button>
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
