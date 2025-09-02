import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const InstructorLessonsPage = () => {
    const [lessons, setLessons] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // search state
    const courseId = localStorage.getItem("courseId");

    useEffect(() => {
        const fetchLessons = async () => {
            const courseId = localStorage.getItem("courseId");
            if (courseId) {
                try {
                    const response = await axios.get(`/api/lesson/api/lesson/${courseId}`);
                    setLessons(response.data);
                } catch (error) {
                    console.error("There was an error fetching the lessons!", error);
                }
            } else {
                console.error("Course ID is missing.");
            }
        };

        fetchLessons();
    }, []);

    const filteredLessons = lessons.filter(
        (lesson) =>
            lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container>
            <h1 className="my-4 text-center">Lessons</h1>

            {/* Search bar */}
            <Form className="mb-4">
                <Form.Control
                    type="text"
                    placeholder="Search lessons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Form>

            <Row>
                {filteredLessons.map((lesson) => (
                    <Col key={lesson.lessonId} sm={12} md={6} lg={4} className="mb-3">
                        <Link
                            to={`/instructorLessons/${courseId}/${lesson.lessonId}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <Card className="text-dark h-100">
                                <Card.Body>
                                    <Card.Title>{lesson.title}</Card.Title>
                                    <Card.Text>{lesson.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default InstructorLessonsPage;
