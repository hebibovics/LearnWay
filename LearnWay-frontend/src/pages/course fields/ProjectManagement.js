import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../pages/Home.css';

const ProjectManagement = () => {

    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/course/')
            .then(async response => {
                const webDevCourses = response.data.filter(course => course.category.catId === 7);

                const coursesWithRates = await Promise.all(webDevCourses.map(async (course) => {
                    try {
                        const reviewsResp = await axios.get(`/api/review/course/${course.courseId}`);
                        const reviews = reviewsResp.data;
                        if(reviews.length > 0){
                            const sum = reviews.reduce((acc, review) => acc + review.rate, 0);
                            course.rate = (sum / reviews.length).toFixed(2);
                        } else {
                            course.rate = "N/A";
                        }
                    } catch(e) {
                        course.rate = "N/A";
                    }
                    return course;
                }));

                setCourses(coursesWithRates);
            })
            .catch(error => {
                console.error('There was an error fetching the courses!', error);
            });
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (option) => {
        setSortOption(option);
    };

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedCourses = [...filteredCourses].sort((a, b) => {
        switch (sortOption) {
            // case 'rate-high-low':
            //   return b.rate - a.rate;
            case 'alphabet':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

    const handleViewCourse = (courseId) => {
        const isAuthenticated = !!localStorage.getItem('jwtToken');
        console.log("ovo", isAuthenticated);
        if (isAuthenticated) {
            navigate(`/course/${courseId}`);
        } else {
            navigate('/login');
        }
    };

    return (
        <Container>
            <h1 className="my-4 text-center">Project Management Courses</h1>
            <Row className="mb-4">
                <Col md={8}>
                    <Form.Control
                        type="text"
                        placeholder="Search for a course..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Col>
                <Col md={4}>
                    <DropdownButton id="dropdown-basic-button" title="Sort">
                        <Dropdown.Item onClick={() => handleSort('rate-high-low')}>Sort by rate (highest to lowest)</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSort('alphabet')}>Sort by alphabet</Dropdown.Item>
                    </DropdownButton>
                </Col>

            </Row>
            <Row>
                {sortedCourses.map((course, index) => (
                    <Col md={3} key={index} className="mb-4">
                        <Card className="h-100" className="text-dark">
                            <Card.Body>
                                <Card.Title className="text-uppercase">{course.title}</Card.Title>
                                <Card.Text>
                                    Lessons: {course.lessons?.length || 0} <br />
                                    Rate: {course.rate}
                                </Card.Text>
                                <button onClick={() => handleViewCourse(course.courseId)} className="btn btn-primary">View Course</button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Footer Section */}
            <Row className="mt-5 text-white p-4 footer" style={{ backgroundColor: '#1b263b' }}>
                <Col className="footer-content text-center">
                    <h3 className="mb-4">Contact Us</h3>
                    <p>Email: <a href="mailto:admin@learnway.com" className="text-white">admin@learnway.com</a></p>
                    <div className="mt-4">
                        <p className="mb-2">Visit our:</p>
                        <Row className="justify-content-center">
                            <Col xs="auto">
                                <Link to="/home" className="text-white">Homepage</Link>
                            </Col>
                            <Col xs="auto">
                                <Link to="/aboutUs" className="text-white">About Us</Link>
                            </Col>
                            <Col xs="auto">
                                <Link to="/login" className="text-white">Login</Link>
                            </Col>
                            <Col xs="auto">
                                <Link to="/register" className="text-white">Register</Link>
                            </Col>
                        </Row>
                    </div>
                    <blockquote className="mt-5 text-center" style={{ fontSize: '1.4rem', fontStyle: 'italic' }}>
                        "Empower your learning journey with us! Unleash the potential within."
                    </blockquote>
                </Col>
            </Row>
        </Container>
    );
};

export default ProjectManagement;
