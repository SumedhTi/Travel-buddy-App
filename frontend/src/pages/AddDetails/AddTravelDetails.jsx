import React, { useState } from "react";
import {
  Save,
  Coffee,
  Mountain,
  Book,
  Landmark,
  Crown,
  Car,
  Leaf,
  Wallet,
  Heart,
  Briefcase,
} from "lucide-react";
import styles from "./AddTravelDetails.module.css";
import { toast } from "react-toastify";
import { BASE } from "../../../api";

const AddTravelDetails = () => {
  const [formData, setFormData] = useState({
    tripType: [],
    destination: "",
    groupSize: "",
    activities: [],
    totalCost: "",
    travelDate: "",
    budget: "",
    notes: "",
  });

  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const tripTypes = [
    { id: "Adventure", label: "Adventure", icon: Mountain },
    { id: "Relaxation", label: "Relaxation", icon: Coffee }, // Or 'Bed', 'Sailboat'
    { id: "Cultural", label: "Cultural", icon: Landmark }, // Or 'BookOpen', 'Museum'
    { id: "Luxury", label: "Luxury", icon: Crown }, // Or 'Diamond'
    { id: "Road Trip", label: "Road Trip", icon: Car }, // Or 'Map'
    { id: "Nature", label: "Nature", icon: Leaf }, // Or 'Tent', 'Trees'
    { id: "Budget", label: "Budget", icon: Wallet }, // Or 'Wallet'
    { id: "Romantic", label: "Romantic", icon: Heart }, // Or 'Ring'
    { id: "Business", label: "Business", icon: Briefcase }, // Or 'Users'
  ];

  const activityOptions = [
    "Hiking",
    "Photography",
    "Food Tours",
    "Nightlife",
    "Rafting",
    "Beach Activities",
    "Adventure Sports",
    "Cultural Sites",
    "Stargazing",
    "Shopping",
    "Museums",
    "Nature Tours",
    "City Tours",
    "Spa",
    "Concerts",
    "Snowboarding",
    "Historical Walks",
    "Volunteering",
    "Swimming",
    "Brewery Tours",
    "Fishing/Boating",
    "Art Galleries",
    "Zoos/Aquariums",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTripTypeToggle = (type) => {
    setFormData((prev) => ({
      ...prev,
      tripType: prev.tripType.includes(type)
        ? prev.tripType.filter((t) => t !== type)
        : [...prev.tripType, type],
    }));
  };

  const handleActivityToggle = (activity) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter((a) => a !== activity)
        : [...prev.activities, activity],
    }));
  };

  const handleSave = async () => {
    setShowSuccessAnimation(true);
    try {
      const response = await fetch(BASE + "/addTrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: "*",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.info("Travel details saved successfully! 🎉");
      } else if (response.status === 403) {
        toast.error("Token Invalid Login Again");
        setTimeout(() => {
          sessionStorage.removeItem("userToken");
          dispatch({ type: "CLEAR_USER" });
          navigate("/login", { replace: true });
        }, 3000);
      } else {
        toast.error("Someting went wrong");
      }
    } catch (error) {
      toast.error("Some Error Occured");
    } finally {
      setTimeout(() => {
        handleReset();
        setShowSuccessAnimation(false);
      }, 2000);
    }
  };

  const handleReset = () => {
    setFormData({
      tripType: [""],
      destination: "",
      groupSize: "",
      activities: [],
      totalCost: "",
      travelDate: "",
      budget: "",
      notes: "",
    });
  };

  return (
    <div>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h1 className={styles.formTitle}>Add travel details</h1>
        </div>

        <form className={styles.form}>
          <div className={styles.formGrid}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              {/* Trip Type */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Trip type</label>
                <div className={styles.tripTypeButtons}>
                  {tripTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      className={`${styles.tripTypeButton} ${
                        formData.tripType.includes(type.id)
                          ? styles.tripTypeActive
                          : ""
                      }`}
                      onClick={() => handleTripTypeToggle(type.id)}
                    >
                      <type.icon size={16} />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Destination</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.destination}
                  onChange={(e) =>
                    handleInputChange("destination", e.target.value)
                  }
                  placeholder="Enter destination"
                />
              </div>


              {/* Activities */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Activities</label>
                <div className={styles.activitiesGrid}>
                  {activityOptions.map((activity) => (
                    <button
                      key={activity}
                      type="button"
                      className={`${styles.activityButton} ${
                        formData.activities.includes(activity)
                          ? styles.activityActive
                          : ""
                      }`}
                      onClick={() => handleActivityToggle(activity)}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.rightColumn}>
              {/* Group Size */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Group size</label>
                <input
                  type="number"
                  className={styles.input}
                  value={formData.groupSize}
                  onChange={(e) =>
                    handleInputChange("groupSize", e.target.value)
                  }
                  placeholder="Number of travelers"
                  min="1"
                />
              </div>
              {/* Total Cost */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Total cost</label>
                <input
                  type="number"
                  className={styles.input}
                  value={
                    formData.totalCost || formData.budget * formData.groupSize
                  }
                  onChange={(e) =>
                    handleInputChange("totalCost", e.target.value)
                  }
                  placeholder="Total trip cost"
                  min="0"
                  step="1"
                />
              </div>

              {/* Budget */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Budget (per person)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={
                    formData.budget ||
                    (formData.totalCost / formData.groupSize).toFixed(0)
                  }
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  placeholder="Budget per person"
                  min="0"
                  step="0.01"
                />
              </div>
              {/* Trip Information */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Travel date</label>
                <input
                  type="date"
                  className={styles.input}
                  value={formData.travelDate}
                  onChange={(e) =>
                    handleInputChange("travelDate", e.target.value)
                  }
                />
              </div>

              {/* Notes */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Notes</label>
                <textarea
                  className={styles.textarea}
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes or preferences"
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleReset}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`${styles.saveButton} ${
                showSuccessAnimation ? styles.saveButtonSuccess : ""
              }`}
              onClick={handleSave}
            >
              {showSuccessAnimation ? (
                <>
                  <div className={styles.spinner}></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save details
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      {/* Success Animation Overlay */}
      {showSuccessAnimation && (
        <div className={styles.successOverlay}>
          <div className={styles.successAnimation}>
            <div className={styles.checkmark}>✓</div>
            <p>Saving travel details...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTravelDetails;
