import * as lessonsConstants from "../constants/lessonsConstants";
import lessonsServices from "../services/lessonsServices";

export const addLesson = async (dispatch, lesson, token) => {
    dispatch({ type: lessonsConstants.ADD_LESSON_REQUEST });
    const { data, isAdded, error } = await lessonsServices.addLesson(
        lesson,
        token
    );
    if (isAdded) {
        return dispatch({
            type: lessonsConstants.ADD_LESSON_SUCCESS,
            payload: data,
        });
    } else {
        return dispatch({
            type: lessonsConstants.ADD_LESSON_FAILURE,
            payload: error,
        });
    }
};

export const fetchLessons = async (dispatch, token) => {
    dispatch({ type: lessonsConstants.FETCH_LESSONS_REQUEST });
    const data = await lessonsServices.fetchLessons(token);
    if (data) {
        return dispatch({
            type: lessonsConstants.FETCH_LESSONS_SUCCESS,
            payload: data,
        });
    } else {
        return dispatch({
            type: lessonsConstants.FETCH_LESSONS_FAILURE,
            payload: data,
        });
    }
};

//export const updateCourse = async (dispatch, course, token) => {
//    dispatch({ type: coursesConstants.UPDATE_COURSE_REQUEST });
//    const { data, isUpdated, error } = await coursesServices.updateCourse(
//        course,
//        token
//    );
//    if (isUpdated) {
//        return dispatch({
//            type: coursesConstants.UPDATE_COURSE_SUCCESS,
//            payload: data,
//        });
//    } else {
//        return dispatch({
//            type: coursesConstants.UPDATE_COURSE_FAILURE,
//            payload: error,
//        });
//    }
//};
//
//export const deleteCourse = async (dispatch, courseId, token) => {
//    dispatch({ type: coursesConstants.DELETE_COURSE_REQUEST });
//    const { isDeleted, error } = await coursesServices.deleteCourse(
//        courseId,
//        token
//    );
//    if (isDeleted) {
//        return dispatch({
//            type: coursesConstants.DELETE_COURSE_SUCCESS,
//            payload: courseId,
//        });
//    } else {
//        return dispatch({
//            type: coursesConstants.DELETE_COURSE_FAILURE,
//            payload: error,
//        });
//    }
//};
