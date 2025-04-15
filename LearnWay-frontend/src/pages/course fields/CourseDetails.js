import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import axios from 'axios';


const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const loginReducer = useSelector((state) => state.loginReducer);
    const [userRole, setUserRole] = useState("");



    useEffect(() => {
        if (course) {
            localStorage.setItem('courseId', course.id); // Store courseId in localStorage
            console.log("ovaj id sada ", course.id);
        }
    }, [course]);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`/api/course/${id}`);
                setCourse(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
        if (localStorage.getItem("jwtToken")) {
            let role = "";
            loginReducer.user.roles.forEach((r) => {
                if (r["roleName"] === "INSTRUCTOR") {
                    role = "INSTRUCTOR";
                } else {
                    role = "USER"; // Student
                }
            });
            setUserRole(role);
        }

    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading course details.</p>;
    if (!course) return <p>Course not found</p>;

    return (
        <Container>
            <h1 className="my-4 text-center">Course Details</h1>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h3>Course Name: {course.title}</h3>
                    <p><b>Description:</b>  </p>
                    <p> {course.description}</p>
                    <p>Number of Lessons: {course.lessons?.length || 0}</p>
                    {/*<p>Lessons: {course.lessons}</p>
                    <p>Grade: {course.rate}</p>*/}
                    {userRole === "USER" && (
                        <Button variant="outline-primary" className="mt-3">
                            Enroll
                        </Button>
                    )}



                </Col>
            </Row>
        </Container>
    );
};

export default CourseDetails;
