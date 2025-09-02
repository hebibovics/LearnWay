import React, { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { FaBook } from "react-icons/fa";

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [expandedUserId, setExpandedUserId] = useState(null);
    const [courses, setCourses] = useState({});
    const rawToken = localStorage.getItem("jwtToken");
    const token = rawToken ? rawToken.replace(/^"|"$/g, "") : null;
    console.log("Token:", token);


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


    const fetchInstructorCourses = async (userId) => {
        try {
            if (courses[userId]) return;

            const response = await axios.get(`/api/course/by-instructor/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCourses((prev) => ({ ...prev, [userId]: response.data }));
        } catch (error) {
            console.error("Error fetching courses:", error);
            swal("Error", "Could not fetch instructor courses", "error");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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


    const toggleExpand = (userId) => {
        if (expandedUserId === userId) {
            setExpandedUserId(null); // da zatvori ako je već otvoren
        } else {
            setExpandedUserId(userId);
            fetchInstructorCourses(userId);
        }
    };

    const whiteTextStyle = { color: "white", fontWeight: "normal" };

    return (
        <Container className="mt-4">
            <h2 style={whiteTextStyle}>All Users</h2>
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
                {users.length > 0 ? (
                    users.map((user) => {
                        const roleName = user.role?.roleName || "N/A";
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
                                                {roleName === "INSTRUCTOR" && (
                                                    <Button
                                                        variant="info"
                                                        onClick={() => toggleExpand(user.userId)}
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
                                                        <li key={course.courseId}>{course.title} - {course.category.title}</li>
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
