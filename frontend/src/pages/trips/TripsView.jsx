import React, { useEffect, useState } from "react";
import styles from "./TripsView.module.css";
import { ChevronDown, ChevronUp, Edit2Icon, Heart, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "../../GlobalUserContext";
import { useNavigate } from "react-router-dom";
import fetchData from "../../request.js";

const ActivityTag = ({ children }) => {
  return <span className={styles.activityTag}>{children}</span>;
};

const TripsView = () => {
  const [openTripId, setOpenTripId] = useState(null);
  const [Trips, setTrips] = useState([]);
  const { state, dispatch } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTripData = async () => {
      const res = await fetchData(`/trip`, "GET", navigate, dispatch);  
      if (res) {
        setTrips(res);
      };
    };
    fetchTripData();
  }, []);

  const toggleTrip = (tripId) => {
    setOpenTripId(openTripId === tripId ? null : tripId);
  };

  const handleDelete = async (tripId) => {
    const res = await fetchData(`/trip/${tripId}`, "DELETE", navigate, dispatch);
    if (res) {
      setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== tripId));
      toast.info("Trip deleted successfully!");
    };
  };

  const handleEdit = (tripId) => {
    navigate("/AddTrip", {state: {tripId}})
  };

  const handleLiked = (tripId) => {
    console.log(`Viewing likes for trip ID: ${tripId}`);
    navigate("/swipe", {state: {tripId}})
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
                    {new Date(trip.travelDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    ;
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
                      handleLiked(trip._id);
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
                        handleDelete(trip._id);
                      }}
                      title="Delete Trip"
                    >
                      <Trash2 size={20} /> Delete
                    </button>
                    <button
                      className={`${styles.actionButton} ${styles.editButton}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card from toggling
                        handleEdit(trip._id);
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
