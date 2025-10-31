import { User } from "../Modules/Schema.js";

//Create a new recomendation model you can see the scemas.js to analys the fields you are working with
//the output of the fuction should be as follows
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










//DEPRECATED create a new fuction this is kept here to take ideas only
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const our_user = await User.findById(userId).lean();
    const other_users = await User.find({ _id: { $ne: userId } }).lean();

    if (!our_user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!other_users || other_users.length === 0 ) {
      return res.status(404).json({ message: "No other users found" });
    }

    const attributes = ["drinking", "smoking", "native", "driving", "pronouns", "religion"];

    const recommendations = other_users.map(user => {
      let score = 0;

      if (our_user.locationPref && user.locationPref) {
        const commonDest = countMatches(our_user.locationPref, user.locationPref);
        if (commonDest > 0) score += 50;
      }

      if (our_user.gender && user.gender && our_user.gender === user.gender) {
        score += 30;
      }

      if (our_user.interestType && user.interestType) {
        const commonInterests = countMatches(our_user.interestType, user.interestType);
        score += commonInterests * 20;
      }

      if (our_user.language && user.language) {
        const commonLang = countMatches(our_user.language, user.language);
        if (commonLang > 0) score += 15;
      }
        attributes.forEach(attr => {
            if (our_user[attr] !== undefined && user[attr] !== undefined) {
                if (our_user[attr] === user[attr]) {
                score += 10;
                }
            }
        });

      return {
        ...user,
        matchScore: score
      };
    });

    recommendations.sort((a, b) => a.matchScore - b.matchScore);

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

function countMatches(arr1, arr2) {
  return arr1.filter(item => arr2.includes(item)).length;
}