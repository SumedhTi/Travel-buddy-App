import styles from "./Swipe.module.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../GlobalUserContext";
import Card from './Card';
import fetchData from "../../request";
import { toast } from "react-toastify";

const Swipe = () => {
  const [cards, setCards] = useState([]);
  const [type, setType] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { state, dispatch } = useUser();
  const location = useLocation();
  const tripId = location.state?.tripId;


  const fetchCards = async () => {
    if (tripId){
      const res = await fetchData(`/tripLikes?id=${tripId}`, "GET", navigate, dispatch);
      if (res) {
        setCards(res);
        setType(1);
      }
      setLoading(false);
    } else{
      const res = await fetchData(`/recommendations`, "GET", navigate, dispatch);
      if (res) {
        setCards(res);
      } 
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);


  async function handleLike(id) {
    let res;
    if(type === 0){
      res = await fetchData(`/likeTrip`, "POST", navigate, dispatch, { tripId:id }); 
    } else {
      res = await fetchData("/addChat", "POST", navigate, dispatch, { receiver: id }); 
    }
    if (!res) {
      toast.error("Network Error Please Try Again Later")
    } 
  }

  const handleSwipe = (card) => {
    setCards((prev) => prev.filter((e) => e._id !== card._id));
  };

  if (loading) {
    return <div className={styles.loading}>Loading cards...</div>;
  }

  return (
    <div className={styles.homeContainer}>
      <div className={styles.cardContainer}>
        {cards.length === 0 
        ? <div>No New Trips</div>
        : cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            onSwipe={handleSwipe}
            handleLike={handleLike}
            type={type}
          />
        ))}
      </div>
    </div>
  );
};

export default Swipe;
