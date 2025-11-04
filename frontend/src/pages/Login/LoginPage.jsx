import { useState } from "react";
import styles from "./LoginPage.module.css";
import LoginSection from "./LoginSection.jsx";
import SignupSection from "./SignUpSection.jsx";

const LoginPage = () => {
  const [state, setState] = useState(0);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.overlay}></div>
      <div className={styles.loginCard}>
        <div className={styles.brandingSection}>
          <div>
            <h1 className={styles.logo}>Tripglo</h1>
            <p className={styles.joinText}>Join for free</p>
            <h2 className={styles.tagline}>
              Unleash the Travel inside YOU, Do not need to beg ANYONE!
              <br />
              We will Connect YOU With New BUDDY
            </h2>
          </div>
        </div>

        {state === 0 ? (
          <LoginSection setstate={setState} />
        ) : (
          <SignupSection setstate={setState} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
