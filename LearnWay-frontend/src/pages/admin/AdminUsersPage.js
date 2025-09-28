import React, { useEffect, useState } from "react";
import { Table, Button, Container, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [expandedUserId, setExpandedUserId] = useState(null);
    const [courses, setCourses] = useState({});
    const rawToken = localStorage.getItem("jwtToken");
    const token = rawToken ? rawToken.replace(/^"|"$/g, "") : null;

    const [searchTerm, setSearchTerm] = useState("");

    // Dohvat svih korisnika
    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            swal("Error", "Could not fetch users", "error");
        }
    };

    // Dohvat kurseva za instruktore i studente
    const fetchUserCourses = async (user) => {
        try {
            if (courses[user.userId]) return; // ako je već dohvaćeno

            let response;
            if (user?.roleName === "INSTRUCTOR") {
                response = await axios.get(`/api/course/by-instructor/${user.userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else if (user?.roleName === "USER") {
                response = await axios.get(`/api/course/student/${user.userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            setCourses((prev) => ({ ...prev, [user.userId]: response.data }));
        } catch (error) {
            console.error("Error fetching courses:", error);
            swal("Error", "Could not fetch courses", "error");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Deaktivacija korisnika
    const handleDeactivate = async (userId) => {
        if (!token) {
            swal("Error", "You are not authenticated!", "error");
            return;
        }

        swal({
            title: "Are you sure?",
            text: "Once deactivated, this user will be removed from the system!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(async (willDelete) => {
            if (willDelete) {
                try {
                    await axios.delete(`/api/users/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    swal("Success", "User has been deactivated!", "success");
                    fetchUsers();
                } catch (error) {
                    console.error("Error deleting user:", error);
                    swal("Error", "Could not deactivate user because of active courses", "error");
                }
            }
        });
    };

    // Toggle prikaza kurseva
    const toggleExpand = (user) => {
        if (expandedUserId === user.userId) {
            setExpandedUserId(null);
        } else {
            setExpandedUserId(user.userId);
            fetchUserCourses(user);
        }
    };

    const whiteTextStyle = { color: "white", fontWeight: "normal" };

    // Filter po pretraživanju
    const filteredUsers = users.filter((user) => {
        const firstName = user.firstName ? user.firstName.toLowerCase() : "";
        const lastName = user.lastName ? user.lastName.toLowerCase() : "";
        const username = user.username ? user.username.toLowerCase() : "";
        const role = user?.roleName ? user.roleName.toLowerCase() : "";
        const term = searchTerm.toLowerCase();

        return (
            firstName.includes(term) ||
            lastName.includes(term) ||
            username.includes(term) ||
            role.includes(term)
        );
    });

    return (
        <Container className="mt-4">
            <h2 style={whiteTextStyle}>All Users</h2>
            <Form.Control
                type="text"
                placeholder="Search users..."
                className="mb-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th style={whiteTextStyle}>First Name</th>
                    <th style={whiteTextStyle}>Last Name</th>
                    <th style={whiteTextStyle}>Username</th>
                    <th style={whiteTextStyle}>Role</th>
                    <th style={whiteTextStyle}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                        const roleName = user?.roleName || "N/A";
                        const displayRole = roleName === "USER" ? "STUDENT" : roleName;

                        return (
                            <React.Fragment key={user.userId}>
                                <tr style={whiteTextStyle}>
                                    <td style={whiteTextStyle}>{user.firstName}</td>
                                    <td style={whiteTextStyle}>{user.lastName}</td>
                                    <td style={whiteTextStyle}>{user.username}</td>
                                    <td style={whiteTextStyle}>{displayRole}</td>
                                    <td>
                                        {roleName !== "ADMIN" && user.username !== "admin" && (
                                            <>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDeactivate(user.userId)}
                                                >
                                                    Deactivate
                                                </Button>{" "}
                                                {(roleName === "INSTRUCTOR" || roleName === "USER") && (
                                                    <Button
                                                        variant="info"
                                                        onClick={() => toggleExpand(user)}
                                                    >
                                                        <FaBook /> Courses
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>

                                {expandedUserId === user.userId && (
                                    <tr>
                                        <td colSpan="5" style={{ color: "white" }}>
                                            <strong>Courses:</strong>
                                            <ul>
                                                {courses[user.userId]?.length > 0 ? (
                                                    courses[user.userId].map((course) => (
                                                        <li key={course.courseId}>
                                                            <Link
                                                                to={`/admin/course/${course.courseId}`}
                                                                style={{ color: "#0dcaf0", textDecoration: "none" }}
                                                            >
                                                                {course.title} - {course.category.title}
                                                            </Link>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>No courses found.</li>
                                                )}
                                            </ul>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="5" style={{ textAlign: "center", color: "white" }}>
                            No users found.
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>
        </Container>
    );
};

export default AdminUsersPage;
