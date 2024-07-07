import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { Link } from 'react-router-dom';
import '../../pages/Home.css'

const SoftSkills = () => {

    return (
        <Container>
            {/* Web Development section */}
            <Row className="mt-5">
                <Col>
                    <h1>Welcome to LearnWay!</h1>
                    <p>Learn, grow, and achieve your goals with our courses.</p>
                </Col>
            </Row>

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



            {/* Footer Section */}
            <Row className="mt-5 bg-dark text-white p-4 footer">
                <Col className="footer-content text-center">
                    <h3 className="mb-4">Contact Us</h3>
                    <p>Email: <a href="mailto:mail@mail.com" className="text-white">mail@mail.com</a></p>
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

export default SoftSkills;
