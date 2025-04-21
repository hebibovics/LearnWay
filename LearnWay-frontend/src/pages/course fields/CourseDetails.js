import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, ListGroup, Form } from 'react-bootstrap';
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

    const userId = loginReducer?.user?.userId;
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const filteredLessons = lessons.filter(lesson =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (course) {
            localStorage.setItem('courseId', course.id);

            const enrolled = course.users?.some(user => user.userId === userId);
            setIsEnrolled(enrolled);
            if (enrolled) {
                const fetchUserReview = async () => {
                    try {
                        const response = await axios.get(`/api/review/`);
                        const review = response.data.find(r =>
                            r.course.id === parseInt(id) && r.course && r.user && r.user.userId === userId
                        );
                        if (review) {
                            setUserRating(review.rate);
                        }
                    } catch (err) {
                        console.error("Error fetching review", err);
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

    const handleEnroll = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
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

    return (
        <Container>
            <h1 className="my-4 text-center">Course Details</h1>
            <Row className="justify-content-center">
                <Col md={8}>
                    <h3>{course.title}</h3>
                    <p><strong>Description:</strong> {course.description}</p>
                    <p><strong>Number of Lessons:</strong> {course.lessons?.length || 0}</p>

                    {userRole === "USER" && !isEnrolled && (
                        <Button variant="outline-primary" className="mt-3" onClick={handleEnroll}>
                            Enroll
                        </Button>
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
                                <ListGroup>
                                    {filteredLessons.length > 0 ? (
                                        filteredLessons.map(lesson => (
                                            <ListGroup.Item key={lesson.id}>
                                                <Link to={`/lesson/${lesson.lessonId}`}>{lesson.title}</Link>
                                            </ListGroup.Item>
                                        ))
                                    ) : (
                                        <p>No matching lessons found.</p>
                                    )}
                                </ListGroup>

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
                                                    await axios.post('/api/review/rate', {
                                                        rate: selectedRating,
                                                        course: {
                                                            courseId: id
                                                        }
                                                    });

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
