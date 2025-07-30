import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import AdminAddCategoryPage from "./pages/admin/categories/AdminAddCategoryPage";
import AdminCategoriesPage from "./pages/admin/categories/AdminCategoriesPage";
import AdminUpdateCategoryPage from "./pages/admin/categories/AdminUpdateCategoryPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminQuizzesPage from "./pages/admin/quizzes/AdminQuizzesPage";
import AdminAddQuiz from "./pages/admin/quizzes/AdminAddQuiz";
import AdminUpdateQuiz from "./pages/admin/quizzes/AdminUpdateQuiz";
import AdminQuestionsPage from "./pages/admin/questions/AdminQuestionsPage";
import AdminAddQuestionsPage from "./pages/admin/questions/AdminAddQuestionsPage";
import AdminUpdateQuestionPage from "./pages/admin/questions/AdminUpdateQuestionPage";
import UserProfilePage from "./pages/users/UserProfilePage";
import InstructorProfilePage from "./pages/instructor/InstructorProfilePage";
import UserQuizzesPage from "./pages/users/UserQuizzesPage";
import UserQuizManualPage from "./pages/users/UserQuizManualPage";
import UserQuestionsPage from "./pages/users/UserQuestionsPage";
import UserQuizResultPage from "./pages/users/UserQuizResultPage";
import AdminQuizResultPage from "./pages/admin/AdminQuizResultPage";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import DataScience from "./pages/course fields/DataScience";
import Programming from "./pages/course fields/Programming";
import DesignTools from "./pages/course fields/DesignTools";
import DigitalMarketing from "./pages/course fields/DigitalMarketing";
import OtherCourses from "./pages/course fields/OtherCourses";
import ProjectManagement from "./pages/course fields/ProjectManagement";
import SoftSkills from "./pages/course fields/SoftSkills";
import WebDesign from "./pages/course fields/WebDesign";
import WebDev from "./pages/course fields/WebDev";
import CourseDetails from "./pages/course fields/CourseDetails";
import InstructorAddCoursePage from "./pages/instructor/courses/InstructorAddCoursePage";
import InstructorCoursesPage from "./pages/instructor/courses/InstructorCoursesPage";
import CourseDetailsInstructor from "./pages/instructor/courses/CourseDetailsInstructor";
import InstructorAddLesson from "./pages/instructor/lessons/InstructorAddLesson";
import InstructorLessonsPage from "./pages/instructor/lessons/InstructorLessonsPage";
import LessonPageInstructor from  "./pages/instructor/lessons/LessonPageInstructor "
import UserLessonPage from "./pages/users/UserLessonPage";
import QuizListPage from "./pages/users/QuizListPage";
import QuizSolvePage from "./pages/users/QuizSolvePage";
import QuizDetailsPage from "./pages/users/QuizDetailsPage";
import InstructorAddQuiz from "./pages/instructor/quizzes/InstructorAddQuiz";
import InstructorViewQuizzes from "./pages/instructor/quizzes/InstructorViewQuizzes";
import InstructorAddQuestion from "./pages/instructor/questions/InstructorAddQuestion";
import InstructorQuestionsPage from "./pages/instructor/questions/InstructorQuestionsPage";
import StudentQuizzesPage from "./pages/users/StudentQuizzesPage"
import StudentTakeQuizPage from "./pages/users/StudentTakeQuizPage";

const App = () => {
  return (
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/adminProfile" element={<AdminProfilePage/>}/>
          <Route path="/adminCategories" element={<AdminCategoriesPage/>}/>
          <Route path="/adminAddCategory" element={<AdminAddCategoryPage/>}/>
          <Route
              path="/adminUpdateCategory/:catId"
              element={<AdminUpdateCategoryPage/>}
          />
          <Route path="/adminQuizzes" element={<AdminQuizzesPage/>}/>
          <Route path="/adminAddQuiz" element={<AdminAddQuiz/>}/>
          <Route path="/adminUpdateQuiz/:quizId" element={<AdminUpdateQuiz/>}/>
          <Route path="/adminQuestions" element={<AdminQuestionsPage/>}/>
          <Route path="/adminAddQuestion" element={<AdminAddQuestionsPage/>}/>
          <Route path="/adminallResult" element={<AdminQuizResultPage/>}/>
          <Route
              path="/adminUpdateQuestion/:quesId"
              element={<AdminUpdateQuestionPage/>}
          />
          <Route path="/profile" element={<UserProfilePage/>}/>


          <Route path="/instructorProfile" element={<InstructorProfilePage/>}/>
          <Route path="/instructorAddCourse" element={<InstructorAddCoursePage/>}/>
          <Route path="/instructorCourses" element={<InstructorCoursesPage/>}/>
          <Route path="/courseInstructor/:id" element={<CourseDetailsInstructor/>}/>
          <Route path="/instructorAddLesson/:id" element={<InstructorAddLesson/>}/>
          <Route path="/instructorLessons/:id" element={<InstructorLessonsPage/>}/>

          <Route path="/aboutUs/" element={<AboutUs/>}/>
          <Route path="/home/" element={<Home/>}/>

          <Route path="/dataScience/" element={<DataScience/>}/>
          <Route path="/course/:id" element={<CourseDetails/>}/>
          <Route path="/studentQuizzes/:id" element={<StudentQuizzesPage/>}/>

          <Route path="/designTools/" element={<DesignTools/>}/>
          <Route path="/DigitalMarketing/" element={<DigitalMarketing/>}/>
          <Route path="/OtherCourses/" element={<OtherCourses/>}/>
          <Route path="/ProgrammingLanguages/" element={<Programming/>}/>
          <Route path="/ProjectManagement/" element={<ProjectManagement/>}/>
          <Route path="/SoftSkills/" element={<SoftSkills/>}/>
          <Route path="/WebDesign/" element={<WebDesign/>}/>
          <Route path="/WebDevelopment" element={<WebDev/>}/>

          <Route path="/instructorLessons/:courseId/:lessonId" element={<LessonPageInstructor/>}/>
          <Route path="/lesson/:lessonId" element={<UserLessonPage/>}/>



          <Route path="/instructorCourse/:id/addQuiz" element={<InstructorAddQuiz />} />
          <Route path="/instructor/course/:id/quizzes" element={<InstructorViewQuizzes />} />
          <Route path="/instructor/quiz/:quizId/add-questions" element={<InstructorAddQuestion />} />
          <Route path="/instructor/quiz/:quizId/questions" element={<InstructorQuestionsPage />} />
          <Route path="/studentTakeQuiz/:quizId" element={<StudentTakeQuizPage  />} />

        </Routes>
      </Router>
  );
};

export default App;
