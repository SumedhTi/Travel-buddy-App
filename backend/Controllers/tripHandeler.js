import { Trips } from "../Modules/Schema.js";

export const createTrip = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      tripType,
      destination,
      groupSize,
      activities,
      totalCost,
      travelDate,
      budget,
      notes,
    } = req.body;

    const newTrip = new Trips({
      createdBy: userId,
      tripType,
      destination,
      groupSize,
      activities,
      totalCost,
      travelDate,
      budget,
      notes,
      linkedBy: []
    });

    await newTrip.save();
    res
      .status(201)
      .json({ message: "Trip created successfully", trip: newTrip });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ message: "Failed to create trip" });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await Trips.find({ createdBy:req.user.id });

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
    const { id } = req.params;
    const {
      tripType,
      destination,
      groupSize,
      activities,
      totalCost,
      travelDate,
      budget,
      notes,
    } = req.body;

    const updatedTrip = await Trips.findByIdAndUpdate(
      id,
      {
        tripType,
        destination,
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
      res.status(400).json({ message: "Some Error occured" })
      return;
    }
    
    res.status(200).json({ message: "Trip updated successfully", trip: updatedTrip });
  } catch (error) {
    console.log(error);
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
}