import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

const CourseDetailsInstructor = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
    }, [id]);

    const handleAddLesson = () => {
        navigate(`/instructorAddLesson/${id}`);
    };

    const handleViewLessons = () => {
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
                    <p>Total Hours: {course.hours}</p>
                    <p>Lessons: {course.lessons}</p>
                    <p>Rate: {course.rate}</p>
                    <p>Category: {course.catId}</p>
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
