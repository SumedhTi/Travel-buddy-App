import React, { useState, useEffect } from "react";
import styles from "./AddProfile.module.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../GlobalUserContext";
import CreatableSelect from "react-select/creatable";
import { customStyles, preferences } from "./var";
import { BASE } from "../../../api";
import { toast } from "react-toastify";

const AddProfile = () => {
  const { state, dispatch } = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ name: state.user.username });
  const [selectedLifestyle, setSelectedLifestyle] = useState(new Set());
  const [errors, setErrors] = useState({});
  const [locationPref, setLocationPref] = useState([]);
  const [natureType, setNatureType] = useState([]);
  const [interestType, setInterestType] = useState([]);
  const [native, setNative] = useState([]);
  const [language, setLanguage] = useState([]);
  const [religion, setReligion] = useState([]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const totalSteps = 9;

  const stepDescriptions = [
    "Let's get started",
    "Tell us your name",
    "Contact information",
    "Personal details",
    "Your identity",
    "Lifestyle preferences",
    "Share your story",
    "Preferences",
    "Profile complete",
  ];

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

  const updateProgress = () => {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    return progress;
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 2:
        const requirementsMet =
          passwordRequirements.hasLowerCase &&
          passwordRequirements.hasNumbers &&
          passwordRequirements.hasSpecialChar &&
          passwordRequirements.hasUpperCase &&
          passwordRequirements.isLongEnough;          
        if (!requirementsMet) {
          newErrors.password = "Password doesnt meet the requirments";
        }
        break;
      case 3:
        if (!formData.phoneNo?.trim()) {
          newErrors.phoneNo = "Please Enter your phone number";
        } else if (!/^\d{10}$/.test(formData.phoneNo)) {
          newErrors.phoneNo = "Please Enter a valid phone number";
        }
        break;
      case 4:
        if (!formData.dob?.trim()) {
          newErrors.dob = "Please enter your DOB";
        } else if (!isOlder(formData.dob)) {
          newErrors.dob = "YOU ARE TOO YOUNG TO USE THIS PLATFORM";
        }
        if (native.length === 0) {
          newErrors.native = "Please enter your nationality";
        }
        if (language.length === 0) {
          newErrors.language = "Enter a language";
        }
        break;
      case 5:
        if (typeof formData.gender == "undefined") {
          newErrors.gender = "Please select your gender";
        }
        break;
      default:
        return true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function isOlder(dobString) {
    const dob = new Date(dobString);
    const today = new Date();
    const cutoffDate = new Date();
    cutoffDate.setFullYear(today.getFullYear() - 15);
    return dob <= cutoffDate;
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleLifestyleToggle = (lifestyle) => {
    const newSelected = new Set(selectedLifestyle);
    if (newSelected.has(lifestyle)) {
      newSelected.delete(lifestyle);
    } else {
      newSelected.add(lifestyle);
    }
    setSelectedLifestyle(newSelected);
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      completeProfile();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const jumpToStep = (stepNumber) => {
    if (stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  const completeProfile = async () => {
    const finalData = {
      ...formData,
      password,
      drinking: selectedLifestyle.has("drinking"),
      smoking: selectedLifestyle.has("smoking"),
      driving: selectedLifestyle.has("driving"),
      natureType: natureType.map((i) => {
        return i.value;
      }),
      interestType: interestType.map((i) => {
        return i.value;
      }),
      locationPref: locationPref.map((i) => {
        return i.value;
      }),
      language: language.map((i) => {
        return i.value;
      }),
      religion: religion.value,
      native: native.value,
    };

    try {
      const res = await fetch(BASE + "/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "*",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify(finalData),
      });
      if (res.ok) {
        toast.success("Profile Update Complete");
        navigate("/dashboard");
      } else if (res.status === 403) {
        toast.error("Token Invalid Login Again");
        setTimeout(() => {
          sessionStorage.removeItem("userToken");
          dispatch({ type: "CLEAR_USER" });
          navigate("/login", { replace: true });
        }, 3000);
      } else {
        toast.error("Someting went wrong");
      }
    } catch (err) {
      toast.error("Somting Went Wrong");
      console.log(err);
    }
  };

  const FloatingParticles = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
      if (currentStep === totalSteps) {
        const interval = setInterval(() => {
          const newParticle = {
            id: Math.random(),
            left: Math.random() * 100,
            color: ["#667eea", "#764ba2", "#10b981", "#f093fb", "#FFD700"][
              Math.floor(Math.random() * 5)
            ],
            delay: Math.random() * 2,
            duration: 4 + Math.random() * 2,
          };

          setParticles((prev) => [...prev, newParticle]);

          setTimeout(() => {
            setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
          }, 6000);
        }, 200);

        return () => clearInterval(interval);
      }
    }, [currentStep]);

    return (
      <div className={styles.floatingParticles}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={styles.particle}
            style={{
              left: `${particle.left}%`,
              backgroundColor: particle.color,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.mainContaner}>
      <div className={styles.mainContent}>
        <div className={styles.webappContainer}>
          <FloatingParticles />

          <div className={styles.headerSection}>
            <div className={styles.headercontent}>
              <div className={styles.logo}>✈️</div>
              <h1 className={styles.headerTitle}>Travel Buddy</h1>
              <p className={styles.headerSubtitle}>
                Create your profile to connect with amazing travel companions
                worldwide
              </p>

              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${updateProgress()}%` }}
                  />
                </div>
                <div className={styles.stepInfo}>
                  <span>
                    Step {currentStep} of {totalSteps}
                  </span>
                  <span>{stepDescriptions[currentStep - 1]}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.mainContent}>
            <nav className={styles.sidebar}>
              <ul className={styles.stepNav}>
                {Array.from({ length: totalSteps }, (_, index) => {
                  const stepNum = index + 1;
                  const isActive = stepNum === currentStep;
                  const isCompleted = stepNum < currentStep;
                  const stepTitles = [
                    "Welcome",
                    "Your Name",
                    "Contact Info",
                    "Personal Details",
                    "Identity",
                    "Lifestyle",
                    "About You",
                    "Preferences",
                    "Complete",
                  ];

                  return (
                    <li
                      key={stepNum}
                      className={`${styles.stepNavItem} ${
                        isActive ? styles.active : ""
                      } ${isCompleted ? styles.completed : ""}`}
                      onClick={() => jumpToStep(stepNum)}
                    >
                      <div className={styles.stepNumber}>
                        {isCompleted ? "✓" : stepNum}
                      </div>
                      <div className={styles.stepTitle}>
                        {stepTitles[index]}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <main className={styles.contentArea}>
              {/* Step 1: Welcome */}
              {currentStep === 1 && (
                <div className={`${styles.stepContent} ${styles.active}`}>
                  <div className={styles.welcomeContent}>
                    <div className={styles.welcomeEmoji}>🌍</div>
                    <div className={styles.contentHeader}>
                      <h2 className={styles.contentTitle}>
                        Welcome to Travel Buddy!
                      </h2>
                      <p className={styles.contentSubtitle}>
                        Ready to find your perfect travel companion? Let's
                        create your profile in just a few simple steps. Connect
                        with fellow travelers who share your passion for
                        adventure and exploration.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Name */}
              {currentStep === 2 && (
                <div className={`${styles.stepContent} ${styles.active}`}>
                  <div className={styles.contentHeader}>
                    <h2 className={styles.contentTitle}>What's your name?</h2>
                    <p className={styles.contentSubtitle}>
                      This is how other travelers will know you. Make it
                      friendly and approachable!
                    </p>
                  </div>
                  <div>
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                      className={`${styles.inputArea} ${
                        errors.name ? styles.error : ""
                      } `}
                    />
                    {errors.name && (
                      <div className={styles.errorMessage}>{errors.name}</div>
                    )}

                  <label style={{marginTop:"20px"}}>Password *</label>
                  <input
                    type="password"
                    placeholder="Create Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${styles.inputArea} ${
                      errors.password ? styles.error : ""
                    } `}
                  />
                  {errors.password && (
                      <div className={styles.errorMessage}>{errors.password}</div>
                    )}

                  <ul className={styles.passwordRequirements}>
                    <li className={passwordRequirements.isLongEnough? styles.requirementMet : ""}>
                      At least 8 characters
                    </li>
                    <li className={passwordRequirements.hasUpperCase? styles.requirementMet : ""}>
                      One uppercase letter
                    </li>
                    <li className={passwordRequirements.hasLowerCase? styles.requirementMet : ""}>
                      One lowercase letter
                    </li>
                    <li className={passwordRequirements.hasNumbers? styles.requirementMet : ""}>
                      One number
                    </li>
                    <li className={passwordRequirements.hasSpecialChar? styles.requirementMet : ""}>
                      One special character
                    </li>
                  </ul>
                  </div>
                </div>
              )}

              {/* Step 3: Contact */}
              {currentStep === 3 && (
                <div className={`${styles.stepContent} ${styles.active}`}>
                  <div className={styles.contentHeader}>
                    <h2 className={styles.contentTitle}>
                      How can we reach you?
                    </h2>
                    <p className={styles.contentSubtitle}>
                      Your contact information will be kept private and only
                      shared when you connect with someone.
                    </p>
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        value={state.user.email}
                        disabled
                        className={styles.inputArea}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="phoneNo">Phone Number</label>
                      <input
                        type="tel"
                        pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                        id="phoneNo"
                        value={formData.phoneNo || ""}
                        onChange={(e) =>
                          handleInputChange("phoneNo", e.target.value)
                        }
                        placeholder="+91 987654321"
                        className={`${styles.inputArea} ${
                          errors.phoneNo ? styles.error : ""
                        } `}
                      />
                      {errors.phoneNo && (
                        <div className={styles.errorMessage}>
                          {errors.phoneNo}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Personal Details */}
              {currentStep === 4 && (
                <div className={`${styles.stepContent} ${styles.active}`}>
                  <div className={styles.contentHeader}>
                    <h2 className={styles.contentTitle}>
                      Tell us about yourself
                    </h2>
                    <p className={styles.contentSubtitle}>
                      This helps us match you with compatible travel companions.
                    </p>
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="dob">Date of Birth</label>
                      <input
                        type="date"
                        id="dob"
                        value={formData.dob || ""}
                        onChange={(e) =>
                          handleInputChange("dob", e.target.value)
                        }
                        className={`${styles.inputArea} ${
                          errors.dob ? styles.error : ""
                        } `}
                      />
                      {errors.dob && (
                        <div className={styles.errorMessage}>{errors.dob}</div>
                      )}
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="native">Nationality</label>
                      <CreatableSelect
                        options={preferences.native}
                        onChange={(selected) => setNative(selected)}
                        value={native}
                        placeholder="Select native..."
                        styles={customStyles}
                        menuPortalTarget={document.body}
                      />
                      {errors.native && (
                        <div className={styles.errorMessage}>
                          {errors.native}
                        </div>
                      )}
                    </div>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label htmlFor="language">Languages You Can Speak</label>
                      <CreatableSelect
                        isMulti
                        options={preferences.language}
                        onChange={(selected) => setLanguage(selected)}
                        value={language}
                        placeholder="Select language..."
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        styles={customStyles}
                        menuPortalTarget={document.body}
                      />
                      {errors.language && (
                        <div className={styles.errorMessage}>
                          {errors.language}
                        </div>
                      )}
                    </div>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label htmlFor="religion">Religion (Optional)</label>
                      <CreatableSelect
                        options={preferences.religion}
                        onChange={(selected) => setReligion(selected)}
                        value={religion}
                        placeholder="Select religion..."
                        styles={customStyles}
                        menuPortalTarget={document.body}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Identity */}
              {currentStep === 5 && (
                <div className={`${styles.stepContent} ${styles.active}`}>
                  <div className={styles.contentHeader}>
                    <h2 className={styles.contentTitle}>
                      How do you identify?
                    </h2>
                    <p className={styles.contentSubtitle}>
                      Help others know how to address you respectfully.
                    </p>
                  </div>
                  <div className={styles.optionCards}>
                    {[
                      { value: "male", emoji: "👨", text: "Male" },
                      { value: "female", emoji: "👩", text: "Female" },
                      { value: "non-binary", emoji: "🧑", text: "Non-binary" },
                      { value: "other", emoji: "✨", text: "Other" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={`${styles.optionCard} ${
                          formData.gender === option.value
                            ? styles.selected
                            : ""
                        }`}
                        onClick={() =>
                          handleInputChange("gender", option.value)
                        }
                      >
                        <span className={styles.optionEmoji}>
                          {option.emoji}
                        </span>
                        <div className={styles.optionText}>{option.text}</div>
                      </div>
                    ))}
                  </div>
                  {errors.gender && (
                    <div className={styles.errorMessage}>{errors.gender}</div>
                  )}
                </div>
              )}

              {/* Step 6: Lifestyle */}
              {currentStep === 6 && (
                <div className={`${styles.stepContent} ${styles.active}`}>
                  <div className={styles.contentHeader}>
                    <h2 className={styles.contentTitle}>
                      Your lifestyle preferences
                    </h2>
                    <p className={styles.contentSubtitle}>
                      Select all that apply to help match you with like-minded
                      travelers.
                    </p>
                  </div>
                  <div className={styles.lifestyleGrid}>
                    {[
                      {
                        value: "drinking",
                        emoji: "🍷",
                        title: "Social Drinking",
                        desc: "I enjoy having drinks while traveling and socializing",
                      },
                      {
                        value: "smoking",
                        emoji: "🚬",
                        title: "Smoking",
                        desc: "I'm a smoker and comfortable around smoking",
                      },
                      {
                        value: "driving",
                        emoji: "🚗",
                        title: "Can Drive",
                        desc: "I have a valid license and can drive during trips",
                      },
                    ].map((lifestyle) => (
                      <div
                        key={lifestyle.value}
                        className={`${styles.lifestyleCard} ${
                          selectedLifestyle.has(lifestyle.value)
                            ? styles.selected
                            : ""
                        }`}
                        onClick={() => handleLifestyleToggle(lifestyle.value)}
                      >
                        <span className={styles.lifestyleEmoji}>
                          {lifestyle.emoji}
                        </span>
                        <div className={styles.lifestyleInfo}>
                          <h3>{lifestyle.title}</h3>
                          <p>{lifestyle.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 7: Bio */}
              {currentStep === 7 && (
                <div className={`${styles.stepContent} ${styles.active}`}>
                  <div className={styles.contentHeader}>
                    <h2 className={styles.contentTitle}>
                      Tell your travel story
                    </h2>
                    <p className={styles.contentSubtitle}>
                      Share what makes you an awesome travel companion and what
                      you're looking for in your next adventure.
                    </p>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="bio">About You</label>
                    <textarea
                      id="bio"
                      value={formData.bio || ""}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell us about your travel style, favorite destinations, interests, and what you're looking for in a travel buddy. Are you into adventure sports, cultural experiences, food tours, or relaxing beach getaways? The more you share, the better we can match you with compatible travelers!"
                      className={`${styles.inputArea} ${
                        errors.name ? styles.error : ""
                      } `}
                    />
                  </div>
                </div>
              )}

              {currentStep === 8 && (
                <div className={`${styles.stepContent} ${styles.active}`}>
                  <div className={styles.contentHeader}>
                    <h2 className={styles.contentTitle}>
                      Select Your Preferences
                    </h2>
                    <p className={styles.contentSubtitle}>
                      This helps us match you with compatible travel companions.
                    </p>
                  </div>
                  <div className={styles.formGrid}>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label htmlFor="locationPref">Location Prefernces</label>
                      <CreatableSelect
                        options={preferences.locationPref}
                        isMulti
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        onChange={(selected) => setLocationPref(selected)}
                        value={locationPref}
                        placeholder="Select types..."
                        styles={customStyles}
                        menuPortalTarget={document.body}
                      />
                      {errors.locationPref && (
                        <div className={styles.errorMessage}>
                          {errors.locationPref}
                        </div>
                      )}
                    </div>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label htmlFor="natureType">Your Nature</label>
                      <CreatableSelect
                        options={preferences.natureType}
                        isMulti
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        onChange={(selected) => setNatureType(selected)}
                        value={natureType}
                        placeholder="Select types..."
                        styles={customStyles}
                        menuPortalTarget={document.body}
                      />
                      {errors.natureType && (
                        <div className={styles.errorMessage}>
                          {errors.natureType}
                        </div>
                      )}
                    </div>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label htmlFor="interestType">Your Intrests</label>
                      <CreatableSelect
                        options={preferences.interestType}
                        isMulti
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        onChange={(selected) => setInterestType(selected)}
                        value={interestType}
                        placeholder="Select types..."
                        styles={customStyles}
                        menuPortalTarget={document.body}
                      />
                      {errors.interestType && (
                        <div className={styles.errorMessage}>
                          {errors.interestType}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 9: Complete */}
              {currentStep === 9 && (
                <div className={`${styles.stepContent} ${styles.active}`}>
                  <div className={styles.completionContent}>
                    <div className={styles.completionEmoji}>🎉</div>
                    <div className={styles.contentHeader}>
                      <h2 className={styles.contentTitle}>You're all set!</h2>
                      <p className={styles.contentSubtitle}>
                        Your travel profile is complete and ready to go live.
                        Start connecting with amazing travel companions who
                        share your passion for adventure and exploration!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.actionSection}>
                <button
                  className={`${styles.btn} ${styles.btnBack}`}
                  onClick={prevStep}
                  style={{ visibility: currentStep > 1 ? "visible" : "hidden" }}
                >
                  ← Previous
                </button>
                <div style={{ flex: 1 }}></div>
                <button
                  className={`${styles.btn} ${styles.btnNext}`}
                  onClick={nextStep}
                  style={{
                    background:
                      currentStep === totalSteps
                        ? "linear-gradient(135deg, #10b981, #059669)"
                        : "linear-gradient(135deg, #667eea, #764ba2)",
                  }}
                >
                  {currentStep === totalSteps
                    ? "Create Profile 🚀"
                    : currentStep === 1
                    ? "Get Started →"
                    : "Continue →"}
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProfile;
