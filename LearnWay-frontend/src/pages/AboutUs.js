import React, {useState} from "react";
import {Container, Row, Col, Image, Nav} from "react-bootstrap";
import img1 from '../images/image1.jpg';
import {Link} from "react-router-dom";
import SidebarUser from "../components/SidebarUser";
import {LinkContainer} from "react-router-bootstrap";  // Import your image


const AboutUs = () => {

    const [userRole, setUserRole] = useState("");

    return (
        <Container>
            <Row className="mt-5">
                <Col lg={7}>
                    <div>
                        <h1>Welcome to LearnWay!</h1>
                        <p>
                            At LearnWay, we're on a mission to empower individuals worldwide with the knowledge and skills they need to succeed in today's rapidly evolving digital landscape. Whether you're aspiring to become a proficient programmer, master web design, or enhance your soft skills, we've got you covered.
                        </p>

                        <h2>Our Vision</h2>
                        <p>
                            Our vision is to make learning accessible, enjoyable, and effective for everyone. We believe in harnessing the power of technology to break down barriers to education, enabling individuals to unlock their full potential and achieve their professional and personal goals.
                        </p>

                        <h2>What Sets Us Apart</h2>
                        <ul>
                            <li>Comprehensive Course Catalog</li>
                            <li>Interactive Learning Experience</li>
                            <li>Flexible Learning Options</li>
                            <li>Community Engagement</li>
                            <li>Our Commitment to Quality</li>
                        </ul>

                        <h2>Get Started Today</h2>
                        <p>
                            Embark on your learning journey with LearnWay and take your skills to the next level. Whether you're a beginner or an experienced professional, there's always something new to learn and discover. Join us in shaping the future of education—one course at a time.
                        </p>
                    </div>
                </Col>

                {/* Image section */}
                <Col lg={5} className="mt-5">
                    <Image src={img1} fluid />
                </Col>
            </Row>

            <Row className="mt-5 text-center"> {/* Dodana klasa text-center za centriranje */}
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


            {/* Statistics section */}
            <Row className="mt-5 text-center">
                <Col md={4}>
                    <h1 className="statistic" style={{ color: "rgb(33, 182, 168)", fontSize: "5rem"  }}>900</h1>
                    <p style={{ color: "rgb(33, 182, 168)", fontSize: "2rem"  }}>Satisfied customers</p>
                </Col>
                <Col md={4}>
                    <h1 className="statistic" style={{ color: "rgb(33, 182, 168)", fontSize: "5rem"  }}>500</h1>
                    <p style={{ color: "rgb(33, 182, 168)", fontSize: "2rem"  }}>Courses</p>
                </Col>
                <Col md={4}>
                    <h1 className="statistic" style={{ color: "rgb(33, 182, 168)", fontSize: "5rem"  }}>1200</h1>
                    <p style={{ color: "rgb(33, 182, 168)", fontSize: "2rem"  }}>Certificates</p>
                </Col>
            </Row>

            {/* Footer Section */}
            <Row className="mt-5 text-white p-4 footer" style={{ backgroundColor: '#1b263b' }}>
                <Col className="footer-content text-center">
                    <h3 className="mb-4">Contact Us</h3>
                    <p>Email: <a href="mailto:mail@mail.com" className="text-white">mail@mail.com</a></p>
                    <div className="mt-4">
                        <p className="mb-2">Visit our:</p>
                        <Row className="justify-content-center">
                            {userRole !== "INSTRUCTOR" && (
                                <Col xs="auto">
                                    <Link to="/home" className="text-white">Homepage</Link>
                                </Col>
                            )}
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

export default AboutUs;
