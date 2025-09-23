import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, ListGroup, Form, Card, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

const AdminCourseDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [forumComments, setForumComments] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [averageRating, setAverageRating] = useState("No ratings yet");

    const [searchStudentTerm, setSearchStudentTerm] = useState("");
    const [searchLessonTerm, setSearchLessonTerm] = useState("");

    // Modal za send mail
    const [showMailModal, setShowMailModal] = useState(false);
    const [selectedNotifications, setSelectedNotifications] = useState([]);

    const notificationOptions = [
        "Low rating on this course, consider improving lessons",
        "Inappropriate lessons will be deleted",
        "This course may be deleted due to irrelevant info",
    ];

    const token = localStorage.getItem("jwtToken")?.replace(/^"|"$/g, '');
    const axiosConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    const filteredLessons = Array.isArray(lessons)
        ? lessons.filter(lesson =>
            lesson.title.toLowerCase().includes(searchLessonTerm.toLowerCase())
        )
        : [];

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`/api/course/${id}`, axiosConfig);
                setCourse(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchReviewsAndCalculateAverage = async () => {
            try {
                const response = await axios.get(`/api/review/course/${id}`, axiosConfig);
                const reviews = response.data;

                if (reviews.length > 0) {
                    const sum = reviews.reduce((acc, review) => acc + review.rate, 0);
                    const average = sum / reviews.length;
                    setAverageRating(average.toFixed(2));
                } else {
                    setAverageRating("No ratings yet");
                }
            } catch (err) {
                setAverageRating("N/A");
            }
        };

        const fetchEnrolledStudents = async () => {
            try {
                const response = await axios.get(`/api/course/${id}/students`, axiosConfig);
                setEnrolledStudents(response.data);
            } catch (err) {}
        };

        const fetchForumComments = async () => {
            try {
                const response = await axios.get(`/api/comments/course/${id}`, axiosConfig);
                setForumComments(response.data);
            } catch (err) {}
        };

        const fetchLessons = async () => {
            try {
                const response = await axios.get(`/api/lesson/api/lesson/${id}`, axiosConfig);
                setLessons(response.data);
            } catch (err) {}
        };

        fetchCourse();
        fetchEnrolledStudents();
        fetchForumComments();
        fetchLessons();
        fetchReviewsAndCalculateAverage();
    }, [id]);

    const handleDeleteCourse = () => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this course!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios.delete(`/api/course/${id}`, axiosConfig)
                    .then(() => {
                        swal("Course deleted!", "The course has been successfully deleted.", "success");
                        navigate("/adminCourses");
                    })
                    .catch((err) => {
                        console.error(err);
                        swal("Deletion failed!", "There was an error deleting the course.", "error");
                    });
            }
        });
    };

    const filteredStudents = enrolledStudents.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchStudentTerm.toLowerCase())
    );

    const handleDeleteComment = (commentId) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, this comment cannot be recovered!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios
                    .delete(`/api/comments/${commentId}`, axiosConfig)
                    .then(() => {
                        swal("Comment deleted!", "The comment has been removed.", "success");
                        setForumComments(forumComments.filter(c => c.commentId !== commentId));
                    })
                    .catch((err) => {
                        console.error(err);
                        swal("Deletion failed!", "There was an error deleting the comment.", "error");
                    });
            }
        });
    };

    const handleCheckboxChange = (option) => {
        setSelectedNotifications(prev =>
            prev.includes(option)
                ? prev.filter(o => o !== option)
                : [...prev, option]
        );
    };

    const handleSendMail = () => {
        if (!selectedNotifications.length) {
            swal("Select at least one notification", "", "warning");
            return;
        }

        // Samo prikaz alert, ne salje pravi stvarni mail
        swal("Mail sent!", `Notifications sent to ${course.instructor.username}`, "success");
        setShowMailModal(false);
        setSelectedNotifications([]);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading course details.</p>;
    if (!course) return <p>Course not found</p>;

    return (
        <Container className="mt-4">
            {/* Course Title and Delete / Send Mail */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="text-center">{course.title}</h2>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => setShowMailModal(true)}
                    >
                        📧 Send Mail
                    </Button>
                    <Button variant="danger" onClick={handleDeleteCourse}>
                        Delete Course
                    </Button>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <p><strong>Description:</strong> {course.description}</p>
                    <p><strong>Category:</strong> {course.category?.title || "N/A"}</p>
                    <p><strong>Number of Lessons:</strong> {course.lessons?.length || 0}</p>
                    <p><strong>Instructor:</strong> {course.instructor.firstName || ""} {course.instructor.lastName || ""}</p>
                    <p>
                        <strong>Course Rating:</strong> {averageRating}
                    </p>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Search enrolled students..."
                        value={searchStudentTerm}
                        onChange={(e) => setSearchStudentTerm(e.target.value)}
                    />
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <h5>Enrolled Students:</h5>
                    {filteredStudents.length > 0 ? (
                        <ListGroup>
                            {filteredStudents.map((student, idx) => (
                                <ListGroup.Item key={idx}>
                                    <strong>{student.firstName} {student.lastName}</strong>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p>No students enrolled yet.</p>
                    )}
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <h5>Forum Comments:</h5>
                    {forumComments.length > 0 ? (
                        <ListGroup>
                            {forumComments.map((comment, idx) => (
                                <ListGroup.Item
                                    key={idx}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <span>
                                        <strong>{comment.user?.fullName || comment.username}:</strong>{" "}
                                        {comment.content}
                                    </span>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeleteComment(comment.commentId)}
                                    >
                                        🗑
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Search lessons..."
                        value={searchLessonTerm}
                        onChange={(e) => setSearchLessonTerm(e.target.value)}
                    />
                </Col>
            </Row>

            {/* Lessons as Cards */}
            <Row className="mb-4">
                {filteredLessons.length > 0 ? (
                    filteredLessons.map((lesson) => (
                        <Col key={lesson.lessonId} md={4} className="mb-3">
                            <Card
                                onClick={() => navigate(`/adminLesson/${lesson.lessonId}`)}
                                style={{ cursor: "pointer" }}
                                className="h-100 shadow-sm mb-3 text-dark"
                            >
                                <Card.Body>
                                    <Card.Title>{lesson.title}</Card.Title>
                                    <Card.Text className="text-muted">
                                        {lesson.description?.substring(0, 100) || "No description"}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p>No lessons found.</p>
                    </Col>
                )}
            </Row>

            {/* Send Mail Modal */}
            <Modal  style={{ color: 'black' }} show={showMailModal} onHide={() => setShowMailModal(false)}>
                <Modal.Header  style={{ color: 'black' }} closeButton>
                    <Modal.Title  style={{ color: 'black' }}>Send Notification to Instructor</Modal.Title>
                </Modal.Header>
                <Modal.Body  style={{ color: 'black' }}>
                    <Form.Group className="mb-3"  style={{ color: 'black' }}>
                        <Form.Label  style={{ color: 'black' }}>To:</Form.Label>
                        <Form.Control  style={{ color: 'black' }} type="email" value={course.instructor.username} readOnly />
                    </Form.Group>

                    <Form.Group  style={{ color: 'black' }}>
                        <Form.Label>Select notifications:</Form.Label>
                        {notificationOptions.map((option, idx) => (
                            <Form.Check
                                key={idx}
                                type="checkbox"
                                label={option}
                                checked={selectedNotifications.includes(option)}
                                onChange={() => handleCheckboxChange(option)}
                            />
                        ))}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMailModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSendMail}>
                        Send
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminCourseDetailsPage;
