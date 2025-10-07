import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import {FaBars, FaUserAlt, FaTicketAlt, FaEnvelope} from "react-icons/fa";
import {MdQueue, MdQuiz} from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../actions/coursesActions";
import { TbLayoutGrid, TbReport } from "react-icons/tb";
import axios from "axios";

const SidebarInstructor = ({ children }) => {
    const categoriesReducer = useSelector((state) => state.categoriesReducer);
    const [courses, setCourses] = useState(categoriesReducer.categories);
    const dispatch = useDispatch();
    const token = JSON.parse(localStorage.getItem("jwtToken"));
    const user = JSON.parse(localStorage.getItem("user"));
    const instructorId = user?.userId;

    const [unreadCount, setUnreadCount] = useState(0);
    console.log("JWT from localStorage:", token);
    console.log("User from localStorage:", user);
    console.log("Instructor ID:", instructorId);
    const [menuItems, setMenuItems] = useState([
        {
            path: "/instructorProfile",
            name: "Profile",
            icon: <FaUserAlt />,
        },
        {
            path: "/instructorCourses",
            name: "My courses",
            icon: <TbLayoutGrid />,
        },
        {
            path: "/instructorMessages",
            name: "Messages",
            icon: <FaEnvelope />,
        },
        {
            path: "/userServiceDesk",
            name: "ServiceDesk",
            icon: <FaTicketAlt />,
        },

        {
            path: "/instructorAddCourse",
            name: "Add Course",
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


    // Fetch unread messages count
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const res = await axios.get(`/api/tickets/instructor/${instructorId}/received`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const count = res.data.filter(t => t.status === "OPEN").length;
                setUnreadCount(count);
            } catch (err) {
                console.error("Failed to fetch tickets", err);
            }
        };

        fetchUnreadCount();

        // Opcionalno: refresh svakih n sekundi ako želiš "live" update
        const interval = setInterval(fetchUnreadCount, 15000); // svakih 15 sekundi
        return () => clearInterval(interval);
    }, [instructorId, token]);


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
                        <div className="icon" style={{ position: "relative" }}>
                            {item.icon}
                            {/* Badge za new messages */}
                            {item.path === "/instructorMessages" && unreadCount > 0 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "-5px",
                                        right: "-5px",
                                        width: "12px",
                                        height: "12px",
                                        backgroundColor: "red",
                                        borderRadius: "50%",
                                        display: "inline-block"
                                    }}
                                ></span>
                            )}
                        </div>
                        <div style={{ display: "block" }} className="link_text">
                            {item.name}
                        </div>
                    </NavLink>
                ))}
            </div>
            <main>{children}</main>
        </div>
    );
};

export default SidebarInstructor;