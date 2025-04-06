import React, { useEffect } from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { fetchCategories } from "../../actions/categoriesActions";
import { fetchQuizzes } from "../../actions/quizzesActions";
import SidebarInstructor from "../../components/SidebarInstructor";
import "../users/UserProfilePage.css";
const InstructorProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginReducer = useSelector((state) => state.loginReducer);
    const user = loginReducer.user;
    console.log("User object:", user);
    console.log("User object:", user.firstName);
    const token = JSON.parse(localStorage.getItem("jwtToken"));

    useEffect(() => {
        fetchCategories(dispatch, token);
    }, [dispatch]);

   // useEffect(() => {
     //   fetchQuizzes(dispatch, token);
    //}, [dispatch]);

    useEffect(() => {
        if (!localStorage.getItem("jwtToken")) navigate("/");
        console.log("User state in Redux:", user);
    }, []);

    return (
        <div className="userProfilePage__container">
            <div className="userProfilePage__sidebar">
                <SidebarInstructor />
            </div>
            {user && (
                <div className="userProfilePage__content">

                    <Table bordered className="userProfilePage__content--table">
                        <tbody>
                        <tr>
                            <td>Name</td>
                            <td>{`${user.firstName} ${user.lastName}`}</td>
                        </tr>
                        <tr>
                            <td>Username</td>
                            <td>{user.username}</td>
                        </tr>
                        <tr>
                            <td>Phone</td>
                            <td>{user.phoneNumber}</td>
                        </tr>
                        <tr>
                            <td>Role</td>
                            <td>{user.roles[0].roleName}</td>
                        </tr>
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default InstructorProfilePage;
