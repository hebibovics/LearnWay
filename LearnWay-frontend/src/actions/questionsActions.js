import axios from "axios";
import * as questionsConstants from "../constants/questionsConstants";

export const addQuestion = async (dispatch, question, token) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        };

        const { data } = await axios.post("/api/question/", question, config);

        dispatch({
            type: questionsConstants.ADD_QUESTION_SUCCESS,
            payload: data
        });

        return { type: questionsConstants.ADD_QUESTION_SUCCESS };
    } catch (error) {
        dispatch({
            type: questionsConstants.ADD_QUESTION_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
        });

        return { type: questionsConstants.ADD_QUESTION_FAIL };
    }
};
