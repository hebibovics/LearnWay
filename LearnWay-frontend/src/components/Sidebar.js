import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { FaBars, FaUserAlt, FaUsers, FaMoneyBillWave, FaTicketAlt } from "react-icons/fa";
import { MdQueue, MdQuiz, MdBackup, MdDashboard } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../actions/coursesActions";
import { TbLayoutGrid } from "react-icons/tb";

const Sidebar = ({ children }) => {
  const categoriesReducer = useSelector((state) => state.categoriesReducer);
  const [courses, setCourses] = useState(categoriesReducer.categories);
  const dispatch = useDispatch();
  const token = localStorage.getItem("jwtToken")?.replace(/^"|"$/g, '');
  const user = JSON.parse(localStorage.getItem("user"));
  const instructorId = user?.userId;

  const [menuItems, setMenuItems] = useState([
    { path: "/adminProfile", name: "Profile", icon: <FaUserAlt /> },
    { path: "/adminCourses", name: "View All Courses", icon: <TbLayoutGrid /> },
    { path: "/adminUsers", name: "View All Users", icon: <FaUsers /> },
    { path: "/adminQuizzes", name: "View All Quizzes", icon: <MdQuiz /> },
    { path: "/adminResources", name: "Resources", icon: <FaMoneyBillWave /> },
    { path: "#", name: "Backup", icon: <MdBackup /> },
    { path: "/adminDashboard", name: "DASHBOARD", icon: <MdDashboard /> },
    { path: "/adminServiceDesk", name: "Service desk", icon: <FaTicketAlt /> },
  ]);

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupMessage, setBackupMessage] = useState("");
  const [showBackupSection, setShowBackupSection] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState("Loading...");

  const fetchLastBackupDate = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/backup/last", {
        headers: { Authorization: `Bearer ${token}` },
      });
      let text = await res.text();

      if (text && text !== "No backup yet") {
        const clean = text.replace("T", " ");
        const date = new Date(clean);
        if (!isNaN(date)) {
          const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          const formattedTime = date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });
          setLastBackupDate(`${formattedDate} ${formattedTime}`); // npr. "08/11/2025 14:33"
        } else {
          setLastBackupDate(clean);
        }
      } else {
        setLastBackupDate("No backup yet");
      }
    } catch (err) {
      setLastBackupDate("No backup yet");
    }
  };


  const handleBackupMenuClick = () => {
    setShowBackupSection((prev) => !prev);
    if (!showBackupSection) {
      fetchLastBackupDate();
    }
  };

  const handleBackupClick = async () => {
    setIsBackingUp(true);
    setBackupMessage("Backup in progress...");

    try {
      const response = await fetch("http://localhost:8081/api/backup", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await response.text();
      setIsBackingUp(false);
      setBackupMessage(text || "Backup completed ✅");

      fetchLastBackupDate();
    } catch (error) {
      console.error("Backup failed:", error);
      setIsBackingUp(false);
      setBackupMessage("Backup failed ❌");
    }
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
      <div className="container" style={{ display: "flex", width: "auto", margin: 0, padding: 0 }}>
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
                      onClick={handleBackupMenuClick}
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
          {showBackupSection && (
              <div style={{ padding: "10px", color: "white", fontSize: "14px" }}>
                <p><strong>Last Backup Date:</strong> {lastBackupDate}</p>
                <button
                    onClick={handleBackupClick}
                    disabled={isBackingUp}
                    style={{
                      backgroundColor: isBackingUp ? "gray" : "#add8e6", // lightblue
                      color: isBackingUp ? "white" : "#003366", // dark blue text
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px 10px",
                      cursor: isBackingUp ? "not-allowed" : "pointer",
                    }}
                >
                  {isBackingUp ? "Backing up..." : "Backup now"}
                </button>


                {backupMessage && (
                    <p style={{ marginTop: "8px" }}>{backupMessage}</p>
                )}
              </div>
          )}
        </div>

        <main>{children}</main>
      </div>
  );
};

export default Sidebar;
