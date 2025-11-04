import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE } from "../../../api.js";
import { toast } from "react-toastify";
import { useUser } from "../../GlobalUserContext.jsx";
import styles from "./LoginPage.module.css";

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

    try {
      const res = await fetch(BASE + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Login Successful");
        setIsUserNew(data.isUserNew);
        localStorage.setItem("userToken", data.token);
        dispatch({ type: "SET_USER", payload: data.user });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
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
    try {
      const res = await fetch(BASE + "/auth/google/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: response.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Google Login Successful");
        setIsUserNew(data.isUserNew);
        localStorage.setItem("userToken", data.token);
        dispatch({ type: "SET_USER", payload: data.user });
      } else {
        toast.error("Google login failed.");
      }
    } catch (err) {
      toast.error("Google login failed. Please try again.");
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
