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


export const fetchCourses = async (dispatch, token, instructorId) => {
    dispatch({ type: coursesConstants.FETCH_COURSES_REQUEST });
    const data = await coursesServices.fetchCourses(token, instructorId);
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
    console.log("Ovsj token", token);
    const { isDeleted, error } = await coursesServices.deleteCourse(
        courseId,
        token,
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

export const fetchUserCourses = (dispatch, token, userId) => {
    return fetch(`http://localhost:8081/api/course/student/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((data) => {
            dispatch({
                type: "FETCH_USER_COURSES_SUCCESS",
                payload: data,
            });
            return { payload: data };
        })
        .catch((error) => {
            console.error("Error fetching user courses:", error);
            return { payload: [] };
        });
};
