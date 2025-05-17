import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

const CourseDetailsInstructor = () => {
    const { id } = useParams(); // Provjerite da li je id dostupan
    console.log("Course ID from URL:", id); // Provjerite vrijednost id-a

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [averageRating, setAverageRating] = useState(null);

    const navigate = useNavigate();

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
                    <Button variant="primary" onClick={handleAddLesson} className="mt-3">
                        Add Lesson
                    </Button>
                    <Button variant="success" onClick={handleViewLessons} className="mt-3">
                        View Lessons
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteCourse} className="mt-3">
                        Delete Course
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default CourseDetailsInstructor;
