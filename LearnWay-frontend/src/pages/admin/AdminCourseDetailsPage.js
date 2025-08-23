import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, ListGroup, Form, Card } from 'react-bootstrap';
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


    const [searchStudentTerm, setSearchStudentTerm] = useState("");
    const [searchLessonTerm, setSearchLessonTerm] = useState("");

    const filteredLessons = Array.isArray(lessons)
        ? lessons.filter(lesson =>
            lesson.title.toLowerCase().includes(searchLessonTerm.toLowerCase())
        )
        : [];

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

        const fetchEnrolledStudents = async () => {
            try {
                const response = await axios.get(`/api/course/${id}/students`);
                setEnrolledStudents(response.data);
            } catch (err) {
                console.error("Error fetching students:", err);
            }
        };

        const fetchForumComments = async () => {
            try {
                const response = await axios.get(`/api/comments/course/${id}`);
                setForumComments(response.data);
            } catch (err) {
                console.error("Error fetching comments:", err);
            }
        };

        const fetchLessons = async () => {
            try {
                const response = await axios.get(`/api/lesson/api/lesson/${id}`);
                console.log("LESSONS RESPONSE:", response.data);
                setLessons(response.data); // backend vraća niz, ne objekt sa {lessons: []}
            } catch (err) {
                console.error("Error fetching lessons:", err);
            }
        };




        fetchCourse();
        fetchEnrolledStudents();
        fetchForumComments();
        fetchLessons();
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
                axios.delete(`/api/course/${id}`)
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
                    .delete(`/api/comments/${commentId}`)
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



    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading course details.</p>;
    if (!course) return <p>Course not found</p>;

    return (
        <Container className="mt-4">
            {/* Course Title and Delete */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="text-center">{course.title}</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="danger" onClick={handleDeleteCourse}>
                        Delete Course
                    </Button>
                </Col>
            </Row>

            {/* Course Info */}
            <Row className="mb-4">
                <Col>
                    <p><strong>Description:</strong> {course.description}</p>
                    <p><strong>Category:</strong> {course.category?.title || "N/A"}</p>
                    <p><strong>Number of Lessons:</strong> {course.lessons?.length || 0}</p>
                    <p><strong>Instructor:</strong> {course.instructor.firstName || 0} {course.instructor.lastName || 0}</p>
                </Col>
            </Row>

            {/* Search Students */}
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

            {/* Enrolled Students */}
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

            {/* Forum Comments */}
            {/* Forum Comments */}
            <Row className="mb-4">
                <Col>
                    <h5>Forum Comments:</h5>
                    {forumComments.length > 0 ? (
                        <ListGroup>
                            {forumComments.map((comment, idx) => {
                                console.log("COMMENT OBJECT:", comment);
                                return (
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
                                );
                            })}

                        </ListGroup>
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </Col>
            </Row>


            {/* Search Lessons */}
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
                                className="h-100 shadow-sm"
                                className="mb-3 text-dark"
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

        </Container>
    );
};

export default AdminCourseDetailsPage;
