import axios from "axios";

const addLesson = async (lesson, courseId, token) => {
    console.log("Token:", token); // Provjeri je li token ispravan

    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        console.log("NOVI TOKEN ", token);

        const { data } = await axios.post(`/api/lesson/api/lesson/${courseId}`, lesson, config);
        console.log("Backend response:", data); // Provjeri što backend vraća
        console.log("Sending request to /api/lesson/", courseId); // Provjeri id
        return { data: data, isAdded: true, error: null };
    } catch (error) {
        return { data: null, isAdded: false, error: error.response.statusText };
    }
};

const fetchLessons = async (token) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        const { data } = await axios.get("/api/lesson/", config);
        return data;
    } catch (error) {
        return error.response.statusText;
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
    addLesson,  // Including addLesson as part of an object
    fetchLessons,
};

export default lessonsService;
