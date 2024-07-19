import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

// Osnovni podaci o kursevima
const basicCourses = [
    { title: "Intro to Data Science", lessons: 5, hours: 56, rate: 4.7 },
    { title: "Data Science for Experts", lessons: 8, hours: 80, rate: 4.8 },
    { title: "Data Science 3", lessons: 10, hours: 90, rate: 4.5 },
    { title: "Python Basics", lessons: 12, hours: 100, rate: 4.9 },
    { title: "Advanced Python", lessons: 7, hours: 70, rate: 4.6 },
    { title: "Machine Learning", lessons: 6, hours: 60, rate: 4.8 },
    { title: "Deep Learning", lessons: 9, hours: 85, rate: 4.7 },
    { title: "Data Analysis", lessons: 5, hours: 55, rate: 4.6 },
    { title: "Statistics for Data Science", lessons: 11, hours: 95, rate: 4.5 },
    { title: "Data Visualization", lessons: 8, hours: 75, rate: 4.8 },
    { title: "Big Data", lessons: 6, hours: 65, rate: 4.7 },
    { title: "Natural Language Processing", lessons: 9, hours: 80, rate: 4.9 },
    { title: "Data Mining", lessons: 7, hours: 60, rate: 4.6 },
    { title: "Data Ethics", lessons: 4, hours: 40, rate: 4.4 },
    { title: "Data Engineering", lessons: 8, hours: 85, rate: 4.7 },
    { title: "R Programming", lessons: 6, hours: 55, rate: 4.6 },
    { title: "SQL for Data Science", lessons: 10, hours: 90, rate: 4.8 },
    { title: "Spark for Data Science", lessons: 7, hours: 75, rate: 4.7 },
    { title: "Data Wrangling", lessons: 8, hours: 70, rate: 4.6 },
    { title: "Predictive Modeling", lessons: 9, hours: 85, rate: 4.8 },
    { title: "AI and Data Science", lessons: 10, hours: 95, rate: 4.9 },
    { title: "Data Science in Business", lessons: 5, hours: 50, rate: 4.5 },
    { title: "Data Science Project Management", lessons: 6, hours: 65, rate: 4.6 },
    { title: "Data Science Capstone", lessons: 12, hours: 100, rate: 4.9 }
];

// Dodavanje ID-eva i kopiranje osnovnih podataka o kursevima
const courses = basicCourses.map((course, index) => ({ ...course, id: index + 1 }));

const CourseDetails = () => {
    const { id } = useParams();
    const course = courses.find(course => course.id === parseInt(id));

    if (!course) return <p>Course not found</p>;

    return (
        <Container>
            <h1 className="my-4 text-center">Course Details</h1>
            <Row className="justify-content-center">
                <Col md={6}>
                    <h3>Course Name: {course.title}</h3>
                    <p>Total Hours: {course.hours}</p>
                    <p>Lessons: {course.lessons}</p>
                    <p>Grade: {course.rate}</p>
                    <Button variant="primary">ENROLL</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default CourseDetails;
