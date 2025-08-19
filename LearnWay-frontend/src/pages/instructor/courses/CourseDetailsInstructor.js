import React, { useEffect, useState } from 'react';
import {Container, Row, Col, Button, ListGroup, Form} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import {useSelector} from "react-redux";

const CourseDetailsInstructor = () => {
    const { id } = useParams(); // Provjerite da li je id dostupan
    console.log("Course ID from URL:", id); // Provjerite vrijednost id-a

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [averageRating, setAverageRating] = useState(null);

    const [newComment, setNewComment] = useState("");
    const [forumComments, setForumComments] = useState([]);
    const loginReducer = useSelector((state) => state.loginReducer);
    const userId = loginReducer?.user?.userId;

    const navigate = useNavigate();
    const [enrolledStudents, setEnrolledStudents] = useState([]);

    useEffect(() => {
        const fetchEnrolledStudents = async () => {
            try {
                const response = await axios.get(`/api/course/${id}/students`);
                setEnrolledStudents(response.data);
            } catch (error) {
                console.error("Error fetching enrolled students:", error);
            }
        };

        fetchEnrolledStudents();
    }, [id]);


    useEffect(() => {

        const fetchCourse = async () => {
            try {
                const response = await axios.get(`/api/course/${id}`);
                setCourse(response.data);
                console.log("fetch", id);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

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

    const handleAddLesson = () => {
        navigate(`/instructorAddLesson/${id}`);
    };

    const handleViewLessons = () => {
        localStorage.setItem('courseId', id);
        console.log("jfijd", course.courseId);
        console.log("jfijd", course);

        navigate(`/instructorLessons/${id}`);
    };

    const handleDeleteCourse = async () => {
        try {
            await axios.delete(`/api/course/${id}`);
            swal("Course Deleted!", "The course has been successfully deleted.", "success")
                .then(() => navigate('/instructorProfile')); // Preusmjeravanje na profil stranicu nakon brisanja
        } catch (err) {
            swal("Deletion Failed!", "There was an error deleting the course.", "error");
        }
    };

    const confirmDeleteCourse = () => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this course!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    handleDeleteCourse();
                }
            });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading course details.</p>;
    if (!course) return <p>Course not found</p>;

    return (
        <Container>
            <h1 className="my-4 text-center">Course Details</h1>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h3>Course Name: {course.title}</h3>
                    <p>Number of Lessons: {course.lessons?.length || 0}</p>
                    <p>Rate: {averageRating}</p>
                    <p>Category: {course.category.title}</p>
                    <Row className="mt-3 g-2">
                        <Col xs={12} md={6}>
                            <Button variant="primary" className="w-100 text-white" onClick={handleAddLesson}>
                                Add Lesson
                            </Button>
                        </Col>
                        <Col xs={12} md={6}>
                            <Button variant="success" className="w-100 text-white" onClick={handleViewLessons}>
                                View Lessons
                            </Button>
                        </Col>
                        <Col xs={12} md={6}>
                            <Button variant="danger" className="w-100 text-white" onClick={confirmDeleteCourse}>
                                Delete Course
                            </Button>
                        </Col>
                        <Col xs={12} md={6}>
                            <Button variant="warning" className="w-100 text-white" onClick={() => navigate(`/instructorCourse/${id}/addQuiz`)}>
                                Add Quiz
                            </Button>
                        </Col>
                        <Col xs={12} md={6}>
                            <Button variant="info" className="w-100 text-white" onClick={() => navigate(`/instructor/course/${course.courseId}/quizzes`)}>
                                View Quizzes
                            </Button>
                        </Col>


                    </Row>


                </Col>
                <hr />
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
                <div className="mt-5">
                    <h5><strong>Enrolled Students</strong></h5>
                    {enrolledStudents.length > 0 ? (
                        <ListGroup>
                            {enrolledStudents.map((student, index) => (
                                <ListGroup.Item key={index}>
                                    <strong>{student.firstName} {student.lastName}</strong> - {student.email}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <p>No students enrolled yet.</p>
                    )}
                </div>

            </Row>
        </Container>
    );
};

export default CourseDetailsInstructor;
