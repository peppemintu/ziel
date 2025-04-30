import jwtDecode from "jwt-decode";
import axios from "axios";

export const getUserFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const email = decoded.sub;

    return axios.get("http://localhost:8080/api/user", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.data);

  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
