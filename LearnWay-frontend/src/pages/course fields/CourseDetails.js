import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, ListGroup, Form, Card} from 'react-bootstrap';
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
    const [searchTerm, setSearchTerm] = useState(""); // novo stanje za search
    const [userRating, setUserRating] = useState(null);
    const [selectedRating, setSelectedRating] = useState(0);
    const [averageRating, setAverageRating] = useState(null);
    const [forumComments, setForumComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [expandedLessonId, setExpandedLessonId] = useState(null);


    const userId = loginReducer?.user?.userId;
    const token = localStorage.getItem("jwtToken");
    console.log(token);
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const filteredLessons = lessons.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const toggleLesson = (id) => {
        setExpandedLessonId(expandedLessonId === id ? null : id);
    };

    useEffect(() => {
        if (course) {
            localStorage.setItem('courseId', course.courseId);
console.log('kurs', course)
            const enrolled = course.users?.some(user => user.userId === userId);
            setIsEnrolled(enrolled);
            if (enrolled) {
                const fetchUserReview = async () => {
                    try {
                        const response = await axios.get(`http://localhost:8081/api/review/user/${userId}/course/${id}`);
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
                const response = await axios.get(`/api/course/${id}`);
                setCourse(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();

        if (localStorage.getItem("jwtToken")) {
            let role = "";
            console.log("jwtToken")
            loginReducer.user.roles.forEach((r) => {
                if (r["roleName"] === "INSTRUCTOR") {
                    role = "INSTRUCTOR";
                } else {
                    role = "USER";
                }
            });
            setUserRole(role);
        }
    }, [id, loginReducer]);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                if (isEnrolled) {
                    const response = await axios.get(`/api/lesson/api/lesson/${id}`);
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
                const response = await axios.get(`/api/review/course/${id}`);
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
                const response = await axios.get(`/api/comments/course/${id}`);
                setForumComments(response.data);
            } catch (err) {
                console.error("Error fetching forum comments", err);
            }
        };

        fetchForumComments();
    }, [id]);


    const handleEnroll = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            console.log(token);
            const config = {

                headers: {
                    // Authorization: `Bearer ${token}`,

                },
            };

            const response = await axios.post(`http://localhost:8081/api/course/${id}/enroll/${userId}`, {}, config);

            swal("Success", "You have been enrolled successfully!", "success");
            setCourse(response.data);

        } catch (err) {
            console.error("Enroll error:", err.response?.data || err.message);
            swal("Error", err.response?.data || "Enrollment failed", "error");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading course details.</p>;
    if (!course) return <p>Course not found</p>;

    const handleUnenroll = async () => {
        try {
            const config = {
                headers: {
                    // Authorization: `Bearer ${token}`, // dodaj ako trebaš token
                },
            };

            await axios.delete(`http://localhost:8081/api/course/${id}/unenroll/${userId}`, config);

            swal("Success", "You have been unenrolled successfully!", "success");

            // Ažuriraj lokalno stanje
            setIsEnrolled(false);
            setCourse(prevCourse => ({
                ...prevCourse,
                users: prevCourse.users?.filter(user => user.userId !== userId)
            }));
        } catch (err) {
            console.error("Unenroll error:", err.response?.data || err.message);
            swal("Error", err.response?.data || "Unenrollment failed", "error");
        }
    };

    return (
        <Container>
            <h1 className="my-4 text-center">Course Details</h1>
            <Row className="justify-content-center">
                <Col md={8}>
                    <h3>{course.title}</h3>
                    <p><strong>Description:</strong> {course.description}</p>
                    <p><strong>Number of Lessons:</strong> {course.lessons?.length || 0}</p>
                    <p>Rate: {averageRating}</p>
                    <p>Category: {course.category.title}</p>
                    {userRole === "USER" && (
                        <>
                            {!isEnrolled ? (
                                <Button variant="outline-primary" className="mt-3" onClick={handleEnroll}>
                                    Enroll
                                </Button>
                            ) : (
                                <Button variant="outline-danger" className="mt-3" onClick={handleUnenroll}>
                                    Unenroll
                                </Button>
                            )}
                        </>
                    )}

                    <hr />
                    {isEnrolled && (
                        <div className="mt-4">
                            <h5><strong>FORUM: Comments</strong></h5>

                            {/* Forma za dodavanje novog komentara */}
                            <Form onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    await axios.post(
                                        `/api/comments/course/${id}/user/${userId}`,
                                        { content: newComment }
                                    );
                                    swal("Success", "Comment added!", "success");
                                    setNewComment("");
                                    // Ponovo dohvatiti komentare
                                    const response = await axios.get(`/api/comments/course/${id}`);
                                    setForumComments(response.data);
                                } catch (error) {
                                    console.error("Comment post error", error);
                                    swal("Error", "You must be logged in and enrolled to comment.", "error");
                                }
                            }}>
                                <Form.Group controlId="comment">
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Leave your comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                </Form.Group>
                                <Button className="mt-2" variant="primary" type="submit" disabled={!newComment.trim()}>
                                    Post Comment
                                </Button>
                            </Form>

                            {/* Lista komentara */}
                            <div className="mt-4">
                                {forumComments.length > 0 ? (
                                    <ListGroup>
                                        {forumComments.map((comment, index) => (
                                            <ListGroup.Item key={index}>
                                                <strong>{comment.username}:</strong> {comment.content}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p>No comments yet. Be the first to comment!</p>
                                )}
                            </div>
                        </div>
                    )}

                    {userRole === "USER" && isEnrolled && (
                        <>
                            <div className="mt-5">
                                <h5><strong>LESSONS:</strong></h5>
                                {/* SEARCH BAR */}
                                <Form.Control
                                    type="text"
                                    placeholder="Search lessons..."
                                    className="mb-3"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                {filteredLessons.length > 0 ? (
                                    filteredLessons.map((lesson) => (
                                        <Card key={lesson.id} className="mb-3">
                                            <Card.Header
                                                style={{ cursor: "pointer" }}
                                                onClick={() => toggleLesson(lesson.id)}
                                            >
                                                {lesson.title}
                                            </Card.Header>
                                            {expandedLessonId === lesson.id && (
                                                <Card.Body>
                                                    <Card.Text>{lesson.description}</Card.Text>
                                                    {lesson.videoUrl && (
                                                        <div className="video-container" style={{ maxWidth: "100%", aspectRatio: "16/9" }}>
                                                            <iframe
                                                                width="100%"
                                                                height="315"
                                                                src={lesson.videoUrl}
                                                                title={lesson.title}
                                                                frameBorder="0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                allowFullScreen
                                                            />
                                                        </div>
                                                    )}
                                                </Card.Body>
                                            )}
                                        </Card>
                                    ))
                                    ) : (
                                    <p>No matching lessons found.</p>
                                )}
                            </div>
                            <hr />
                            <div className="mt-4">
                                <h5><strong>Rate this Course:</strong></h5>

                                {userRating ? (
                                    <p>Your rating: {"⭐".repeat(userRating)} ({userRating})</p>
                                ) : (
                                    <>
                                        <div style={{ fontSize: "24px" }}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    style={{
                                                        cursor: "pointer",
                                                        color: star <= selectedRating ? "#ffc107" : "#e4e5e9"
                                                    }}
                                                    onClick={() => setSelectedRating(star)}
                                                >
                        ★
                    </span>
                                            ))}
                                        </div>
                                        <Button
                                            className="mt-2"
                                            variant="success"
                                            onClick={async () => {
                                                try {
                                                    await axios.post(
                                                        `http://localhost:8081/api/review/add?courseId=${id}&userId=${userId}`,
                                                        {
                                                            rate: selectedRating,
                                                            comment: "Great course!" // ako želiš komentar, nije obavezan
                                                        }
                                                    );

                                                    swal("Thank you!", "Your rating has been submitted.", "success");
                                                    setUserRating(selectedRating);
                                                } catch (error) {
                                                    swal("Error", "You must be logged in and enrolled to rate.", "error");
                                                }
                                            }}
                                            disabled={selectedRating === 0}
                                        >
                                            Rate
                                        </Button>
                                    </>
                                )}
                            </div>

                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default CourseDetails;
