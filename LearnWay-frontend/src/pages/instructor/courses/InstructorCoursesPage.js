import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup, Collapse, Spinner } from "react-bootstrap";
import axios from "axios";

const InstructorCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [students, setStudents] = useState({}); // key: courseId, value: studenti
    const [quizzes, setQuizzes] = useState({}); // key: courseId, value: quizzes
    const [loading, setLoading] = useState(false);

    const token = JSON.parse(localStorage.getItem("jwtToken"));

    const user = JSON.parse(localStorage.getItem("user"));
    const instructorId = user?.userId;

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/course/by-instructor/${instructorId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCourses(res.data || []);
            } catch (error) {
                console.error("Error fetching instructor courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [instructorId, token]);

    const toggleStudents = async (courseId) => {
        if (expandedCourse === courseId) {
            setExpandedCourse(null);
            return;
        }

        setExpandedCourse(courseId);
        if (!students[courseId]) {
            try {
                const res = await axios.get(`/api/course/${courseId}/students`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStudents((prev) => ({ ...prev, [courseId]: res.data }));
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        }
    };

    const fetchQuizzes = async (courseId) => {
        try {
            const res = await axios.get(`/api/courses/${courseId}/quizzes`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQuizzes((prev) => ({ ...prev, [courseId]: res.data }));
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
    };

    if (loading) return <Spinner animation="border" className="mt-4" />;

    return (
        <Container className="mt-4">
            <Row>
                {courses.map((course) => (
                    <Col md={4} key={course.courseId} className="mb-4">
                        <Card style={{ minHeight: "250px" }}>
                            <Card.Body>
                                <Card.Title style={{ fontSize: "1.5rem", color: "black" }}>
                                    {course.title}
                                </Card.Title>
                                <Card.Text style={{ color: "black" }}>
                                    <strong>Rate:</strong> {course.rate ?? "N/A"}
                                </Card.Text>

                                <Button
                                    variant="dark"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => toggleStudents(course.courseId)}
                                >
                                    {expandedCourse === course.courseId ? "Hide Students" : "Show Students"}
                                </Button>

                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => fetchQuizzes(course.courseId)}
                                >
                                    View Quizzes
                                </Button>

                                <Collapse in={expandedCourse === course.courseId}>
                                    <div className="mt-3">
                                        <h6>Enrolled Students:</h6>
                                        <ListGroup>
                                            {students[course.courseId]?.length > 0 ? (
                                                students[course.courseId].map((s) => (
                                                    <ListGroup.Item key={s.userId} style={{ color: "black" }}>
                                                        {s.firstName} {s.lastName} ({s.username})
                                                    </ListGroup.Item>
                                                ))
                                            ) : (
                                                <ListGroup.Item>No students enrolled.</ListGroup.Item>
                                            )}
                                        </ListGroup>
                                    </div>
                                </Collapse>

                                {quizzes[course.courseId] && (
                                    <div className="mt-3">
                                        <h6>Quizzes:</h6>
                                        <ListGroup>
                                            {quizzes[course.courseId].length > 0 ? (
                                                quizzes[course.courseId].map((q) => (
                                                    <ListGroup.Item key={q.quizId} style={{ color: "black" }}>
                                                        {q.title}
                                                    </ListGroup.Item>
                                                ))
                                            ) : (
                                                <ListGroup.Item>No quizzes found.</ListGroup.Item>
                                            )}
                                        </ListGroup>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default InstructorCoursesPage;
