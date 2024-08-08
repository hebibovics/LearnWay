import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Form } from "react-bootstrap";
import "../courses/InstructorAddCoursePage.css";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import SidebarInstructor from "../../../components/SidebarInstructor";
import FormContainer from "../../../components/FormContainer";
import * as lessonsConstants from "../../../constants/lessonsConstants";
import { addLesson} from "../../../actions/lessonsActions";
import { fetchLessons } from "../../../actions/lessonsActions";
import axios from 'axios';
import data from "bootstrap/js/src/dom/data";

const InstructorAddLesson = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("this" + title, description, id);
            await axios.post(`/api/lesson/?courseId=${id}`, { title, description, course: { courseId: id } });
            console.log("this" + title, description, id);
            swal("Success!", "Lesson has been added successfully.", "success")
                .then(() => navigate(`/instructorLessons/${id}`)); // Preusmjeravanjrontee na listu lekcija nakon uspješnog dodavanja
        } catch (err) {
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
