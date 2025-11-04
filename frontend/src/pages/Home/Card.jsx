import styles from "./Home.module.css";
import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  Heart,
  MapPin,
  Calendar,
  Users,
  Plane,
  Coffee,
  Mountain,
  Landmark,
  Crown,
  Car,
  Leaf,
  Wallet,
  Briefcase,
  X,
  Camera,
  HelpCircle,
  Footprints,
  Star,
  Waves,
  Sailboat,
  Anchor,
  Sun,
  Zap,
  Snowflake,
  BookOpen,
  Music,
  Palette,
  Building,
  ShoppingCart,
  Martini,
  HeartHandshake,
  Utensils,
  Beer,
  PawPrint,
} from "lucide-react";

const Card = ({ card, onSwipe, handleLike }) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const rotate = useTransform(x, [-150, 150], [-18, 18]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [swipeDirection, setSwipeDirection] = useState(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleDragEnd = (event, info) => {
    const offsetX = info.offset.x;
    if (offsetX > 200) {
      console.log("Card swiped right");
      onSwipe(card, "right");
    } else if (offsetX < -200) {
      console.log("Card swiped left");
      onSwipe(card, "left");
    }
    x.set(0); // reset card back if not swiped enough
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;

    setDragOffset({ x: deltaX, y: deltaY });

    // Determine swipe direction
    if (Math.abs(deltaX) > 50) {
      setSwipeDirection(deltaX > 0 ? "right" : "left");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);

    if (Math.abs(dragOffset.x) > 150) {
      if (dragOffset.x > 0) {
        handleLike(card._id);
      } else {
        // handleReject(card._id);
      }
    }

    setDragOffset({ x: 0, y: 0 });
    setSwipeDirection(null);
  };

  const getTripTypeIcon = (type) => {
    const iconMap = {
      Adventure: Mountain,
      Relaxation: Coffee,
      Cultural: Landmark,
      Luxury: Crown,
      "Road Trip": Car,
      Nature: Leaf,
      Budget: Wallet,
      Romantic: Heart,
      Business: Briefcase,
    };
    return iconMap[type] || HelpCircle;
  };

  const getInterestIcon = (interest) => {
    const iconMap = {
      Hiking: Footprints,
      "Nature Tours": Leaf,
      Stargazing: Star,
      Swimming: Waves,
      Rafting: Sailboat,
      "Fishing/Boating": Anchor,
      "Beach Activities": Sun,
      "Adventure Sports": Zap,
      Snowboarding: Snowflake,
      "Cultural Sites": Landmark,
      "Historical Walks": BookOpen,
      // Museums: ,
      "Art Galleries": Palette,
      Concerts: Music,
      "City Tours": Building,
      Shopping: ShoppingCart,
      Nightlife: Martini,
      Photography: Camera,
      Volunteering: HeartHandshake,
      "Food Tours": Utensils,
      "Brewery Tours": Beer,
      // Spa: ,
      "Zoos/Aquariums": PawPrint,
    };

    // Fallback icon if the activity is not found
    return iconMap[interest] || "HelpCircle";
  };

  return (
    <motion.div
      className={styles.card}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      whileTap={{ cursor: "grabbing" }}
      style={{ x, opacity }}
      onDragEnd={handleDragEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Image Container */}
      <div className={styles.imageContainer}>
        <img src={card.photo} alt={card.name} className={styles.profileImage} />

        {/* Swipe Indicators */}
        {swipeDirection === "right" && (
          <div className={`${styles.swipeIndicator} ${styles.likeIndicator}`}>
            <Heart size={40} />
            <span>LIKE</span>
          </div>
        )}
        {swipeDirection === "left" && (
          <div className={`${styles.swipeIndicator} ${styles.rejectIndicator}`}>
            <X size={40} />
            <span>NOPE</span>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className={styles.profileInfo}>
        <div className={styles.profileHeader}>
          <h2>
            {card.name}, {card.age}
          </h2>
          <div className={styles.location}>
            <MapPin size={16} />
            <span>{card.location}</span>
          </div>
        </div>

        <div className={styles.tripdetails}>
          <div className={styles.tripitem}>
            <Plane size={16} />
            <span>{card.destination}</span>
          </div>
          <div className={styles.tripitem}>
            <Calendar size={16} />
            <span>{card.travelDate}</span>
          </div>
          <div className={styles.tripitem}>
            <Users size={16} />
            <span>{card.groupSize}</span>
          </div>
        </div>

        <div className={styles.interestscontainer}>
          <h4>Type Of Trip</h4>
          <div className={styles.interestsgrid}>
            {card.tripType?.map((trip, index) => {
              const IconComponent = getTripTypeIcon(trip);
              return (
                <div key={index} className={styles.interesttag}>
                  <IconComponent size={14} />
                  <span>{trip}</span>
                </div>
              );
            })}
          </div>
        </div>


        <div className={styles.additionalinfo}>
          <div className={styles.infogrid}>
            <div className={styles.infoitem}>
              <span className={styles.label}>Budget:</span>
              <span className={styles.value}>{card.budget}</span>
            </div>
            <div className={styles.infoitem}>
              <span className={styles.label}>Languages:</span>
              {/* <span className="value">{card.language?.join(", ")}</span> */}
            </div>
            <div className={styles.infoitem}>
              <span className={styles.label}>Styled:</span>
              <div className={styles.activitiesTag}>
                {card.activities?.map((trait, index) => {
                  const IconCom = getInterestIcon(trait);
                  return(<span key={index} className={styles.activityTag}>
                    <IconCom size={14} /> {trait}
                  </span>)
                })}
              </div>
            </div>
        <div className={styles.biosection}>
          <p>Notes:</p>
          <p>{card.notes || "NA"}</p>
        </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;