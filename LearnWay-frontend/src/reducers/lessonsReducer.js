import * as lessonsConstants from "../constants/lessonsConstants";

const lessonsInitialState = {
    loading: false,
    error: null,
    lessons: [],
    isAdded: false,
    isDeleted: false,
    isUpdated: false,
};

export const lessonsReducer = (state = lessonsInitialState, action) => {
    switch (action.type) {
        case lessonsConstants.FETCH_LESSONS_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case lessonsConstants.FETCH_LESSONS_SUCCESS:
            return {
                ...state,
                loading: false,
                lessons: action.payload,
            };

        case lessonsConstants.FETCH_LESSONS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case lessonsConstants.ADD_LESSON_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case lessonsConstants.ADD_LESSON_SUCCESS:
            return {
                ...state,
                loading: false,
                isAdded: true,
                lessons: [...state.lessons, action.payload],
            };
        case lessonsConstants.ADD_LESSON_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        //case lessonsConstants.DELETE_LESSON_REQUEST:
        //    return {
        //        ...state,
        //        loading: true,
        //    };
        //
        //case lessonsConstants.DELETE_LESSON_SUCCESS:
        //    const temp = state.courses;
        //    for (let i = 0; i < temp.length; i++) {
        //        if (temp[i].courseId == action.payload) {
        //            temp.splice(i, 1);
        //        }
        //    }
        //    return {
        //        ...state,
        //        loading: false,
        //        isDeleted: true,
        //        courses: temp,
        //    };
        //
        //case coursesConstants.DELETE_COURSE_FAILURE:
        //    return {
        //        ...state,
        //        loading: false,
        //        error: action.payload,
        //    };
        //
        //case coursesConstants.UPDATE_COURSE_REQUEST:
        //    return {
        //        ...state,
        //        loading: true,
        //    };
        //
        //case coursesConstants.UPDATE_COURSE_SUCCESS:
        //    const temp2 = state.courses;
        //    temp2.forEach((course) => {
        //        if (course.courseId == action.payload.courseId) {
        //            course.title = action.payload.title;
        //            course.description = action.payload.description;
        //        }
        //    });
        //    return {
        //        ...state,
        //        loading: false,
        //        isUpdated: true,
        //        courses: temp2,
        //    };
        //
        //case coursesConstants.UPDATE_COURSE_FAILURE:
        //    return {
        //        ...state,
        //        loading: false,
        //        error: action.payload,
        //    };
        //
        //default:
        //    return state;
    }
};

const addlessonInitialState = {
    loading: false,
    error: null,
    isAdded: false,
};
