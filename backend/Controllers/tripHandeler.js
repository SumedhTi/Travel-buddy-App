import { Trips, User } from "../Modules/Schema.js";

export const getTripById = async (req, res) => {
  try {
    const tripId = req.query.id;
    let query;
    if (tripId) {
      query = { _id: tripId, createdBy: req.user.id };
    } else {
      query = { createdBy: req.user.id };
    }
    const trip = await Trips.find(query);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ message: "Failed to fetch trip" });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const {
      _id,
      tripType,
      destination,
      destinationType,
      groupSize,
      activities,
      totalCost,
      travelDate,
      budget,
      notes,
      isNew,
    } = req.body;

    if (isNew) {
      const newTrip = new Trips({
        createdBy: req.user.id,
        tripType,
        destination,
        destinationType,
        groupSize,
        activities,
        totalCost,
        travelDate,
        budget,
        notes,
        linkedBy: [],
      });

      await newTrip.save();
      res
        .status(201)
        .json({ message: "Trip created successfully", trip: newTrip });
    } else {
      const updatedTrip = await Trips.findByIdAndUpdate(
        _id,
        {
          tripType,
          destination,
          destinationType,
          groupSize,
          activities,
          totalCost,
          travelDate,
          budget,
          notes,
        },
        { new: true }
      );

      if (!updatedTrip) {
        res.status(400).json({ message: "Some Error occured" });
        return;
      }
      res
        .status(200)
        .json({ message: "Trip updated successfully", trip: updatedTrip });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const trip = await Trips.findOneAndDelete({
      _id: tripId,
      createdBy: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ message: "Failed to delete trip" });
  }
};


export const tripLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tripId } = req.body;
    const trip = await Trips.updateOne(
      { _id: tripId },
      { $addToSet: { likedBy: userId } }
    );
    res.status(200).json(trip);
  } catch (e) {
    console.log(e);
  }
};

export const getTripLikes = async (req, res) => {
    try {
    const tripId = req.query.id;
    if(!tripId) return res.status(400).json({message: "Trip Id is required"});
    const trip = await Trips.find({ _id: tripId, createdBy: req.user.id }).lean();

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const likedByUserIds = trip[0].likedBy;

    const likedUsers = await User.find({ _id: { $in: likedByUserIds } }).select("-password -googleId").lean();

    res.status(200).json(likedUsers);
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ message: "Failed to fetch trip" });
  }
};
