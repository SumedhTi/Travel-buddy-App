import { BASE } from "../api";
import { toast } from "react-toastify";

const fetchData = async (url, method, navigate, dispatch, data) => {
  let options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: "*",
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  };

  if (method === "POST" || method === "PUT") {
    options.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(BASE + url, options);
    const data = await res.json();
    if (res.ok) {
      return data;
    } else if (res.status === 403 && navigate && dispatch) {
      toast.error("Token Invalid Login Again");
      setTimeout(() => {
        sessionStorage.removeItem("userToken");
        dispatch({ type: "CLEAR_USER" });
        navigate("/", { replace: true });
      }, 2000);
    } else {
      toast.error("Someting went wrong");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export default fetchData;
