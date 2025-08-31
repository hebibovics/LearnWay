import React, {useEffect, useState} from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { fetchCategories } from "../../actions/categoriesActions";
import { fetchQuizzes } from "../../actions/quizzesActions";
import Sidebar from "../../components/Sidebar";
import "../users/UserProfilePage.css";
const AdminProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginReducer = useSelector((state) => state.loginReducer);
  const user = loginReducer.user;
  console.log("User object:", user);
  console.log("User object:", user.firstName);
  const token = JSON.parse(localStorage.getItem("jwtToken"));

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchCategories(dispatch, token);
  }, [dispatch]);

  // useEffect(() => {
  //   fetchQuizzes(dispatch, token);
  //}, [dispatch]);

  useEffect(() => {
    if (!localStorage.getItem("jwtToken")) navigate("/");
    console.log("User state in Redux:", user);
  }, []);

  return (
      <div className="userProfilePage__container">
          {/* Toggle dugme za mobitel */}
          {!sidebarOpen && (
              <button
                  className="userProfilePage__toggleBtn"
                  onClick={() => setSidebarOpen(true)}
              >
                ☰
              </button>
          )}


          {/* Overlay (klik van sidebar zatvara) */}
          <div
              className={`userProfilePage__overlay ${sidebarOpen ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
          ></div>

          <div className={`userProfilePage__sidebar ${sidebarOpen ? "open" : ""}`}>
          <Sidebar />
        </div>
        {user && (
            <div className="userProfilePage__content">

              <Table bordered className="userProfilePage__content--table">
                <tbody>
                <tr>
                  <td>Name</td>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                </tr>
                <tr>
                  <td>Username</td>
                  <td>{user.username}</td>
                </tr>
                <tr>
                  <td>Mail</td>
                  <td>admin@learnway.com</td>
                </tr>
                <tr>
                  <td>Role</td>
                  <td>{user.role?.roleName}</td>
                </tr>
                </tbody>
              </Table>
            </div>
        )}
      </div>
  );
};

export default AdminProfilePage;
