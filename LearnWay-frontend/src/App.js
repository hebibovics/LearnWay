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

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/adminProfile" element={<AdminProfilePage />} />
        <Route path="/adminCategories" element={<AdminCategoriesPage />} />
        <Route path="/adminAddCategory" element={<AdminAddCategoryPage />} />
        <Route
          path="/adminUpdateCategory/:catId"
          element={<AdminUpdateCategoryPage />}
        />
        <Route path="/adminQuizzes" element={<AdminQuizzesPage />} />
        <Route path="/adminAddQuiz" element={<AdminAddQuiz />} />
        <Route path="/adminUpdateQuiz/:quizId" element={<AdminUpdateQuiz />} />
        <Route path="/adminQuestions" element={<AdminQuestionsPage />} />
        <Route path="/adminAddQuestion" element={<AdminAddQuestionsPage />} />
        <Route path="/adminallResult" element={<AdminQuizResultPage />} />
        <Route
          path="/adminUpdateQuestion/:quesId"
          element={<AdminUpdateQuestionPage />}
        />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/quizzes" element={<UserQuizzesPage />} />
        <Route path="/quiz/*" element={<UserQuizzesPage />} />
        <Route path="/quizManual/" element={<UserQuizManualPage />} />
        <Route path="/questions/" element={<UserQuestionsPage />} />
        <Route path="/quizResults/" element={<UserQuizResultPage />} />

        <Route path="/aboutUs/" element={<AboutUs />} />
        <Route path="/home/" element={<Home />} />

        <Route path="/dataScience/" element={<DataScience />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/designTools/" element={<DesignTools />} />
        <Route path="/DigitalMarketing/" element={<DigitalMarketing />} />
        <Route path="/OtherCourses/" element={<OtherCourses />} />
        <Route path="/ProgrammingLanguages/" element={<Programming />} />
        <Route path="/ProjectManagement/" element={<ProjectManagement />} />
        <Route path="/SoftSkills/" element={<SoftSkills />} />
        <Route path="/WebDesign/" element={<WebDesign />} />
        <Route path="/WebDevelopment" element={<WebDev/>} />
      </Routes>
    </Router>
  );
};

export default App;
