import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";

const UpdateLessonInstructor = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    const token = localStorage.getItem("jwtToken")?.replace(/^"|"$/g, '');

    useEffect(() => {

        const fetchLesson = async () => {
            try {
                const res = await axios.get(`/api/lesson/${lessonId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTitle(res.data.title);
                setDescription(res.data.description);
                setVideoUrl(res.data.videoUrl || '');
            } catch (err) {
                swal("Error!", "Could not fetch lesson details.", "error");
            }
        };
        fetchLesson();
    }, [lessonId, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
                `/api/lesson/${lessonId}`,
                { title, description },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (videoUrl) {
                await axios.put(
                    `/api/lesson/${lessonId}/video`,
                    videoUrl,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "text/plain"
                        }
                    }
                );
            }

            swal("Updated!", "Lesson updated successfully.", "success")
                .then(() => navigate(`/instructorLessons/${courseId}/${lessonId}`));

        } catch (err) {
            swal("Error!", "Could not update lesson.", "error");
        }
    };

    return (
        <Container>
            <h1 className="my-4 text-center">Update Lesson</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
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
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mt-2">
                    <Form.Label>Video URL</Form.Label>
                    <Form.Control
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                    />
                </Form.Group>

                <Button className="mt-3" type="submit">
                    Update Lesson
                </Button>
            </Form>
        </Container>
    );
};

export default UpdateLessonInstructor;
