import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../actions/authActions";
import Loader from "../components/Loader";
import * as authConstants from "../constants/authConstants";
import "./page.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");

  const token = JSON.parse(localStorage.getItem("jwtToken"));
  const user = JSON.parse(localStorage.getItem("user"));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.loginReducer);

  const showPasswordHandler = () => {
    setShowPassword((prev) => !prev);
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  const redirectUser = (roleName) => {
    if (roleName === "ADMIN") {
      navigate("/adminProfile");
    } else if (roleName === "INSTRUCTOR") {
      navigate("/instructorProfile");
    } else {
      navigate("/profile");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    login(dispatch, username, password).then((data) => {
      if (data.type === authConstants.USER_LOGIN_SUCCESS) {
        const roleName = data.payload?.role?.roleName;
        redirectUser(roleName);
      }
    });
  };

  useEffect(() => {
    if (token && user) {
      const roleName = user?.role?.roleName;
      redirectUser(roleName);
    }
  }, [token, user]);

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
                  required
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
                    required
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

            {error && (
                <div style={{ color: "red", marginTop: "5px" }}>
                  Username or Password are incorrect.
                </div>
            )}

            <Button variant="" className="my-3 btn-submit" type="submit">
              Login
            </Button>
          </Form>

          {loading ? (
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
