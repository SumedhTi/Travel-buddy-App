import { User, Trips } from "../Modules/Schema.js";

//RETURN ARRAY
// [
//     {
//       _id:"",
//       name: "",
//       age: "",
//       location: "",
//       tripType: [],
//       destination: "",
//       groupSize: "",
//       activities: [],
//       contact: ,
//       totalCost: ,
//       travelDate: "",
//       budget: ,
//       notes: "",
//       photo:""
//     },
//   ]

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get the current user's preferences
    const currentUser = await User.findById(userId).lean();
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found." });
    }

    const { interestType = [], intrestTripType = [], locationPref = [] } = currentUser;

    // 2. Get all trips not created by the current user and not already liked by them
    const allTrips = await Trips.find({
      createdBy: { $ne: userId },
      likedBy: { $nin: [userId] },
    })
      .populate("createdBy", "name dob native photo email language") // Populate creator's info
      .lean();

    // 3. Score and sort trips
    const recommendedTrips = allTrips
      .map((trip) => {
        let score = 0;

        // Score based on matching activities (interestType)
        if (trip.activities && interestType.length > 0) {
          const matchingActivities = trip.activities.filter((activity) =>
            interestType.includes(activity)
          );
          score += matchingActivities.length * 3; // Higher weight for activities
        }

        // Score based on matching trip types (intrestTripType)
        if (trip.tripType && intrestTripType.length > 0) {
          const matchingTripTypes = trip.tripType.filter((type) =>
            intrestTripType.includes(type)
          );
          score += matchingTripTypes.length * 2;
        }

        // Score based on matching destination (locationPref)
        if (trip.destinationType && locationPref.includes(trip.destinationType)) {
          score += 5; // High score for exact destination match
        }

        return { ...trip, score };
      })
      .filter((trip) => trip.score > 0) // Only include trips with a score > 0
      .sort((a, b) => b.score - a.score); // Sort by score descending

    // 4. Format the output
    const formattedRecommendations = recommendedTrips.map((trip) => {      
      const creator = trip.createdBy;
      let age = "N/A";
      if (creator.dob) {
        const ageDifMs = Date.now() - new Date(creator.dob).getTime();
        const ageDate = new Date(ageDifMs);
        age = Math.abs(ageDate.getUTCFullYear() - 1970);
      }

      return {
        _id: trip._id,
        name: creator.name,
        age: age,
        language: creator.language,
        location: creator.native,
        tripType: trip.tripType,
        destination: trip.destination,
        groupSize: trip.groupSize,
        activities: trip.activities,
        contact: creator.email,
        totalCost: trip.totalCost,
        travelDate: trip.travelDate,
        budget: trip.budget,
        notes: trip.notes,
        photo: creator.photo, // Assuming photo is a URL or base64 string
      };
    });

    res.status(200).json(formattedRecommendations);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ message: "Failed to get recommendations" });
  }
};