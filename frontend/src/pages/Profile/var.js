import {
  Save,
  Coffee,
  Mountain,
  Book,
  Landmark,
  Crown,
  Car,
  Leaf,
  Wallet,
  Heart,
  Briefcase,
} from "lucide-react";

export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: "100%",
    padding: "6px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "16px",
    background: state.isFocused ? "white" : "#fafafa",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: state.isFocused
      ? "0 12px 35px rgba(102, 126, 234, 0.15)"
      : "none",
    transform: state.isFocused ? "translateY(-2px)" : "none",
    outline: "none",
    boxSizing: "border-box",
    minHeight: "48px",
    "&:hover": {
      borderColor: "#667eea",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 8px",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0",
    padding: "0",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#e2e8f0",
    borderRadius: "8px",
    padding: "2px 6px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    ":hover": {
      backgroundColor: "#667eea",
      color: "white",
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    zIndex: 9999,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999, // ensures it's above other elements
  }),
};

export const preferences = {
  locationPref: [
    { value: "mountains", label: "Mountains" },
    { value: "beach", label: "Beach" },
    { value: "city", label: "City" },
    { value: "desert", label: "Desert" },
    { value: "countryside", label: "Countryside" },
    { value: "forest", label: "Forest" },
    { value: "waterfalls", label: "Waterfalls" },
    { value: "wildlife", label: "Wildlife" },
    { value: "lakes", label: "Lakes" },
    { value: "hills", label: "Hills" },
  ],
  native: [
    { value: "indian", label: "Indian" },
    { value: "american", label: "American" },
    { value: "japanese", label: "Japanese" },
    { value: "italian", label: "Italian" },
    { value: "french", label: "French" },
  ],
  language: [
    { value: "hindi", label: "Hindi" },
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "japanese", label: "Japanese" },
  ],
  religion: [
    { value: "hindu", label: "Hindu" },
    { value: "christian", label: "Christian" },
    { value: "muslim", label: "Muslim" },
    { value: "buddhist", label: "Buddhist" },
    { value: "sikh", label: "Sikh" },
  ],
};

export const activityOptions = [
  "Hiking",
  "Photography",
  "Food Tours",
  "Nightlife",
  "Rafting",
  "Beach Activities",
  "Adventure Sports",
  "Cultural Sites",
  "Stargazing",
  "Shopping",
  "Museums",
  "Nature Tours",
  "City Tours",
  "Spa",
  "Concerts",
  "Snowboarding",
  "Historical Walks",
  "Volunteering",
  "Swimming",
  "Brewery Tours",
  "Fishing/Boating",
  "Art Galleries",
  "Zoos/Aquariums",
];

export const tripTypes = [
  { id: "Adventure", label: "Adventure", icon: Mountain },
  { id: "Relaxation", label: "Relaxation", icon: Coffee }, // Or 'Bed', 'Sailboat'
  { id: "Cultural", label: "Cultural", icon: Landmark }, // Or 'BookOpen', 'Museum'
  { id: "Luxury", label: "Luxury", icon: Crown }, // Or 'Diamond'
  { id: "Road Trip", label: "Road Trip", icon: Car }, // Or 'Map'
  { id: "Nature", label: "Nature", icon: Leaf }, // Or 'Tent', 'Trees'
  { id: "Budget", label: "Budget", icon: Wallet }, // Or 'Wallet'
  { id: "Romantic", label: "Romantic", icon: Heart }, // Or 'Ring'
  { id: "Business", label: "Business", icon: Briefcase }, // Or 'Users'
];
