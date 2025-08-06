import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as authConstants from "../constants/authConstants";
import { Link } from "react-router-dom";
import "./page.css";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerReducer = useSelector((state) => state.registerReducer);

  const showPasswordHandler = () => {
    const temp = !showPassword;
    setShowPassword(temp);
    setPasswordType(temp ? "text" : "password");
  };

  const showConfirmPasswordHandler = () => {
    const temp = !showConfirmPassword;
    setShowConfirmPassword(temp);
    setConfirmPasswordType(temp ? "text" : "password");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!firstName) formErrors.firstName = "Please enter First Name";
    if (!lastName) formErrors.lastName = "Please enter Last Name";
    if (!username) formErrors.username = "Please enter Username";
    if (!password) formErrors.password = "Please enter Password";
    if (!confirmPassword)
      formErrors.confirmPassword = "Please confirm Password";
    if (!role) formErrors.role = "Please choose Role";

    if (password && confirmPassword && password !== confirmPassword) {
      formErrors.notMatch = "Passwords do not match";
    }
    const regex = /^(?=.*[A-Z])(?=.*\d).+$/;
    if (password && !regex.test(password)) {
      formErrors.pwdStrength =
          "Password must include at least one uppercase letter and one number";
    }

    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const user = {
      firstName,
      lastName,
      username,
      password,
      phoneNumber,
      roles: [{ roleName: role }],
    };

    register(dispatch, user).then((data) => {
      if (data.type === authConstants.USER_REGISTER_SUCCESS) {
        navigate("/login");
      }
    });
  };

  return (
      <FormContainer>
        <h1 className="mt-5">Sign Up</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="my-3" controlId="fname">
            <Form.Label>First Name</Form.Label>
            <Form.Control
                type="name"
                placeholder="Enter First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ borderColor: errors.firstName ? "red" : "" }}
            />
            {errors.firstName && (
                <div style={{ color: "red", fontSize: "0.8rem" }}>
                  {errors.firstName}
                </div>
            )}
          </Form.Group>

          <Form.Group className="my-3" controlId="lname">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
                type="name"
                placeholder="Enter Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ borderColor: errors.lastName ? "red" : "" }}
            />
            {errors.lastName && (
                <div style={{ color: "red", fontSize: "0.8rem" }}>
                  {errors.lastName}
                </div>
            )}
          </Form.Group>

          <Form.Group className="my-3" controlId="phone_number">
            <Form.Label>Phone Number </Form.Label>
            <Form.Control
                type="phone"
                placeholder="Enter Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="my-3" controlId="role">
            <Form.Label>Role</Form.Label>
            <Form.Control
                as="select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ borderColor: errors.role ? "red" : "" }}
            >
              <option value="">Choose Role ▼</option>
              <option value="USER">Student</option>
              <option value="INSTRUCTOR">Instructor</option>
            </Form.Control>
            {errors.role && (
                <div style={{ color: "red", fontSize: "0.8rem" }}>{errors.role}</div>
            )}
          </Form.Group>

          <Form.Group className="my-3" controlId="username">
            <Form.Label>User Name</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter User Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ borderColor: errors.username ? "red" : "" }}
            />
            {errors.username && (
                <div style={{ color: "red", fontSize: "0.8rem" }}>
                  {errors.username}
                </div>
            )}
          </Form.Group>

          <Form.Group className="my-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Row>
              <Col xs={10}>
                <Form.Control
                    type={passwordType}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      borderColor:
                          errors.password || errors.notMatch || errors.pwdStrength
                              ? "red"
                              : "",
                    }}
                />
              </Col>
              <Col xs={2} className="d-flex align-items-center">
                <Button onClick={showPasswordHandler} variant="" className="btn-submit w-100">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </Col>
            </Row>
            {errors.password && (
                <div style={{ color: "red", fontSize: "0.8rem" }}>
                  {errors.password}
                </div>
            )}
            {errors.pwdStrength && (
                <div style={{ color: "red", fontSize: "0.8rem" }}>
                  {errors.pwdStrength}
                </div>
            )}
          </Form.Group>

          <Form.Group className="my-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Row>
              <Col xs={10}>
                <Form.Control
                    type={confirmPasswordType}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      borderColor:
                          errors.confirmPassword || errors.notMatch
                              ? "red"
                              : "",
                    }}
                />
              </Col>
              <Col xs={2} className="d-flex align-items-center">
                <Button onClick={showConfirmPasswordHandler} variant="" className="btn-submit w-100">
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </Col>
            </Row>
            {errors.confirmPassword && (
                <div style={{ color: "red", fontSize: "0.8rem" }}>
                  {errors.confirmPassword}
                </div>
            )}
            {errors.notMatch && (
                <div style={{ color: "red", fontSize: "0.8rem" }}>
                  {errors.notMatch}
                </div>
            )}
          </Form.Group>

          <Button
              variant=""
              className="my-3"
              type="submit"
              style={{ backgroundColor: "rgb(33, 182, 168)", color: "white" }}
          >
            Register
          </Button>
        </Form>

        {registerReducer.loading ? (
            <Loader />
        ) : (
            <Row className="py-3">
              <Col>
                Have an Account?{" "}
                <Link to="/" style={{ color: "rgb(33, 182, 168)" }}>
                  {" "}
                  <b>Login</b>{" "}
                </Link>
              </Col>
            </Row>
        )}
      </FormContainer>
  );
};

export default RegisterPage;
