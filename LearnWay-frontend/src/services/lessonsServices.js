import axios from "axios";

const fetchLessons = async (token) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const { data } = await axios.get("/api/lesson/", config);
        console.log("lessonService:fetchlessons() Success: ", data);
        return data;
    } catch (error) {
        console.error(
            "lessonService:fetchlessons() Error: ",
            error.response.statusText
        );
        return error.response.statusText;
    }
};

const addLesson = async (lesson, token) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const { data } = await axios.post("/api/lesson/", lesson, config);
        console.log("lessonService:addClesson() Success: ", data);
        return { data: data, isAdded: true, error: null };
    } catch (error) {
        console.error(
            "lessonService:addlesson() Error: ",
            error.response.statusText
        );
        return { data: null, isAdded: false, error: error.response.statusText };
    }
};

//const deleteCourse = async (courseId, token) => {
//    try {
//        const config = {
//            headers: { Authorization: `Bearer ${token}` },
//        };
//        const { data } = await axios.delete(`/api/course/${courseId}/`, config);
//        console.log("courseService:deleteCourse()  Success: ", data);
//        return {
//            isDeleted: true,
//            error: null,
//        };
//    } catch (error) {
//        console.error(
//            "courseService:deleteCourse()  Error: ",
//            error.response.statusText
//        );
//        return {
//            isDeleted: false,
//            error: error.response.statusText,
//        };
//    }
//};

//const updateCourse = async (course, token) => {
//    try {
//        const config = {
//            headers: { Authorization: `Bearer ${token}` },
//        };
//        const { data } = await axios.put(
//            `/api/course/${course.courseId}/`,
//            course,
//            config
//        );
//        console.log("courseService:updateCourse()  Success: ", data);
//        return {
//            data: data,
//            isUpdated: true,
//            error: null,
//        };
//    } catch (error) {
//        console.error(
//            "courseService:updateCourse()  Error: ",
//            error.response.statusText
//        );
//        return {
//            data: null,
//            isUpdated: false,
//            error: error.response.statusText,
//        };
//    }
//};

const lessonsService = {
    addLesson,
    fetchLessons,
    //updateCourse,
    //deleteCourse,
};
export default lessonsService;
