import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Form } from "react-bootstrap";
import swal from "sweetalert";
import axios from "axios";

const InstructorAddLesson = () => {
    const { id } = useParams(); // courseId
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    const token = JSON.parse(localStorage.getItem("jwtToken"));

    const handleSubmit = async (e) => {
        e.preventDefault();

        const lesson = { title, description };

        try {
            // 1) ADD LESSON
            const response = await axios.post(
                `http://localhost:8081/api/lesson/api/lesson/${id}`,
                lesson,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const createdLesson = response.data; // ovdje dobijes lessonId

            // 2) UPDATE VIDEO URL (ako je uneseno)
            if (videoUrl.trim() !== "") {
                await axios.put(
                    `http://localhost:8081/api/lesson/${createdLesson.lessonId}/video`,
                    videoUrl,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "text/plain"
                        }
                    }
                );
            }

            swal("Success!", "Lesson added successfully.", "success")
                .then(() => navigate(`/courseInstructor/${id}`));

        } catch (err) {
            console.error(err);
            swal("Error!", "There was an error adding the lesson.", "error");
        }
    };

    return (
        <Container>
            <h1 className="my-4 text-center">Add Lesson</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter lesson title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter lesson description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Video URL (optional)</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="https://youtube.com/watch?v=..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Add Lesson
                </Button>
            </Form>
        </Container>
    );
};

export default InstructorAddLesson;
