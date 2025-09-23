import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import "./InstructorAddCoursePage.css";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import SidebarInstructor from "../../../components/SidebarInstructor";
import FormContainer from "../../../components/FormContainer";
import * as coursesConstants from "../../../constants/coursesConstants";
import { addCourse } from "../../../actions/coursesActions";
import { fetchCategories } from "../../../actions/categoriesActions";

const InstructorAddCourse = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [maxMarks, setMaxMarks] = useState(0);
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);


    const categoriesReducer = useSelector((state) => state.categoriesReducer);

    const [categories, setCategories] = useState(categoriesReducer.categories);



    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onClickPublishedHandler = () => {
        setIsActive(!isActive);
    };

    const onSelectCategoryHandler = (e) => {
        setSelectedCategoryId(e.target.value);
    };

    const token = localStorage.getItem("jwtToken");
    const user = JSON.parse(localStorage.getItem("user"));
    const instructorId = user?.userId;

    console.log("JWT from localStorage:", token);
    console.log("User from localStorage:", user);
    console.log("Instructor ID:", instructorId);
    console.log("Raw token", token);



    const submitHandler = (e) => {
        e.preventDefault();

        if (selectedCategoryId !== null && selectedCategoryId !== "n/a") {
            const course = {
                title: title,
                description: description,
                category: {
                    catId: selectedCategoryId,
                    title: categories.filter((cat) => cat.catId == selectedCategoryId)[0][
                        "title"
                        ],
                    description: categories.filter(
                        (cat) => cat.catId == selectedCategoryId
                    )[0]["description"],
                },
            };
            addCourse(dispatch, course, token, instructorId).then((data) => {

                console.log("data payload:", data.payload);
                if (data.type === coursesConstants.ADD_COURSE_SUCCESS) {
                    swal("Course Added!", `${course.title} successfully added`, "success")
                        .then(() => {
                            navigate("/instructorProfile");
                        });
                } else {
                    swal("Course Not Added!", `${course.title} not added`, "error");
                }
            });
        }  else {
            swal("Invalid Category!", "Please select a valid category before adding the course.", "warning");
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("jwtToken")) navigate("/");
    }, []);

    useEffect(() => {
        if (categories.length === 0) {
            fetchCategories(dispatch, token).then((data) => {
                console.log("data payload:", data.payload);
                setCategories(data.payload);
            });
        }
    }, []);

    return (
        <div className="adminAddQuizPage__container">
            <div className="adminAddQuizPage__sidebar">
                <SidebarInstructor />
            </div>
            <div className="adminAddQuizPage__content">
                <FormContainer>
                    <h2>Add Course</h2>
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="my-3" controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Course Title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                }}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group className="my-3" controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                style={{ textAlign: "top" }}
                                as="textarea"
                                rows="3"
                                type="text"
                                placeholder="Enter Course Description"
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                            ></Form.Control>
                        </Form.Group>


                        <div className="my-3">
                            <label htmlFor="category-select">Choose a Category:</label>
                            <Form.Select
                                aria-label="Choose Category"
                                id="category-select"
                                onChange={onSelectCategoryHandler}
                            >
                                <option value="n/a">Choose Category</option>
                                {categories ? (
                                    categories.map((cat, index) => (
                                        <option key={index} value={cat.catId}>
                                            {cat.title}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Choose one from below</option>
                                )}
                                {/* <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option> */}
                            </Form.Select>
                        </div>
                        <Button
                            className="my-5 adminAddQuizPage__content--button"
                            type="submit"
                            variant="primary"
                            style={{ backgroundColor: "skyblue", borderColor: "lightskyblue", color: "black" }}
                        >
                            Add
                        </Button>
                    </Form>
                </FormContainer>
            </div>
        </div>
    );
};

export default InstructorAddCourse;
