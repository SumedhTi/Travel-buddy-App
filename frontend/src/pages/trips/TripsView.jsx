import React, { useEffect, useState } from "react";
import styles from "./TripsView.module.css";
import { ChevronDown, ChevronUp, Edit2Icon, Heart, Trash2 } from "lucide-react";
import { BASE } from "../../../api";
import { toast } from "react-toastify";
import { useUser } from "../../GlobalUserContext";

const ActivityTag = ({ children }) => {
  return <span className={styles.activityTag}>{children}</span>;
};

const TripsView = () => {
  const [openTripId, setOpenTripId] = useState(null);
  const [Trips, setTrips] = useState([]);
  const {state, dispatch} = useUser();

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const res = await fetch(BASE + `/trip`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Origin: "*",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setTrips(data);
        } else if (res.status === 403) {
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
    fetchTripData();
  }, []);

  const toggleTrip = (tripId) => {
    setOpenTripId(openTripId === tripId ? null : tripId);
  };

  const handleDelete = (tripId) => {
    console.log(`Deleting trip ID: ${tripId}`);
    alert(`Trip ${tripId} deleted (mock action).`);
  };

  const handleEdit = (tripId) => {
    console.log(`Editing trip ID: ${tripId}`);
    alert(`Navigating to edit form for trip ${tripId} (mock action).`);
  };

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>My Planed Trips</h2>
      <div className={styles.tripsList}>
        {Trips.map((trip) => {
          const isExpanded = trip._id === openTripId;
          return (
            <div key={trip._id} className={styles.tripCard}>
              <div
                className={styles.tripSummary}
                onClick={() => toggleTrip(trip._id)}
              >
                <div className={styles.summaryInfo}>
                  <div className={styles.dateRange}>
                    {new Date(trip.travelDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })};
                  </div>
                  <div className={styles.location}>
                    <span className={styles.label}>Destination:</span>{" "}
                    {trip.destination}
                  </div>
                  <div className={styles.tripType}>
                    <span className={styles.label}>Type:</span>{" "}
                    {trip.tripType.map((type, index) => (
                      <span key={index} className={styles.typeTag}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.chevron}>
                  {isExpanded ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </div>

              {/* 2. Expanded Details View */}
              <div
                className={`${styles.tripDetails} ${
                  isExpanded ? styles.expanded : ""
                }`}
              >
                <hr className={styles.divider} />

                <div className={styles.detailRow}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Travelers:</span>{" "}
                    {trip.groupSize}
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Total Cost:</span> $
                    {trip.totalCost}
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Budget/Person:</span> $
                    {trip.budget}
                  </div>
                </div>

                <div className={styles.activitiesSection}>
                  <span className={styles.detailLabel}>Activities:</span>
                  <div className={styles.activityTagsContainer}>
                    {trip.activities.map((activity, index) => (
                      <ActivityTag key={index}>{activity}</ActivityTag>
                    ))}
                  </div>
                </div>

                <div className={styles.notesSection}>
                  <span className={styles.detailLabel}>Notes:</span>
                  <p className={styles.notesText}>{trip.notes}</p>
                </div>

                {/* Edit and Delete Options */}
                <div className={styles.actionButtons}>
                  <button
                    className={`${styles.actionButton}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card from toggling
                      handleEdit(trip.id);
                    }}
                    title="View Likes"
                  >
                    <Heart size={18} /> View Likes
                  </button>
                  <div className={styles.rightActions}>
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card from toggling
                        handleDelete(trip.id);
                      }}
                      title="Delete Trip"
                    >
                      <Trash2 size={20} /> Delete
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.editButton}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card from toggling
                        handleEdit(trip.id);
                      }}
                      title="Edit Trip"
                    >
                      <Edit2Icon size={20} /> Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TripsView;
