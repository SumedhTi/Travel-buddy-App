import { useEffect, useState } from "react";
import { BASE } from "../../../api.js";
import { toast } from "react-toastify";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../GlobalUserContext.jsx";
import fetchData from "../../request.js";

const SignupSection = ({ setstate }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const { state, dispatch } = useUser();

  useEffect(() => {
    if (state.user != null && typeof state.user.username != "undefined") {
      navigate("/CreateProfile");
    }
  }, [state, navigate]);

  const checkPasswordStrength = (pass) => {
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const isLongEnough = pass.length >= 8;

    return {
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isLongEnough,
    };
  };

  const passwordRequirements = checkPasswordStrength(password);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !firstName.trim().length ||
      !lastName.trim().length ||
      !email.trim().length
    ) {
      toast.error("Fields Cannot Be Empty");
      return;
    }

    const requirementsMet =
      passwordRequirements.hasLowerCase &&
      passwordRequirements.hasNumbers &&
      passwordRequirements.hasSpecialChar &&
      passwordRequirements.hasUpperCase &&
      passwordRequirements.isLongEnough;
    if (!requirementsMet) {
      toast.error("Password doesnt meet the requirments");
      return;
    }

    const data = await fetchData("/register", "POST", navigate, dispatch, {
      username: firstName + " " + lastName,
      email: email,
      password,
    }); 
    if (data) {
      toast.success("Signup successful!");
      localStorage.setItem("userToken", data.token);
      dispatch({ type: "SET_USER", payload: data.user });
    } 
  };

  return (
    <form className={styles.formContent} onSubmit={handleSignup}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="First Name"
          className={styles.inputField}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          className={styles.inputField}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <input
        type="email"
        placeholder="Email Address"
        className={styles.inputField}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Create Password"
        className={styles.inputField}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <ul className={styles.passwordRequirements}>
        <li
          className={
            passwordRequirements.isLongEnough ? styles.requirementMet : ""
          }
        >
          At least 8 characters
        </li>
        <li
          className={
            passwordRequirements.hasUpperCase ? styles.requirementMet : ""
          }
        >
          One uppercase letter
        </li>
        <li
          className={
            passwordRequirements.hasLowerCase ? styles.requirementMet : ""
          }
        >
          One lowercase letter
        </li>
        <li
          className={
            passwordRequirements.hasNumbers ? styles.requirementMet : ""
          }
        >
          One number
        </li>
        <li
          className={
            passwordRequirements.hasSpecialChar ? styles.requirementMet : ""
          }
        >
          One special character
        </li>
      </ul>

      <div className={styles.linksContainer}>
        <div className={styles.link} onClick={() => setstate(0)}>
          Already have an account?
        </div>
      </div>

      <button className={styles.loginButton} type="submit">
        Create Account
      </button>
    </form>
  );
};

export default SignupSection;
