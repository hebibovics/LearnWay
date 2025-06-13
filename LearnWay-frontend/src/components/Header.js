import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const loginReducer = useSelector((state) => state.loginReducer);
  const [isLoggedIn, setIsLoggedIn] = useState(loginReducer.loggedIn);
  const [profilePageUrl, setProfilePageUrl] = useState("");
  const [userRole, setUserRole] = useState("");


  const logoutHandler = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.getItem("jwtToken")) {
      setIsLoggedIn(true);
      let role = "";
      loginReducer.user.roles.map((r) => {
        if (r["roleName"] === "ADMIN") {
          setProfilePageUrl("/adminProfile");
          role = "ADMIN";
        } else if (r["roleName"] === "INSTRUCTOR") {
          setProfilePageUrl("/instructorProfile");
          role = "INSTRUCTOR";
        } else {
          setProfilePageUrl("/profile");
          role = "USER";
        }
      });
      setUserRole(role);
    }
  }, [navigate, loginReducer]);

  return (
      <header>
        <Navbar style={{ backgroundColor: "#1b263b" }} variant="dark" expand="lg" collapseOnSelect>
        <Container>
            <Navbar.Brand>LearnWay</Navbar.Brand>

            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="justify-content-end flex-grow-1 pe-3">
                {/* Conditionally render the Home link based on user role */}
                    <LinkContainer to="/home">
                      <Nav.Link>Home</Nav.Link>
                    </LinkContainer>

                <LinkContainer to="/aboutUs">
                  <Nav.Link>About Us</Nav.Link>
                </LinkContainer>

                {isLoggedIn ? (
                    <LinkContainer to={profilePageUrl}>
                      <Nav.Link>{loginReducer.user.firstName}</Nav.Link>
                    </LinkContainer>
                ) : (
                    <LinkContainer to="/">
                      <Nav.Link>Login</Nav.Link>
                    </LinkContainer>
                )}

                {isLoggedIn ? (
                    <LinkContainer to="/">
                      <Nav.Link onClick={logoutHandler}>Logout</Nav.Link>
                    </LinkContainer>
                ) : (
                    <LinkContainer to="/register">
                      <Nav.Link>Register</Nav.Link>
                    </LinkContainer>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
  );
};

export default Header;
