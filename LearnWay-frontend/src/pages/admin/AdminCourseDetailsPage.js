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

    // Modal za send ticket
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [customMessage, setCustomMessage] = useState("");

    const token = localStorage.getItem("jwtToken")?.replace(/^"|"$/g, '');
    const axiosConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    const videoLinks = {
        lowRating: "https://www.youtube.com/embed/10lQWsFbPTU",
        inappropriate: "https://cinema8.com/blog/12-most-common-e-learning-mistakes-you-should-avoid",
        addMaterial: "https://www.youtube.com/embed/k2nGe5xXugw",
        improveEngagement: "https://www.youtube.com/embed/KRw_ve77u94",
    };

    const filteredLessons = Array.isArray(lessons)
        ? lessons.filter(lesson =>
            lesson.title.toLowerCase().includes(searchLessonTerm.toLowerCase())
        )
        : [];

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [courseRes, reviewRes, studentsRes, commentsRes, lessonsRes] = await Promise.all([
                    axios.get(`/api/course/${id}`, axiosConfig),
                    axios.get(`/api/review/course/${id}`, axiosConfig),
                    axios.get(`/api/course/${id}/students`, axiosConfig),
                    axios.get(`/api/comments/course/${id}`, axiosConfig),
                    axios.get(`/api/lesson/api/lesson/${id}`, axiosConfig),
                ]);

                setCourse(courseRes.data);
                setEnrolledStudents(studentsRes.data);
                setForumComments(commentsRes.data);
                setLessons(lessonsRes.data);

                const reviews = reviewRes.data;
                if (reviews.length > 0) {
                    const avg = (reviews.reduce((acc, r) => acc + r.rate, 0) / reviews.length).toFixed(2);
                    setAverageRating(avg);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
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
                    .catch(() => swal("Error", "Failed to delete course.", "error"));
            }
        });
    };

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
                        swal("Deleted!", "Comment removed successfully.", "success");
                        setForumComments(forumComments.filter(c => c.commentId !== commentId));
                    })
                    .catch(() => swal("Error", "Failed to delete comment.", "error"));
            }
        });
    };

    const handleSendTicket = async () => {
        if (!selectedOption && !customMessage.trim()) {
            swal("Please select a reason or add a message.", "", "warning");
            return;
        }

        let message = "";

        switch (selectedOption) {
            case "lowRating":
                message = "This course has received low ratings. Please review and improve your lessons.";
                break;
            case "inappropriate":
                message = "Some lessons may contain inappropriate or irrelevant content. Consider updating them.";
                break;
            case "deletionWarning":
                message = "This course may be deleted due to violations of platform standards.";
                break;
            case "addMaterial":
                message = "Please consider adding additional learning materials to enrich the course.";
                break;
            case "improveEngagement":
                message = "Consider improving student engagement.";
                break;
            default:
                break;
        }

// Dodaj custom message ako postoji
        if (customMessage.trim()) message += `\n\nAdmin note: ${customMessage}`;

// **Dodaj video link u description**
        if (selectedOption && videoLinks[selectedOption]) {
            message += `\n\n ${videoLinks[selectedOption]}`;
        }



        try {

            const instructorId = course.instructor.userId;

            await axios.post(
                `/api/tickets/admin/1/to-instructor/${instructorId}`,
                {
                    title: `Course feedback: ${course.title}`,
                    category: "Feedback",
                    description: message,
                    direction: "TO_INSTRUCTOR"
                },
                axiosConfig
            );

            swal("Ticket sent!", "The ticket has been successfully sent to the instructor.", "success");

            setSelectedOption("");
            setCustomMessage("");
            setShowTicketModal(false);
        } catch (err) {
            swal("Error", "Failed to send ticket.", "error");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading course details.</p>;
    if (!course) return <p>Course not found</p>;

    return (
        <Container className="mt-4" style={{ color: "white" }}>

        {/* Title and Actions */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="text-center">{course.title}</h2>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => setShowTicketModal(true)}
                    >
                        🎫 Send Ticket
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
                    <p><strong>Instructor:</strong> {course.instructor.firstName} {course.instructor.lastName}</p>
                    <p><strong>Course Rating:</strong> {averageRating}</p>
                    <p><strong>Number of Lessons:</strong> {course.lessons?.length || 0}</p>
                </Col>
            </Row>

            {/* Students */}
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
                    {enrolledStudents.length ? (
                        <ListGroup>
                            {enrolledStudents.map((s, i) => (
                                <ListGroup.Item key={i}>{s.firstName} {s.lastName}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : <p>No students enrolled yet.</p>}
                </Col>
            </Row>

            {/* Comments */}
            <Row className="mb-4">
                <Col>
                    <h5>Forum Comments:</h5>
                    {forumComments.length ? (
                        <ListGroup>
                            {forumComments.map((c, i) => (
                                <ListGroup.Item
                                    key={i}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <span><strong>{c.user?.fullName || c.username}:</strong> {c.content}</span>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeleteComment(c.commentId)}
                                    >
                                        🗑
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : <p>No comments yet.</p>}
                </Col>
            </Row>

            {/* Lessons */}
            <Row className="mb-4">
                <Col md={6}>
                    <Form.Control
                        type="text"
                        placeholder="Search lessons..."
                        value={searchLessonTerm}
                        onChange={(e) => setSearchLessonTerm(e.target.value)}
                    />
                </Col>
            </Row>
            <Row>
                {filteredLessons.length ? (
                    filteredLessons.map((lesson) => (
                        <Col key={lesson.lessonId} md={4} className="mb-3">
                            <Card
                                onClick={() => navigate(`/adminLesson/${lesson.lessonId}`)}
                                className="h-100 shadow-sm text-dark"
                                style={{ cursor: "pointer" }}
                            >
                                <Card.Body>
                                    <Card.Title>{lesson.title}</Card.Title>
                                    <Card.Text>{lesson.description?.substring(0, 100) || "No description"}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : <p>No lessons found.</p>}
            </Row>

            {/* Ticket Modal */}
            <Modal show={showTicketModal} onHide={() => setShowTicketModal(false)}>
                <div style={{ color: "black" }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Send Ticket to Instructor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" style={{ color: "black" }}>
                                <Form.Label style={{ color: "black" }}>Select reason:</Form.Label>
                                <Form.Select
                                    value={selectedOption}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                >
                                    <option value="">-- Choose an option --</option>
                                    <option value="lowRating">Low rating – improve lessons</option>
                                    <option value="inappropriate">Inappropriate / irrelevant content</option>
                                    <option value="deletionWarning">Course may be deleted</option>
                                    <option value="addMaterial">Add more learning material</option>
                                    <option value="improveEngagement">Improve engagement</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label style={{ color: "black" }}>Additional message:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Optional message..."
                                    value={customMessage}
                                    onChange={(e) => setCustomMessage(e.target.value)}
                                />
                            </Form.Group>

                            {/* Video preview */}
                            {selectedOption && videoLinks[selectedOption] && (
                                <div className="mt-3">
                                    <p>Suggested video for this ticket:</p>
                                    <div className="ratio ratio-16x9">
                                        <iframe
                                            src={videoLinks[selectedOption]}
                                            title="Instruction Video"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowTicketModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSendTicket}>
                            Send Ticket
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

        </Container>
    );
};

export default AdminCourseDetailsPage;
