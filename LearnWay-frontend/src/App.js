import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfilePage from "./pages/users/UserProfilePage";
import InstructorProfilePage from "./pages/instructor/InstructorProfilePage";
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
import CourseDetailsInstructor from "./pages/instructor/courses/CourseDetailsInstructor";
import InstructorAddLesson from "./pages/instructor/lessons/InstructorAddLesson";
import InstructorLessonsPage from "./pages/instructor/lessons/InstructorLessonsPage";
import LessonPageInstructor from  "./pages/instructor/lessons/LessonPageInstructor "
import InstructorAddQuiz from "./pages/instructor/quizzes/InstructorAddQuiz";
import InstructorViewQuizzes from "./pages/instructor/quizzes/InstructorViewQuizzes";
import InstructorAddQuestion from "./pages/instructor/questions/InstructorAddQuestion";
import InstructorQuestionsPage from "./pages/instructor/questions/InstructorQuestionsPage";
import StudentQuizzesPage from "./pages/users/StudentQuizzesPage"
import StudentTakeQuizPage from "./pages/users/StudentTakeQuizPage";
import UpdateLessonInstructor from "./pages/instructor/lessons/UpdateLessonInstructor";
import LessonPageStudent from "./pages/users/LessonPageSudent";
import StudentQuizResultsPage from "./pages/users/StudentQuizResultsPage";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage";
import AdminCourseDetailsPage from "./pages/admin/AdminCourseDetailsPage";
import AdminLessonPage from "./pages/admin/AdminLessonPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminQuizzesPage from "./pages/admin/AdminQuizzesPage";
import AdminQuizDetailsPage from "./pages/admin/AdminQuizDetailsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import InstructorCoursesPage from "./pages/instructor/courses/InstructorCoursesPage";
import AdminResourcesPage from "./pages/admin/AdminResourcesPage";
import ServiceDeskPage from "./pages/ServiceDeskPage";

const App = () => {
  return (
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>

          <Route path="/aboutUs/" element={<AboutUs/>}/>
          <Route path="/home/" element={<Home/>}/>

          <Route path="/adminProfile" element={<AdminProfilePage/>}/>
          <Route path="/adminCourses" element={<AdminCoursesPage/>}/>
          <Route path="/adminUsers" element={<AdminUsersPage/>}/>
          <Route path="/admin/course/:id" element={<AdminCourseDetailsPage/>}/>
          <Route path="/adminLesson/:id" element={<AdminLessonPage/>}/>
          <Route path="/adminQuizzes" element={<AdminQuizzesPage/>}/>
          <Route path="/adminQuiz/:id" element={<AdminQuizDetailsPage />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/adminResources" element={<AdminResourcesPage />} />

          <Route path="/instructorProfile" element={<InstructorProfilePage/>}/>
          <Route path="/instructorAddCourse" element={<InstructorAddCoursePage/>}/>
          <Route path="/courseInstructor/:id" element={<CourseDetailsInstructor/>}/>
          <Route path="/instructorAddLesson/:id" element={<InstructorAddLesson/>}/>
          <Route path="/instructorLessons/:id" element={<InstructorLessonsPage/>}/>
          <Route path="/instructorLessons/:courseId/:lessonId" element={<LessonPageInstructor/>}/>
          <Route path="/updateLesson/:courseId/:lessonId" element={<UpdateLessonInstructor/>} />
          <Route path="/instructorCourse/:id/addQuiz" element={<InstructorAddQuiz />} />
          <Route path="/instructor/course/:id/quizzes" element={<InstructorViewQuizzes />} />
          <Route path="/instructor/quiz/:quizId/add-questions" element={<InstructorAddQuestion />} />
          <Route path="/instructor/quiz/:quizId/questions" element={<InstructorQuestionsPage />} />
          <Route path="/instructorCourses" element={<InstructorCoursesPage />} />


          <Route path="/userServiceDesk" element={<ServiceDeskPage />} />



          <Route path="/profile" element={<UserProfilePage/>}/>
          <Route path="/quizResults" element={<StudentQuizResultsPage />} />
          <Route path="/course/:id" element={<CourseDetails/>}/>
          <Route path="/lessonPage/:courseId/:lessonId" element={<LessonPageStudent />} />
          <Route path="/studentQuizzes/:id" element={<StudentQuizzesPage/>}/>
          <Route path="/studentTakeQuiz/:quizId" element={<StudentTakeQuizPage  />} />




          <Route path="/dataScience/" element={<DataScience/>}/>
          <Route path="/designTools/" element={<DesignTools/>}/>
          <Route path="/DigitalMarketing/" element={<DigitalMarketing/>}/>
          <Route path="/OtherCourses/" element={<OtherCourses/>}/>
          <Route path="/ProgrammingLanguages/" element={<Programming/>}/>
          <Route path="/ProjectManagement/" element={<ProjectManagement/>}/>
          <Route path="/SoftSkills/" element={<SoftSkills/>}/>
          <Route path="/WebDesign/" element={<WebDesign/>}/>
          <Route path="/WebDevelopment" element={<WebDev/>}/>




        </Routes>
      </Router>
  );
};

export default App;
