import React, { useState } from "react";
import { FaBars, FaUserAlt, FaRegChartBar } from "react-icons/fa";
import { TbLayoutGrid, TbLayoutGridAdd, TbReport } from "react-icons/tb";
import { MdQuiz, MdQueue } from "react-icons/md";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ children }) => {

  const menuItem = [
    {
      path: "/adminProfile",
      name: "Profile",
      icon: <FaUserAlt />,
    },
    {
      path: "/adminCategories",
      name: "Categories",
      icon: <TbLayoutGrid />,
    },
    {
      path: "/adminAddCategory",
      name: "Add Category",
      icon: <TbLayoutGridAdd />,
    },
    {
      path: "/adminQuizzes",
      name: "Quizzes",
      icon: <MdQuiz />,
    },
    {
      path: "/adminAddQuiz",
      name: "New Lessons",
      icon: <MdQueue />,
    },
    {
      path: "/adminallResult",
      name: "All Results",
      icon: <TbReport/>,
    },
  ];
  return (
    <div
      className="container"
      style={{ display: "flex", width: "auto", margin: "0px", padding: "0px" }}
    >
      <div style={{ width: "12em" }} className="sidebar">
        <div className="top_section">
          <h1 style={{ display: "block" }} className="logo">
            Logo
          </h1>
          <div style={{ marginLeft: "50px" }} className="bars">
            <FaBars />
          </div>
        </div>
        {menuItem.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="sidemenulink"
            activeclassname="sidemenulink-active"
          >
            <div className="icon">{item.icon}</div>
            <div
              style={{ display: "block" }}
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
