import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios"; // Ako koristiš axios za pozive API-ja

const InstructorLessonsPage = () => {
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axios.get("/api/lesson/"); // API poziv za dohvaćanje lekcija
                setLessons(response.data);
            } catch (error) {
                console.error("There was an error fetching the lessons!", error);
            }
        };

        fetchLessons();
    }, []);

    return (
        <Container>
            <h1 className="my-4 text-center">Lessons</h1>
            <Row>
                {lessons.map((lesson) => (
                    <Col key={lesson.id} sm={12} md={6} lg={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{lesson.title}</Card.Title>
                                <Card.Text>{lesson.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default InstructorLessonsPage;
