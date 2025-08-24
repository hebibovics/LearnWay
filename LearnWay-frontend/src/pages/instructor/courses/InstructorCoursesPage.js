import React, { useEffect, useState } from "react";
import "../../admin/categories/AdminCategoriesPage.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, ListGroup } from "react-bootstrap";
import * as coursesConstants from "../../../constants/coursesConstants";
import Loader from "../../../components/Loader";
import Message from "../../../components/Message";
import SidebarInstructor from "../../../components/SidebarInstructor";
import {
    deleteCourse,
    fetchCourses,
} from "../../../actions/coursesActions";
import swal from "sweetalert";

const InstructorCoursesPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const rawToken = localStorage.getItem("jwtToken");
    const token = rawToken ? rawToken.replace(/^"|"$/g, "") : null;
    console.log("Raw token from localStorage:", localStorage.getItem("jwtToken"));



    const categoriesReducer = useSelector((state) => state.categoriesReducer);
    const [courses, setCourses] = useState(categoriesReducer.categories);

    const courseClickHandler = (catId) => {
        navigate(`/adminQuizzes/?catId=${catId}`);
    };

    const addNewCourseHandler = () => {
        navigate("/adminAddCategory");
    };

    const updateCourseHandler = (event, course) => {
        event.stopPropagation();
        navigate(`/adminUpdateCategory/${course.id}/`);
    };

    const deleteCourseHandler = (event, course) => {
        event.stopPropagation();
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this course!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                deleteCourse(dispatch, course.id, token).then((data) => {
console.log("sad ovaj", token);
                    console.log("Deleting course with token:", token);

                    if (data.type === coursesConstants.DELETE_COURSE_SUCCESS) {
                        swal(
                            "Course Deleted!",
                            `${course.title} succesfully deleted`,
                            "success"
                        );
                    } else {
                        console.log("sad ovaj", token);
                        swal(
                            "Course Not Deleted!",
                            `${course.title} not deleted`,
                            "error"
                        );
                    }
                });
            } else {
                swal(`${course.title} is safe`);
            }
        });
    };

    useEffect(() => {
        if (!localStorage.getItem("jwtToken")) navigate("/");
    }, []);

    useEffect(() => {
        if (courses.length === 0) {
            fetchCourses(dispatch, token).then((data) => {
                setCourses(data.payload);
            });
        }
    }, []);

    return (
        <div className="adminCategoriesPage__container">
            <div className="adminCategoriesPage__sidebar">
                <SidebarInstructor />
            </div>
            <div className="adminCategoriesPage__content">
                <h2>Courses</h2>
                {courses ? (
                    courses.length === 0 ? (
                        <Message>
                            No courses are present. Try adding some courses.
                        </Message>
                    ) : (
                        courses.map((c, index) => {
                            return (
                                <ListGroup
                                    className="adminCategoriesPage__content--categoriesList"
                                    key={index}
                                >
                                    <ListGroup.Item
                                        style={{ borderWidth: "0px" }}
                                        className="d-flex"
                                        onClick={() => courseClickHandler(c.id)}
                                    >
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">{c.title}</div>
                                            {c.description}
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                height: "90%",
                                                margin: "auto 2px",
                                            }}
                                        >
                                            <div
                                                onClick={(event) => updateCourseHandler(event, c)}
                                                style={{
                                                    margin: "2px 8px",
                                                    textAlign: "center",
                                                    color: "rgb(68 177 49)",
                                                    fontWeight: "500",
                                                    cursor:"pointer"
                                                }}
                                            >{`Update`}</div>

                                            <div
                                                onClick={(event) => deleteCourseHandler(event, c)}
                                                style={{
                                                    margin: "2px 8px",
                                                    textAlign: "center",
                                                    color: "red",
                                                    fontWeight: "500",
                                                    cursor:"pointer"
                                                }}
                                            >{`Delete`}</div>
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                            );
                        })
                    )
                ) : (
                    <Loader />
                )}
                <Button
                    variant=""
                    className="adminCategoriesPage__content--button"
                    onClick={addNewCourseHandler}
                >
                    Add Course
                </Button>
            </div>
        </div>
    );
};

export default InstructorCoursesPage;
