import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import "./InstructorAddCoursePage.css";
import SidebarInstructor from "../../../components/SidebarInstructor";
import FormContainer from "../../../components/FormContainer";
import axios from "axios";
import swal from "sweetalert";

const InstructorUpdateCourse = () => {
    const { id } = useParams(); // courseId
    const navigate = useNavigate();

    const [courseData, setCourseData] = useState({
        title: "",
        description: "",
    });

    const token = localStorage.getItem("jwtToken");

    // Dohvati kurs pri učitavanju
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await axios.get(`/api/course/${id}`, {

                });
                setCourseData({
                    title: res.data.title,
                    description: res.data.description,
                });
            } catch (err) {
                console.error("Error fetching course:", err);
                swal("Error", "Failed to fetch course data.", "error");
            }
        };
        fetchCourse();
    }, [id, token]);

    const handleChange = (e) => {
        setCourseData({ ...courseData, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/course/${id}`, courseData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            swal("Success", "Course updated successfully!", "success").then(() => {
                navigate(`/instructorCourse/${id}`);
            });
        } catch (err) {
            console.error("Error updating course:", err);
            swal("Error", "Failed to update course.", "error");
        }
    };

    return (
        <div className="adminAddQuizPage__container">
            <div className="adminAddQuizPage__sidebar">
                <SidebarInstructor />
            </div>
            <div className="adminAddQuizPage__content">
                <FormContainer>
                    <h2>Update Course</h2>
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="my-3" controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Course Title"
                                name="title"
                                value={courseData.title}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="my-3" controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows="3"
                                placeholder="Enter Course Description"
                                name="description"
                                value={courseData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button
                            className="my-5 adminAddQuizPage__content--button"
                            type="submit"
                            variant="primary"
                            style={{
                                backgroundColor: "skyblue",
                                borderColor: "lightskyblue",
                                color: "black",
                            }}
                        >
                            Save Changes
                        </Button>
                    </Form>
                </FormContainer>
            </div>
        </div>
    );
};

export default InstructorUpdateCourse;
