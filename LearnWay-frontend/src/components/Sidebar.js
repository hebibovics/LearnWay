import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { FaBars, FaUserAlt, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { MdQueue, MdQuiz, MdBackup, MdDashboard } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../actions/coursesActions";
import { TbLayoutGrid } from "react-icons/tb";

const Sidebar = ({ children }) => {
  const categoriesReducer = useSelector((state) => state.categoriesReducer);
  const [courses, setCourses] = useState(categoriesReducer.categories);
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("jwtToken"));
  const user = JSON.parse(localStorage.getItem("user"));
  const instructorId = user?.userId;

  const [menuItems, setMenuItems] = useState([
    { path: "/adminProfile", name: "Profile", icon: <FaUserAlt /> },
    { path: "/adminCourses", name: "View All Courses", icon: <TbLayoutGrid /> },
    { path: "/adminUsers", name: "View All Users", icon: <FaUsers /> },
    { path: "/adminQuizzes", name: "View All Quizzes", icon: <MdQuiz /> },
    { path: "/adminQuizzes", name: "Service Costs", icon: <FaMoneyBillWave /> },
    { path: "#", name: "Backup", icon: <MdBackup /> },
    { path: "/adminDashboard", name: "DASHBOARD", icon: <MdDashboard /> },
  ]);

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupMessage, setBackupMessage] = useState("");

  const handleBackupClick = () => {
    setIsBackingUp(true);
    setBackupMessage("");
    // simulacija backup procesa 2.5 sekunde
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupMessage("Backup executed successfully ✅");
    }, 2500);
  };

  useEffect(() => {
    fetchCourses(dispatch, token, instructorId).then((data) => {
      const tempCourses = Array.isArray(data?.payload) ? data.payload : [];
      setCourses(tempCourses);

      const newMenuItems = tempCourses.map((c) => ({
        path: `/courseInstructor/${c.courseId}`,
        name: c.title,
        icon: <TbLayoutGrid />,
      }));
      setMenuItems((prev) => [...prev, ...newMenuItems]);
    });
  }, []);

  return (
      <div
          className="container"
          style={{ display: "flex", width: "auto", margin: 0, padding: 0 }}
      >
        <div style={{ width: "12em" }} className="sidebar">
          <div className="top_section">
            <div style={{ marginLeft: "50px" }} className="bars">
              <FaBars />
            </div>
          </div>
          {menuItems.map((item, index) =>
              item.name === "Backup" ? (
                  <div
                      key={index}
                      className="sidemenulink"
                      style={{ cursor: "pointer" }}
                      onClick={handleBackupClick}
                  >
                    <div className="icon">{item.icon}</div>
                    <div className="link_text">{item.name}</div>
                  </div>
              ) : (
                  <NavLink
                      to={item.path}
                      key={index}
                      className="sidemenulink"
                      activeclassname="sidemenulink-active"
                  >
                    <div className="icon">{item.icon}</div>
                    <div className="link_text">{item.name}</div>
                  </NavLink>
              )
          )}

          {/* Prikaz poruke i loadera */}
          {isBackingUp && (
              <div style={{ margin: "10px", color: "orange" }}>Backing up...</div>
          )}
          {backupMessage && (
              <div style={{ margin: "10px", color: "green" }}>{backupMessage}</div>
          )}
        </div>

        <main>{children}</main>
      </div>
  );
};

export default Sidebar;
