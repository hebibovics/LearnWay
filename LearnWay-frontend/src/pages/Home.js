import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { Link } from 'react-router-dom';
import axios from 'axios';
import webDevImage from '../images/web-developments.webp';
import webDesignImage from '../images/web-design.jpg';
import softSkillsImage from '../images/soft_skills.jfif';
import designToolsImage from '../images/designtools.png';
import programmingLangImage from '../images/programminglang.png';
import otherCoursesImage from '../images/online-courses.jpg';
import projectManImage from '../images/projman.jpg';
import digitalMarkImage from '../images/digital_marketing.jpg';
import dataSciImage from '../images/datascience.png';
import '../pages/Home.css';

const categoryImages = {
    "Web Development": webDevImage,
    "Web Design": webDesignImage,
    "Soft Skills": softSkillsImage,
    "Design Tools": designToolsImage,
    "Programming Languages": programmingLangImage,
    "Data Science": dataSciImage,
    "Project Management": projectManImage,
    "Digital Marketing": digitalMarkImage,
    "Other Courses": otherCoursesImage
};

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        axios.get('/api/category/')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the categories!', error);
            });
    }, []);

    useEffect(() => {
        axios.get('/api/course/')
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error('Error fetching courses!', error);
            });
    }, []);


    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };
    const filteredCourses = courses.filter(course =>
        (course.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );



    const categoryChunks = chunkArray(categories, 3);

    return (
        <Container>

                    <Row className="mt-5 align-items-center">
                        <Col md={5}>
                            <h1>Welcome to LearnWay!</h1>
                            <p>Learn, grow, and achieve your goals with our courses.</p>
                        </Col>
                        <Col md={6}>
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="form-control"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Col>
                    </Row>

                    {searchTerm && (
                        <Row className="mt-4">
                            <Col>
                                <h4>Search Results:</h4>
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map(course => (
                                        <div key={course.courseId} className="mb-3">
                                            <Link to={`/course/${course.courseId}`}>
                                                <strong>{course.title}</strong> – {course.category?.title}
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <p>No courses found.</p>
                                )}
                            </Col>
                        </Row>
                    )}



            <Row className="mt-5">
                <Col md={4}>
                    <h3>Interactive Learning</h3>
                    <p>Experience interactive courses that make learning fun and engaging.</p>
                </Col>
                <Col md={4}>
                    <h3>Wide Range of Courses</h3>
                    <p>From web development to soft skills, we offer courses for everyone.</p>
                </Col>
                <Col md={4}>
                    <h3>Quality Education</h3>
                    <p>Our courses are designed and led by industry experts.</p>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col>
                    <h2>Start your learning journey today!</h2>
                    <h5>Join us and embark on your path to acquiring new skills and knowledge.</h5>
                </Col>
            </Row>

            {categoryChunks.map((chunk, chunkIndex) => (
                <Row key={chunkIndex} className="mt-5">
                    {chunk.map(category => (
                        <Col key={category.catId} md={4} className="text-center">
                            <Link to={`/${category.title.replace(/\s+/g, '')}`} className="image-link">
                                <Image src={categoryImages[category.title]} fluid />
                                <h4>{category.title}</h4>
                            </Link>
                        </Col>
                    ))}
                </Row>
            ))}

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

export default Home;
