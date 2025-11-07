import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE } from "../../../api.js";
import { toast } from "react-toastify";
import { useUser } from "../../GlobalUserContext.jsx";
import styles from "./LoginPage.module.css";
import fetchData from "../../request.js";

const LoginSection = ({ setstate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch } = useUser();
  const navigate = useNavigate();
  const [isUserNew, setIsUserNew] = useState(false);

  useEffect(() => {
    if (state.user != null && typeof state.user.username != "undefined") {
      if (isUserNew) {
        navigate("/CreateProfile");
      } else {
        navigate("/blog");
      }
    }
  }, [state, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetchData("/login", "POST", navigate, dispatch, { email, password });
    if (res) {
      toast.success("Login Successful");
      setIsUserNew(res.isUserNew);
      localStorage.setItem("userToken", res.token);
      dispatch({ type: "SET_USER", payload: res.user });
    }
  };

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        google.accounts.id.initialize({
          client_id:
            "758980849951-p8lnc4rg3v99b8eqrc4n7lcc262gc219.apps.googleusercontent.com",
          callback: handleGoogleResponse,
        });
        google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { theme: "outline", size: "large" }
        );
      }
    };
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    const data = await fetchData("/auth/google/token", "POST", navigate, dispatch, { id_token: response.credential });
    if (data) {
      toast.success("Google Login Successful");
      setIsUserNew(data.isUserNew);
      localStorage.setItem("userToken", data.token);
      dispatch({ type: "SET_USER", payload: data.user });
    } 
  };

  return (
    <form className={styles.formSection} onSubmit={handleLogin}>
      <div className={styles.formContent}>
        <input
          type="email"
          placeholder="Email Address"
          className={styles.inputField}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.inputField}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className={styles.linksContainer}>
          <Link to="/forgot-password" className={styles.link}>
            Forget Password
          </Link>
          <div to="/signup" className={styles.link} onClick={() => setstate(1)}>
            Create Account
          </div>
        </div>
        <button className={styles.loginButton} type="submit">
          Log in
        </button>

        <div className={styles.divider}>
          <hr className={styles.dividerLine} />
          <span className={styles.dividerText}>OR</span>
          <hr className={styles.dividerLine} />
        </div>

        <div id="google-signin-btn" style={{ marginTop: "16px" }}></div>
      </div>
    </form>
  );
};

export default LoginSection;
