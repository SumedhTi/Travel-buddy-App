import { User, Trips } from "../Modules/Schema.js"; // Adjust the import path

// 🧠 Helper function to calculate similarity
const calculateSimilarity = (user, otherUser, userTrips, otherTrips) => {
  let score = 0;

  // Location preference match
  const commonLocations =
    user.locationPref?.filter((loc) => otherUser.locationPref?.includes(loc)) || [];
  score += commonLocations.length * 2;

  // Nature type match
  const commonNature =
    user.natureType?.filter((n) => otherUser.natureType?.includes(n)) || [];
  score += commonNature.length;

  // Interest type match
  const commonInterests =
    user.interestType?.filter((i) => otherUser.interestType?.includes(i)) || [];
  score += commonInterests.length * 1.5;

  // Trip data match
  if (userTrips && otherTrips) {
    const userTripTypes = userTrips.flatMap((t) => t.tripType || []);
    const otherTripTypes = otherTrips.flatMap((t) => t.tripType || []);
    const commonTripTypes = userTripTypes.filter((t) =>
      otherTripTypes.includes(t)
    );
    score += commonTripTypes.length * 2;

    const userActivities = userTrips.flatMap((t) => t.activities || []);
    const otherActivities = otherTrips.flatMap((t) => t.activities || []);
    const commonActivities = userActivities.filter((a) =>
      otherActivities.includes(a)
    );
    score += commonActivities.length;
  }

  return score;
};

// 📍 Main Recommendation Function
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id; // you get this from JWT middleware

    // Get the current user and their trips
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const userTrips = await Trips.find({ createdBy: userId }).lean();

    // Get all other users
    const allUsers = await User.find({ _id: { $ne: userId } }).lean();

    const recommendations = [];

    for (const otherUser of allUsers) {
      const otherTrips = await Trips.find({ createdBy: otherUser._id }).lean();
      const similarityScore = calculateSimilarity(user, otherUser, userTrips, otherTrips);

      if (similarityScore > 0) {
        recommendations.push({
          userId: otherUser._id,
          name: otherUser.name,
          gender: otherUser.gender,
          locationPref: otherUser.locationPref,
          natureType: otherUser.natureType,
          interestType: otherUser.interestType,
          photo: otherUser.photo,
          similarityScore,
        });
      }
    }

    // Sort by similarity score (descending)
    recommendations.sort((a, b) => b.similarityScore - a.similarityScore);

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




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