import * as coursesConstants from "../constants/coursesConstants";

const coursesInitialState = {
    loading: false,
    error: null,
    courses: [],
    isAdded: false,
    isDeleted: false,
    isUpdated: false,
};

export const coursesReducer = (state = coursesInitialState, action) => {
    switch (action.type) {
        case coursesConstants.FETCH_COURSES_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case coursesConstants.FETCH_COURSES_SUCCESS:
            return {
                ...state,
                loading: false,
                courses: action.payload,
            };

        case coursesConstants.FETCH_COURSES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case coursesConstants.ADD_COURSE_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case coursesConstants.ADD_COURSE_SUCCESS:
            return {
                ...state,
                loading: false,
                isAdded: true,
                courses: [...state.courses, action.payload],
            };
        case coursesConstants.ADD_COURSE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case coursesConstants.DELETE_COURSE_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case coursesConstants.DELETE_COURSE_SUCCESS:
            const temp = state.courses;
            for (let i = 0; i < temp.length; i++) {
                if (temp[i].courseId == action.payload) {
                    temp.splice(i, 1);
                }
            }
            return {
                ...state,
                loading: false,
                isDeleted: true,
                courses: temp,
            };

        case coursesConstants.DELETE_COURSE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case coursesConstants.UPDATE_COURSE_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case coursesConstants.UPDATE_COURSE_SUCCESS:
            const temp2 = state.courses;
            temp2.forEach((course) => {
                if (course.courseId == action.payload.courseId) {
                    course.title = action.payload.title;
                    course.description = action.payload.description;
                }
            });
            return {
                ...state,
                loading: false,
                isUpdated: true,
                courses: temp2,
            };

        case coursesConstants.UPDATE_COURSE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

const addcourseInitialState = {
    loading: false,
    error: null,
    isAdded: false,
};
