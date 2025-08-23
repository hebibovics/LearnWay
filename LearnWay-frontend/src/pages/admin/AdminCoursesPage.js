import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Dohvati kurseve sa backenda
        axios.get("/api/course/")
            .then((res) => setCourses(res.data))
            .catch((err) => console.error(err));
    }, []);

    // Filtriraj kurseve po search termu
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="mt-4">
            {/* Search bar */}
            <Form.Control
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
            />

            {/* Lista kurseva */}
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {filteredCourses.map((course) => (
                    <Col key={course.id}>
                        <Card
                            className="h-100"
                            onClick={() => navigate(`/admin/course/${course.courseId}`)}
                            style={{ cursor: "pointer", color: "black" }} // crn tekst
                        >
                            {course.imageUrl && (
                                <Card.Img variant="top" src={course.imageUrl} />
                            )}
                            <Card.Body>
                                <Card.Title>{course.title}</Card.Title>
                                <Card.Text>
                                    {course.description?.substring(0, 100)}...
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default AdminCoursesPage;
