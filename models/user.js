const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profilePhoto: String,
  phoneNumber: String,
  age: Number,
  isGoogleSignup: Boolean,
  profileDetails: {
    religion: String,
    community: String,
    relationshipStatus: String,
    country: String,
    state: String,
    city: String,
    education: [
      {
        courseName: String,
        collegeName: String,
        collegePlace: String,
      },
    ],
    isWorking: Boolean,
    jobRole: String,
    companyName: String,
    workplace: String,
    aboutUser: String,
    images: [String],
    passions: [String],
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
  },
  isPremiumUser: Boolean,
});

userSchema.index({ "profileDetails.location": "2dsphere" });

const User = mongoose.model("User", userSchema);

module.exports = User;
