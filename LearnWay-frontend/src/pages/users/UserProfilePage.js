import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../actions/categoriesActions";
import SidebarUser from "../../components/SidebarUser";
import "./UserProfilePage.css";

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginReducer = useSelector((state) => state.loginReducer);
  const user = loginReducer.user;
  const token = JSON.parse(localStorage.getItem("jwtToken"));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchCategories(dispatch, token);
  }, [dispatch]);

  useEffect(() => {
    if (!localStorage.getItem("jwtToken")) navigate("/");
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


        <div
            className={`userProfilePage__overlay ${sidebarOpen ? "active" : ""}`}
            onClick={() => setSidebarOpen(false)}
        ></div>

        <div className={`userProfilePage__sidebar ${sidebarOpen ? "open" : ""}`}>
          <SidebarUser />
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
                  <td>Email</td>
                  <td>{user.username}</td>
                </tr>
                <tr>
                  <td>Phone</td>
                  <td>{user.phoneNumber}</td>
                </tr>
                <tr>
                  <td>Role</td>
                  <td>
                    {user.role?.roleName === "USER"
                        ? "STUDENT"
                        : user.role?.roleName}
                  </td>
                </tr>
                </tbody>
              </Table>
            </div>
        )}
      </div>
  );
};

export default UserProfilePage;
