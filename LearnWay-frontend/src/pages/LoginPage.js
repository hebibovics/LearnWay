import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../actions/authActions";
import Loader from "../components/Loader";
import * as authConstants from "../constants/authConstants";
import "./page.css"; // Dodaj ovu liniju

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const token = JSON.parse(localStorage.getItem("jwtToken"));
  const user = JSON.parse(localStorage.getItem("user"));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginReducer = useSelector((state) => state.loginReducer);

  const showPasswordHandler = () => {
    setShowPassword((prev) => !prev);
    setPasswordType(showPassword ? "password" : "text");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    login(dispatch, username, password).then((data) => {
      if (data.type === authConstants.USER_LOGIN_SUCCESS) {
        data.payload.roles.map((r) => {
          if (r["roleName"] === "ADMIN") {
            return navigate("/adminProfile");
          }
          if (r["roleName"] === "INSTRUCTOR") {
            return navigate("/instructorProfile");
          } else {
            return navigate("/profile");
          }
        });
      }
    });
  };

  useEffect(() => {
    if (token && user) {
      user.roles.map((r) => {
        if (r["roleName"] === "ADMIN") return navigate("/adminProfile");
        else return navigate("/profile");
      });
    }
  }, []);

  return (
      <div className="login-page-container">
        <div className="login-form-card">
          <h1 className="mb-3">Welcome to LearnWay!</h1>
          <h4 className="mb-4">Sign in to explore our courses and start learning</h4>
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-3" controlId="username">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                  type="text"
                  placeholder="Enter User Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="my-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                    type={passwordType}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    onClick={showPasswordHandler}
                    variant=""
                    style={{ border: "1px solid #555" }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Button
                variant=""
                className="my-3 btn-submit"
                type="submit"
            >
              Login
            </Button>

          </Form>

          {loginReducer.loading ? (
              <Loader />
          ) : (
              <Row className="py-3">
                <Col className="text-center">
                  New User?{" "}
                  <Link to="/register" style={{ color: "#00d1b2" }}>
                    <b>Register</b>
                  </Link>
                </Col>
              </Row>
          )}
        </div>
      </div>
  );
};

export default LoginPage;
