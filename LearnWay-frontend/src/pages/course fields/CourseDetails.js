import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, ListGroup, Form, Card } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import swal from 'sweetalert';

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const loginReducer = useSelector((state) => state.loginReducer);
    const [userRole, setUserRole] = useState("");
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [userRating, setUserRating] = useState(null);
    const [selectedRating, setSelectedRating] = useState(0);
    const [averageRating, setAverageRating] = useState(null);
    const [forumComments, setForumComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [expandedLessonId, setExpandedLessonId] = useState(null);

    const userId = loginReducer?.user?.userId;
    const token = localStorage.getItem("jwtToken")?.replace(/^"|"$/g, '');
    const axiosConfig = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const filteredLessons = lessons.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const toggleLesson = (id) => setExpandedLessonId(expandedLessonId === id ? null : id);

    useEffect(() => {
        if (course) {
            localStorage.setItem('courseId', course.courseId);
            const enrolled = course.users?.some(user => user.userId === userId);
            setIsEnrolled(enrolled);

            if (enrolled) {
                const fetchUserReview = async () => {
                    try {
                        const response = await axios.get(
                            `/api/review/user/${userId}/course/${id}`,
                            axiosConfig
                        );
                        setUserRating(response.data.rate);
                    } catch (err) {
                        console.error("Error fetching user review", err);
                    }
                };
                fetchUserReview();
            }
        }
    }, [course, userId]);

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
        fetchCourse();

        const roleName = loginReducer?.user?.role?.roleName || "USER";
        setUserRole(roleName);
    }, [id, loginReducer]);


    useEffect(() => {
        const fetchLessons = async () => {
            try {
                if (isEnrolled) {
                    const response = await axios.get(`/api/lesson/api/lesson/${id}`, axiosConfig);
                    setLessons(response.data);
                }
            } catch (err) {
                console.error("Error fetching lessons", err);
            }
        };
        fetchLessons();
    }, [id, isEnrolled]);

    useEffect(() => {
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
                console.error("Error fetching reviews", err);
                setAverageRating("N/A");
            }
        };
        fetchReviewsAndCalculateAverage();
    }, [id]);

    useEffect(() => {
        const fetchForumComments = async () => {
            try {
                const response = await axios.get(`/api/comments/course/${id}`, axiosConfig);
                setForumComments(response.data);
            } catch (err) {
                console.error("Error fetching forum comments", err);
            }
        };
        fetchForumComments();
    }, [id]);

    const handleEnroll = async () => {
        try {
            console.log("ovaj token gledam", token);
            const response = await axios.post(
                `http://localhost:8081/api/course/${id}/enroll/${userId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            swal("Success", "You have been enrolled successfully!", "success");
            setCourse(response.data);
            setIsEnrolled(true);

            console.log("ovaj token gledam", token);
        } catch (err) {
            console.error("Enroll error:", err.response?.data || err.message);

            console.log("ovaj token gledam", token);
            const message = typeof err.response?.data === "string" ? err.response.data : "Enrollment failed";
            swal("Error", message, "error");
        }
    };

    const handleUnenroll = async () => {
        try {

            console.log("ovaj token gleda sadd m", token);
            await axios.delete(
                `http://localhost:8081/api/course/${id}/unenroll/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );


            swal("Success", "You have been unenrolled successfully!", "success");
            setIsEnrolled(false);
            setCourse(prev => ({
                ...prev,
                users: prev.users?.filter(u => u.userId !== userId)
            }));
        } catch (err) {
            console.error("Unenroll error:", err.response?.data || err.message);
            const message = typeof err.response?.data === "string" ? err.response.data : "Unenrollment failed";
            swal("Error", message, "error");
        }
    };


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading course details.</p>;
    if (!course) return <p>Course not found</p>;

    return (
        <Container>
            <h1 className="my-4 text-center">Course Details</h1>
            <Row className="justify-content-center">
                <Col md={8}>
                    <h3>{course.title}</h3>
                    <p><strong>Description:</strong> {course.description}</p>
                    <p><strong>Number of Lessons:</strong> {course.lessons?.length || 0}</p>
                    <p><strong>Rate:</strong> {averageRating}</p>
                    <p><strong>Category:</strong> {course.category?.title}</p>
                    {course.instructor && (
                        <p><strong>Instructor:</strong> {course.instructor.firstName} {course.instructor.lastName}</p>
                    )}

                    {userRole === "USER" && (
                        <div className="mt-3 d-flex gap-2">
                            {!isEnrolled ? (
                                <Button variant="outline-primary" onClick={handleEnroll}>Enroll</Button>
                            ) : (
                                <>
                                    <Button variant="outline-danger" onClick={handleUnenroll}>Unenroll</Button>
                                    <Link to={`/studentQuizzes/${id}`}>
                                        <Button variant="info">View Quizzes</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    )}

                    <hr />

                    {isEnrolled && (
                        <>
                            <h5><strong>FORUM: Comments</strong></h5>
                            <Form onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    await axios.post(
                                        `/api/comments/course/${id}/user/${userId}`,
                                        { content: newComment },
                                        axiosConfig
                                    );
                                    const message = "Comment added!";
                                    swal("Success", message, "success");
                                    setNewComment("");
                                    const response = await axios.get(`/api/comments/course/${id}`, axiosConfig);
                                    setForumComments(response.data);
                                } catch (error) {
                                    console.error("Comment post error", error);
                                    const message = typeof error.response?.data === "string" ? error.response.data : "You must be logged in and enrolled to comment.";
                                    swal("Error", message, "error");
                                }
                            }}>
                                <Form.Group controlId="comment">
                                    <Form.Control as="textarea" rows={3} placeholder="Leave your comment..." value={newComment} onChange={e => setNewComment(e.target.value)} />
                                </Form.Group>
                                <Button className="mt-2" variant="primary" type="submit" disabled={!newComment.trim()}>Post Comment</Button>
                            </Form>

                            {forumComments.length > 0 ? (
                                <ListGroup className="mt-3">
                                    {forumComments.map((comment, idx) => (
                                        <ListGroup.Item key={idx}>
                                            <strong>{comment.username}:</strong> {comment.content}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p className="mt-3">No comments yet. Be the first to comment!</p>
                            )}

                            <hr />
                            <h5><strong>LESSONS:</strong></h5>
                            <Form.Control type="text" placeholder="Search lessons..." className="mb-3" value={searchTerm} onChange={handleSearchChange} />
                            {filteredLessons.map(lesson => (
                                <Card key={lesson.lessonId} className="mb-3 text-dark">
                                    <Card.Header as={Link} to={`/lessonPage/${id}/${lesson.lessonId}`} style={{ cursor: "pointer", textDecoration: "none", color: "#000" }}>
                                        {lesson.title}
                                    </Card.Header>
                                </Card>
                            ))}

                            <hr />
                            <h5><strong>Rate this Course:</strong></h5>
                            {userRating ? (
                                <p>Your rating: {"⭐".repeat(userRating)} ({userRating})</p>
                            ) : (
                                <div style={{ fontSize: "24px" }}>
                                    {[1,2,3,4,5].map(star => (
                                        <span key={star} style={{ cursor: "pointer", color: star <= selectedRating ? "#ffc107" : "#e4e5e9" }} onClick={() => setSelectedRating(star)}>★</span>
                                    ))}
                                    <Button className="mt-2" variant="success" onClick={async () => {
                                        try {
                                            await axios.post(`/api/review/add?courseId=${id}&userId=${userId}`, { rate: selectedRating, comment: "Great course!" }, axiosConfig);
                                            swal("Thank you!", "Your rating has been submitted.", "success");
                                            setUserRating(selectedRating);
                                        } catch (error) {
                                            const message = typeof error.response?.data === "string" ? error.response.data : "You must be logged in and enrolled to rate.";
                                            swal("Error", message, "error");
                                        }
                                    }} disabled={selectedRating === 0}>Rate</Button>
                                </div>
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default CourseDetails;
