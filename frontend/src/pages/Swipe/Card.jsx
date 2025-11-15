import styles from "./Swipe.module.css";
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
  BottleWine,
  Cigarette,
} from "lucide-react";

const Card = ({ card, onSwipe, handleLike, type }) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const rotate = useTransform(x, [-150, 150], [-18, 18]);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const startPos = useRef({ x: 0, y: 0 });

  let age;
  let formattedDate;
  if (type === 1) {
    const ageDifMs = Date.now() - new Date(card.dob).getTime();
    const ageDate = new Date(ageDifMs);
    age = Math.abs(ageDate.getUTCFullYear() - 1970);
  } else{
    const dateObject = new Date(card.travelDate);
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const fullYear = dateObject.getFullYear();
    const year = String(fullYear);
    formattedDate = `${day}/${month}/${year}`;
  }

  const handleDragEnd = (event, info) => {
    const offsetX = info.offset.x;
    if (offsetX > 200) {
      ("Card swiped right");
      handleLike(card._id)
      onSwipe(card);
    } else if (offsetX < -200) {
      onSwipe(card);
    }
    x.set(0);
    setSwipeDirection(null);
  };

  const handleDrag = (event, info) => {
    const deltaX = info.offset.x; 
    const deltaY = info.offset.y;

    if (Math.abs(deltaX) > 50) {
      setSwipeDirection(deltaX > 0 ? "right" : "left");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleDragStart = (event, info) => {
    startPos.current = { x: info.point.x, y: info.point.y };
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
      "Art Galleries": Palette,
      Concerts: Music,
      "City Tours": Building,
      Shopping: ShoppingCart,
      Nightlife: Martini,
      Photography: Camera,
      Volunteering: HeartHandshake,
      "Food Tours": Utensils,
      "Brewery Tours": Beer,
      "Zoos/Aquariums": PawPrint,
    };

    return iconMap[interest] || HelpCircle;
  };

  if (type === 0) {
    return (
      <motion.div
        className={styles.card}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        whileTap={{ cursor: "grabbing" }}
        style={{ x, opacity, touchAction: "pan-y", }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        {/* Image Container */}
        <div className={styles.imageContainer}>
          <img
            src={card.photo}
            alt={card.name}
            className={styles.profileImage}
          />

          {/* Swipe Indicators */}
          {swipeDirection === "right" && (
            <div className={`${styles.swipeIndicator} ${styles.likeIndicator}`}>
              <Heart size={40} />
              <span>LIKE</span>
            </div>
          )}
          {swipeDirection === "left" && (
            <div
              className={`${styles.swipeIndicator} ${styles.rejectIndicator}`}
            >
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
              <span>{formattedDate}</span>
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
                <span className="value">{card.language?.join(", ")}</span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.label}>Styled:</span>
                <div className={styles.activitiesTag}>
                  {card.activities?.map((trait, index) => {
                    const IconCom = getInterestIcon(trait);
                    return (
                      <span key={index} className={styles.activityTag}>
                        <IconCom size={14} /> {trait}
                      </span>
                    );
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
  } else {
    return (
      <motion.div
        className={styles.card}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        whileTap={{ cursor: "grabbing" }}
        style={{ x, opacity, touchAction: "pan-y", rotate }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        {/* Image Container */}
        <div className={styles.imageContainer}>
          <img
            src={card.photo}
            alt={card.name}
            className={styles.profileImage}
          />

          {/* Swipe Indicators */}
          {swipeDirection === "right" && (
            <div className={`${styles.swipeIndicator} ${styles.likeIndicator}`}>
              <Heart size={40} />
              <span>LIKE</span>
            </div>
          )}
          {swipeDirection === "left" && (
            <div
              className={`${styles.swipeIndicator} ${styles.rejectIndicator}`}
            >
              <X size={40} />
              <span>NOPE</span>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className={styles.profileInfo}>
          <div className={styles.profileHeader}>
            <h2>
              {card.name}, {age}, {card.gender === "male" ? "He" : "She"}
            </h2>
            <div className={styles.location}>
              <MapPin size={16} />
              <span>{card.native}</span>
            </div>
          </div>

          <div className={styles.interestscontainer}>
            <h4>Likes</h4>
            <div className={styles.interestsgrid}>
              {card.intrestTripType?.map((trip, index) => {
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
                <span className={styles.label}>Languages:</span>
                <span className="value">{card.language?.join(", ")}</span>
              </div>
              <div className={styles.infoitem}>
                <span className={styles.label}>Liked Activitys:</span>
                <div className={styles.activitiesTag}>
                  {card.interestType?.map((trait, index) => {
                    const IconCom = getInterestIcon(trait);
                    return (
                      <span key={index} className={styles.activityTag}>
                        <IconCom size={14} /> {trait}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className={`${styles.tripdetails} ${styles.long}`}>
                <div className={`${styles.tripitem} ${styles.long2}`}>
                  <Car size={25} />
                  <span>{card.driving ? "Yes" : "No"}</span>
                </div>
                <div className={`${styles.tripitem} ${styles.long2}`}>
                  <BottleWine size={25} />
                  <span>{card.drinking ? "Yes" : "No"}</span>
                </div>
                <div className={`${styles.tripitem} ${styles.long2}`}>
                  <Cigarette size={25} />
                  <span>{card.smoking ? "Yes" : "No"}</span>
                </div>
              </div>
              <div className={styles.biosection}>
                <p>Bio:</p>
                <p>{card.bio || "NA"}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
};

export default Card;
