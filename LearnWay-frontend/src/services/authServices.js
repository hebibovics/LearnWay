import axios from "axios";

const register = async (user) => {
  try {
    const { data } = await axios.post("/api/register", user);

    if (data && data.userId) {
      console.log(
          "authService:register() Success: ",
          user.username,
          " successfully registered."
      );
      return { isRegistered: true, error: null };
    } else {
      console.error("authService:register() Error: ", data);
      return { isRegistered: false, error: data };
    }
  } catch (error) {
    let errorMessage = "Registration failed";

    if (error.response) {
      // Backend poruka
      if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      } else if (error.response.statusText) {
        errorMessage = error.response.statusText;
      }
    } else {
      errorMessage = error.message;
    }

    console.error("authService:register() Error: ", errorMessage);
    return { isRegistered: false, error: errorMessage };
  }
};

const login = async (username, password) => {
  try {
    const { data } = await axios.post("/api/login", {
      username: username,
      password: password,
    });

    if (data && data.jwtToken.length) {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("jwtToken", JSON.stringify(data.jwtToken));
      console.log("authService:login() Success: ", data.user);
      return data;
    } else {
      console.error("authService:login() Error: ", data);
      return data;
    }
  } catch (error) {
    console.error("authService:login() Error: ", error.response?.statusText);
    return error.response?.statusText || "Login failed";
  }
};

const authServices = { register, login };
export default authServices;
