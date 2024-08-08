import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchLessons } from "../../../actions/lessonsActions";
import "../courses/InstructorAddCoursePage.css";

const InstructorLessonsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const lessonsReducer = useSelector((state) => state.categoriesReducer);
    const [lessons, setLessons] = useState(lessonsReducer.categories);

    useEffect(() => {
        const fetchAllLessons = async () => {
            try {
                await fetchLessons(dispatch);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllLessons();
    }, [dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container>
            <h1 className="my-4 text-center">Lessons</h1>
            <Row>
                {lessons.map((lesson, index) => (
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
