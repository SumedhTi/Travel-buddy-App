import { useState, useEffect, useRef } from "react";
import styles from "./ProfilePage.module.css"; // <-- import as default
import { BASE } from "../../../api";
import { toast } from "react-toastify";
import { useUser } from "../../GlobalUserContext";
import { Edit2, MessageCircleMore, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import fetchData from "../../request";

const ProfilePage = ({ userId }) => {
  const { state, dispatch } = useUser();
  const [isMyPage, setIsMyPage] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    dob: "",
    gender: "",
    profileRating: 0,
    email: "",
    drinking: false,
    smoking: false,
    native: "",
    phoneNo: "",
    driving: false,
    pronouns: "",
    religion: "",
    bio: "",
    photo:null,
    locationPref:[],
    intrestTripType:[],
    interestType:[],
  });
  
  const fetchProfileData = async () => {
    const data = await fetchData(`/profile?id=${userId || state.user.id}`, "GET", navigate, dispatch);
    if (data._id !== state.user.id){
      setIsMyPage(false);
    } else{
      setIsMyPage(true);
    }
    setUserData(data);
  };
  
  useEffect(() => {
    fetchProfileData();
  }, [userId, state.user.id, navigate, dispatch]);
  
  const updateProfile = async () => {
    const response = await fetchData("/updateProfile", "PUT", navigate, dispatch, userData); 
    if(response){
      toast.success("Profile Updated");
    } 
  };

  function formatDateForInput(date) {
    const d = new Date(date); 
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const dateObject = new Date(userData.dob);
  const day = String(dateObject.getDate()).padStart(2, '0');
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const fullYear = dateObject.getFullYear();
  const year = String(fullYear);
  const formattedDate = `${day}/${month}/${year}`;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;    

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const res = await fetch(BASE + "/upload", {
        method: "POST",
        headers: {
          Origin: "*",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: formData,
      });
      const data = await res.json();
      if(res.ok){
        toast.success("Profile Photo Updated");
        setUserData(data.userData);
        window.location.reload();
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
      console.error(err);
      alert("Upload failed!");
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click(); // programmatically open file picker
  };

  const startChatting = () => {
    navigate(`/chat/${userId}`);
  }
  
  const handleDeleteButton = async () => {
    const res = await fetchData("/deletephoto", "DELETE", navigate, dispatch);
    if(res){
      toast.success("Profile Photo Deleted");
      setUserData(res.userData);
      window.location.reload();
    }
  }


  return (
    <div className={styles.profileContainer}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        <div className={styles.profilePicWrapper}>
          <img
            src={userData.photo}
            alt="profile"
            className={styles.profilePic}
          />
          {isMyPage && (<button className={styles.removePic} onClick={handleDeleteButton}>×</button>)}
        </div>
        <div>
          {isMyPage && (<><button className={styles.uploadBtn} onClick={handleButtonClick}>Upload Profile Photo</button>
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          /></>)}
        </div>
        
      </div>
      {/* Right Section */}
      <div className={styles.rightSection}>
        <form className={styles.profileForm}>
          <div className={styles.tabs}>
            <h3>Basic Details</h3>
            <div>
              {isMyPage
              ?editMode
                ? <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className={styles.addUserBtn} onClick={() => {updateProfile(); setEditMode(false)}}>
                    <Save size={15} />
                    Save
                  </div>
                  <button className={`${styles.addUserBtn} ${styles.cancelBtn}`} onClick={() => {setEditMode(false); fetchProfileData()}}>
                    Cancel
                  </button>
                </div>
                : <button className={styles.addUserBtn} onClick={() => setEditMode(true)}><Edit2 size={17} /> Edit</button>
              : <button className={styles.addUserBtn} onClick={startChatting}><MessageCircleMore size={17} /> Start Chat</button>
              }
            </div>
          </div>
          {/* Full Name */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Full Name : </label>
            {editMode ? (
              <input
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
            ) : (
              <span className={styles.formValue}>{userData.name}</span>
            )}
          </div>
          {/* Phone No */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Phone No : </label>
            {editMode ? (
              <input
                type="text"
                value={userData.phoneNo}
                onChange={(e) =>
                  setUserData({ ...userData, phoneNo: e.target.value })
                }
              />
            ) : (
              <span className={styles.formValue}>{userData.phoneNo}</span>
            )}
          </div>
          {/* Date of Birth */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Date of Birth :</label>
            {editMode ? (
              <input
                type="date"
                value={formatDateForInput(userData.dob)}
                onChange={(e) =>
                  setUserData({ ...userData, dob: e.target.value })
                }
              />
            ) : (
              <span className={styles.formValue}>{formattedDate}</span>
            )}
          </div>
          {/* Gender */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Gender :</label>
            {editMode ? (
              <input
                type="text"
                value={userData.gender}
                onChange={(e) =>
                  setUserData({ ...userData, gender: e.target.value })
                }
              />
            ) : (
              <span className={styles.formValue}>{userData.gender}</span>
            )}
          </div>
          {/* Profile Rating */}
          {/* <div className={styles.formRow}>
            <label className={styles.formLabel}>Profile Rating :</label>
            <span className={styles.formValue}>{userData.profileRating}</span>
          </div> */}
          {/* Email */}
          {isMyPage && (<><div className={styles.formRow}>
            <label className={styles.formLabel}>Email :</label>
            <span className={styles.formValue}>{userData.email}</span>
          </div>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Password :</label>
            <div className={styles.passwordField}>{"*********** "} <Edit2 size={15}/></div>
          </div></>)}

          <h3>Preferences</h3>
          {/* Drinking */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Drinking :</label>
            {editMode ? (
              <button
                type="button"
                className={`${styles.toggleBtn} ${userData.drinking ? styles.active : ""}`}
                onClick={() =>
                  setUserData({ ...userData, drinking: !userData.drinking })
                }
              >
                {userData.drinking ? "Yes" : "No"}
              </button>
            ) : (
              <span className={styles.formValue}>
                {userData.drinking ? "Yes" : "No"}
              </span>
            )}
          </div>
          {/* Smoking */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Smoking :</label>
            {editMode ? (
              <button
                type="button"
                className={`${styles.toggleBtn} ${userData.smoking ? styles.active : ""}`}
                onClick={() =>
                  setUserData({ ...userData, smoking: !userData.smoking })
                }
              >
                {userData.smoking ? "Yes" : "No"}
              </button>
            ) : (
              <span className={styles.formValue}>
                {userData.smoking ? "Yes" : "No"}
              </span>
            )}
          </div>
          {/* Driving */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Driving :</label>
            {editMode ? (
              <button
                type="button"
                className={`${styles.toggleBtn} ${userData.driving ? styles.active : ""}`}
                onClick={() =>
                  setUserData({ ...userData, driving: !userData.driving })
                }
              >
                {userData.driving ? "Yes" : "No"}
              </button>
            ) : (
              <span className={styles.formValue}>
                {userData.driving ? "Yes" : "No"}
              </span>
            )}
          </div>
          {/* Native */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Native :</label>
            {editMode ? (
              <input
                type="text"
                value={userData.native}
                onChange={(e) =>
                  setUserData({ ...userData, native: e.target.value })
                }
              />
            ) : (
              <span className={styles.formValue}>{userData.native}</span>
            )}
          </div>
          {/* Pronouns */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Pronouns :</label>
            {editMode ? (
              <input
                type="text"
                value={userData.pronouns}
                onChange={(e) =>
                  setUserData({ ...userData, pronouns: e.target.value })
                }
              />
            ) : (
              <span className={styles.formValue}>{userData.pronouns}</span>
            )}
          </div>
          {/* Religion */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Religion :</label>
            {editMode ? (
              <input
                type="text"
                value={userData.religion}
                onChange={(e) =>
                  setUserData({ ...userData, religion: e.target.value })
                }
              />
            ) : (
              <span className={styles.formValue}>{userData.religion}</span>
            )}
          </div>
          {/* Location */}
          <div className={styles.activitiesGrid}>
          <label className={styles.formLabel}>Liked Locations </label>
            {userData.locationPref.map((activity) => (
              <button
                key={activity}
                type="button"
                className={`${styles.activityButton} ${styles.activityActive}`}
              >
                {activity}
              </button>
            ))}
          </div>
          {/* nature */}
          <div className={styles.activitiesGrid}>
          <label className={styles.formLabel}>Your Nature </label>
            {userData.intrestTripType.map((activity) => (
              <button
                key={activity}
                type="button"
                className={`${styles.activityButton} ${styles.activityActive}`}
              >
                {activity}
              </button>
            ))}
          </div>
          {/* intrests */}
          <div className={styles.activitiesGrid}>
          <label className={styles.formLabel}>Your Intrests </label>
            {userData.interestType.map((activity) => (
              <button
                key={activity}
                type="button"
                className={`${styles.activityButton} ${styles.activityActive}`}
              >
                {activity}
              </button>
            ))}
          </div>
          <h3>About</h3>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Bio :</label>
            {editMode ? (
              <textarea
                value={userData.bio}
                onChange={(e) =>
                  setUserData({ ...userData, bio: e.target.value })
                }
              />
            ) : (
              <span className={styles.formValue}>{userData.bio}</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export default ProfilePage;
