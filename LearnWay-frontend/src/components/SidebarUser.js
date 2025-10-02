import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import {FaBars, FaTicketAlt, FaUserAlt} from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserCourses } from "../actions/coursesActions";
import { TbLayoutGrid, TbReport } from "react-icons/tb";


const SidebarUser = ({ children }) => {
  const [userCourses, setUserCourses] = useState([]);
  const dispatch = useDispatch();

  const token = JSON.parse(localStorage.getItem("jwtToken"));
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const loginReducer = useSelector((state) => state.loginReducer);
  const userId = loginReducer?.user?.userId;


  const [menuItems, setMenuItems] = useState([
    {
      path: "/profile",
      name: "Profile",
      icon: <FaUserAlt />,
    },
    {
      path: "/userServiceDesk",
      name: "ServiceDesk",
      icon: <FaTicketAlt />,
    },
    {
      path: "/quizResults",
      name: "Certificates",
      icon: <TbReport />,
    },
  ]);

  useEffect(() => {
    fetchUserCourses(dispatch, token, userId).then((data) => {
      const enrolledCourses = Array.isArray(data?.payload) ? data.payload : [];
      setUserCourses(enrolledCourses);

      const newMenuItems = enrolledCourses.map((c) => ({
        path: `/course/${c.courseId}`,
        name: c.title,
        icon: <TbLayoutGrid />,
      }));

      setMenuItems((prev) => [...prev, ...newMenuItems]);
    });
  }, []);


  return (
      <div
          className="container"
          style={{ display: "flex", width: "auto", margin: "0px", padding: "0px" }}
      >
        <div style={{ width: "12em" }} className="sidebar">
          <div className="top_section">
            {/* <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
            Logo
          </h1> */}
            <div style={{ marginLeft: "50px" }} className="bars">
              <FaBars />
            </div>
          </div>
          {menuItems.map((item, index) => (
              <NavLink
                  to={item.path}
                  key={index}
                  className="sidemenulink"
                  activeclassname="sidemenulink-active"
              >
                <div className="icon">{item.icon}</div>
                <div
                    style={{ display: "block"}}
                    className="link_text"
                >
                  {item.name}
                </div>
              </NavLink>
          ))}
        </div>
        <main>{children}</main>
      </div>
  );
};

export default SidebarUser;