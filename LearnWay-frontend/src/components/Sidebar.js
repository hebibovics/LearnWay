import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { FaBars, FaUserAlt } from "react-icons/fa";
import {MdQueue, MdQuiz} from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../actions/coursesActions";
import { TbLayoutGrid, TbReport } from "react-icons/tb";

const Sidebar = ({ children }) => {
  const categoriesReducer = useSelector((state) => state.categoriesReducer);
  const [courses, setCourses] = useState(categoriesReducer.categories);
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("jwtToken"));
  const user = JSON.parse(localStorage.getItem("user"));
  const instructorId = user?.userId;
  console.log("JWT from localStorage:", token);
  console.log("User from localStorage:", user);
  console.log("Instructor ID:", instructorId);
  const [menuItems, setMenuItems] = useState([
    {
      path: "/adminProfile",
      name: "Profile",
      icon: <FaUserAlt />,
    },
    {
      path: "/adminCourses",
      name: "View All Courses",
      icon: <MdQueue />,
    },

  ]);


  useEffect(() => {
    console.log("Fetching Courses because of SidebarUser");
    fetchCourses(dispatch, token, instructorId).then((data) => {
      console.log("Fetched data:", data);
      const tempCourses = Array.isArray(data?.payload) ? data.payload : [];
      setCourses(tempCourses);

      const newMenuItems = tempCourses.map((c) => {
        console.log(c);
        return {
          path: `/courseInstructor/${c.courseId}`,
          name: c.title,
          icon: <TbLayoutGrid />,
        };
      });
      setMenuItems([...menuItems, ...newMenuItems]);
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

export default Sidebar;