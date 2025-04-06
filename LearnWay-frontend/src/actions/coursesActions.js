import * as coursesConstants from "../constants/coursesConstants";
import coursesServices from "../services/coursesServices";

export const addCourse = async (dispatch, course, token, instructorId) => {
    dispatch({ type: coursesConstants.ADD_COURSE_REQUEST });
    const { data, isAdded, error } = await coursesServices.addCourse(course, token, instructorId);
    if (isAdded) {
        return dispatch({
            type: coursesConstants.ADD_COURSE_SUCCESS,
            payload: data,
        });
    } else {
        return dispatch({
            type: coursesConstants.ADD_COURSE_FAILURE,
            payload: error,
        });
    }
};


export const fetchCourses = async (dispatch, token) => {
    dispatch({ type: coursesConstants.FETCH_COURSES_REQUEST });
    const data = await coursesServices.fetchCourses(token);
    if (data) {
        return dispatch({
            type: coursesConstants.FETCH_COURSES_SUCCESS,
            payload: data,
        });
    } else {
        return dispatch({
            type: coursesConstants.FETCH_COURSES_FAILURE,
            payload: data,
        });
    }
};

export const updateCourse = async (dispatch, course, token) => {
    dispatch({ type: coursesConstants.UPDATE_COURSE_REQUEST });
    const { data, isUpdated, error } = await coursesServices.updateCourse(
        course,
        token
    );
    if (isUpdated) {
        return dispatch({
            type: coursesConstants.UPDATE_COURSE_SUCCESS,
            payload: data,
        });
    } else {
        return dispatch({
            type: coursesConstants.UPDATE_COURSE_FAILURE,
            payload: error,
        });
    }
};

export const deleteCourse = async (dispatch, courseId, token) => {
    dispatch({ type: coursesConstants.DELETE_COURSE_REQUEST });
    const { isDeleted, error } = await coursesServices.deleteCourse(
        courseId,
        token
    );
    if (isDeleted) {
        return dispatch({
            type: coursesConstants.DELETE_COURSE_SUCCESS,
            payload: courseId,
        });
    } else {
        return dispatch({
            type: coursesConstants.DELETE_COURSE_FAILURE,
            payload: error,
        });
    }
};
