import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios"; // Ako koristiš axios za pozive API-ja
import { useParams } from 'react-router-dom';

const InstructorLessonsPage = () => {
    const [lessons, setLessons] = useState([]);
    const courseId = localStorage.getItem('courseId');
    console.log("Course ID:", courseId); // Provjeri vrijednost courseId



    useEffect(() => {
        const fetchLessons = async () => {
            const courseId = localStorage.getItem('courseId');
            console.log("Course ID in localStorage:", courseId);  // Provjerite ovdje
            if (courseId) {
                try {
                    console.log("Fetching lessons for Course ID:", courseId);
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
