import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedInstructor, setSelectedInstructor] = useState("");
    const navigate = useNavigate();

    // Fetch users first
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("jwtToken"));
        axios.get("http://localhost:8081/api/users", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => setUsers(res.data))
            .catch((err) => console.error(err));
    }, []);

    // Fetch courses AFTER users are loaded
    useEffect(() => {
        if (users.length === 0) return;

        axios.get("/api/course/")
            .then((res) => {
                const mappedCourses = res.data.map(course => {
                    if (course.instructor?.userId && !course.instructor.firstName) {
                        const fullInstructor = users.find(u => u.userId === course.instructor.userId);
                        if (fullInstructor) course.instructor = fullInstructor;
                    }
                    return course;
                });
                setCourses(mappedCourses);
            })
            .catch((err) => console.error(err));
    }, [users]);

    const instructors = users.filter(u => u.role?.roleName === "INSTRUCTOR");

    const filteredCourses = courses.filter(course => {
        const matchesTitle = (course.title || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesInstructor =
            selectedInstructor === "" || course.instructor?.userId === parseInt(selectedInstructor);
        return matchesTitle && matchesInstructor;
    });

    const getInstructorName = (course) => {
        if (course.instructor?.firstName) {
            return `${course.instructor.firstName} ${course.instructor.lastName}`;
        }
    };

    if (!users.length || !courses.length) return <p>Loading...</p>;

    return (
        <Container className="mt-4">
            <Form.Control
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3"
            />

            <Form.Select
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="mb-4"
            >
                <option value="">All Instructors</option>
                {instructors.map(inst => (
                    <option key={inst.userId} value={inst.userId}>
                        {inst.firstName} {inst.lastName}
                    </option>
                ))}
            </Form.Select>

            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {filteredCourses.map(course => (
                    <Col key={course.courseId}>
                        <Card
                            className="h-100"
                            onClick={() => navigate(`/admin/course/${course.courseId}`)}
                            style={{ cursor: "pointer", color: "black" }}
                        >
                            {course.imageUrl && <Card.Img variant="top" src={course.imageUrl} />}
                            <Card.Body>
                                <Card.Title>{course.title}</Card.Title>
                                <Card.Text>{course.description?.substring(0, 100)}...</Card.Text>
                                <small className="text-muted">{getInstructorName(course)}</small>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default AdminCoursesPage;
