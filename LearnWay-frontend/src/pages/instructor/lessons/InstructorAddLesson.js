import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Form } from "react-bootstrap";
import "../courses/InstructorAddCoursePage.css";
    import swal from "sweetalert";
    import addLesson from "../../../services/lessonsServices";
import lessonsService from "../../../services/lessonsServices"; // Import as default export


const InstructorAddLesson = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    // Assuming you have a way to retrieve the token (e.g., from Redux or localStorage)
    const token = JSON.parse(localStorage.getItem("jwtToken")); // Koristi pravi ključ "jwtToken"

    const handleSubmit = async (e) => {
        e.preventDefault();

        const lesson = { title, description }; // Prepare the lesson object to be added
        console.log("Submitting lesson:", lesson, id, token); // Log the values

        try {
            const response = await lessonsService.addLesson(lesson, id, token); // Send request with correct token
            console.log("addLesson response:", response); // Log the response

            if (response.isAdded) {
                swal("Success!", "Lesson has been added successfully.", "success")
                    .then(() => navigate(`/instructorLessons/${id}`)); // Redirect after successful addition
            } else {
                swal("Error!", `Error: ${response.error}`, "error");
            }
        } catch (err) {
            console.error("Error occurred:", err); // Log error if catch block is triggered
            swal("Error!", "There was an error adding the lesson.", "error");
        }
    };



    return (
        <Container>
            <h1 className="my-4 text-center">Add Lesson</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formLessonTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter lesson title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formLessonDescription" className="mt-3">
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
                <Button variant="primary" type="submit" className="mt-3">
                    Add Lesson
                </Button>
            </Form>
        </Container>
    );
};

export default InstructorAddLesson;
