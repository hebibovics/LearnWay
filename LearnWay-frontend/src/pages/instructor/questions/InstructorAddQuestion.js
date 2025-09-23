import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import swal from "sweetalert";
import { addQuestion } from "../../../actions/questionsActions";
import FormContainer from "../../../components/FormContainer";
import * as questionsConstants from "../../../constants/questionsConstants";
import "../../admin/questions/AdminAddQuestionsPage.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaQuestionCircle } from "react-icons/fa"; // ikonica upitnika

const InstructorAddQuestion = () => {
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [answer, setAnswer] = useState(null);
    const [showInfo, setShowInfo] = useState(false); // za modal

    const dispatch = useDispatch();
    const { quizId } = useParams();
    const token = JSON.parse(localStorage.getItem("jwtToken"));

    const onSelectAnswerHandler = (e) => {
        setAnswer(e.target.value);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (answer !== null && answer !== "n/a") {
            const question = {
                content,
                image,
                option1,
                option2,
                option3,
                option4,
                answer,
                quiz: { quizId },
            };

            addQuestion(dispatch, question, token).then((data) => {
                if (data.type === questionsConstants.ADD_QUESTION_SUCCESS)
                    swal("Question Added!", `${content} successfully added`, "success");
                else
                    swal("Question Not Added!", `${content} not added`, "error");
            });
        } else {
            alert("Select valid answer!");
        }
    };

    return (
        <div className="adminAddQuestionPage__container">


            <div className="adminAddQuestionPage__content">
                <FormContainer>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                        <h2 style={{ margin: 0, marginRight: "8px" }}>Add Question</h2>
                        <FaQuestionCircle
                            size={22}
                            style={{ cursor: "pointer", color: "#0d6efd" }}
                            onClick={() => setShowInfo(true)}
                        />
                    </div>
                    <Form onSubmit={submitHandler}>
                        <Form.Group className="my-3" controlId="content">
                            <Form.Label>Question</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows="3"
                                placeholder="Enter Question Content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="my-3" controlId="option1">
                            <Form.Label>Option 1</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows="2"
                                placeholder="Enter Option 1"
                                value={option1}
                                onChange={(e) => setOption1(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="my-3" controlId="option2">
                            <Form.Label>Option 2</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows="2"
                                placeholder="Enter Option 2"
                                value={option2}
                                onChange={(e) => setOption2(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="my-3" controlId="option3">
                            <Form.Label>Option 3</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows="2"
                                placeholder="Enter Option 3"
                                value={option3}
                                onChange={(e) => setOption3(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="my-3" controlId="option4">
                            <Form.Label>Option 4</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows="2"
                                placeholder="Enter Option 4"
                                value={option4}
                                onChange={(e) => setOption4(e.target.value)}
                            />
                        </Form.Group>

                        <div className="my-3">
                            <label htmlFor="answer-select">Choose Correct Option:</label>
                            <Form.Select
                                id="answer-select"
                                onChange={onSelectAnswerHandler}
                            >
                                <option value="n/a">Choose Option</option>
                                <option value="option1">Option 1</option>
                                <option value="option2">Option 2</option>
                                <option value="option3">Option 3</option>
                                <option value="option4">Option 4</option>
                            </Form.Select>
                        </div>

                        <Button className="my-5" type="submit" variant="primary">
                            Add
                        </Button>
                    </Form>
                </FormContainer>
            </div>

            {/* Modal */}
            {showInfo && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header text-dark">
                                <h5 className="modal-title">Question Information</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowInfo(false)}
                                ></button>
                            </div>
                            <div className="modal-body text-dark">
                                <p>
                                    Here you can add questions <b>only</b> of this type:
                                    four options and one correct answer.
                                    This format allows the system to automatically check students’ answers.
                                    No other question types are supported at the moment.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowInfo(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showInfo && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default InstructorAddQuestion;
