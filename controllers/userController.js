const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

exports.signup = async (req, res) => {
    const { name, email, password, profilePhoto, phoneNumber, age } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      profilePhoto,
      phoneNumber,
      age,
      isGoogleSignup: false,
      isPremiumUser: false,
    });
    try {
      await user.save();
      res.status(201).json({ message: 'User created' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

exports.googleSignup = async (req, res) => {
    const { name, email, profilePhoto } = req.body;
    const user = new User({
      name,
      email,
      profilePhoto,
      isGoogleSignup: true,
      isPremiumUser: false,
    });
    try {
      await user.save();
      res.status(201).json({ message: 'User created' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

exports.sendOTP = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.MAILPASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'OTP for your account',
      text: `Your OTP is: ${otp}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: 'Error sending OTP' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'OTP sent' });
      }
    });
};

exports.buildProfile = async (req, res) => {
    const { userId, profileDetails } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { profileDetails }, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.chat = async (req, res) => {
    const { userId } = req.body;
    try {
      const user = await User.findById(userId);
      if (user.isPremiumUser) {
        res.status(200).json({ message: 'Chat allowed' });
      } else {
        res.status(403).json({ message: 'Premium user required for chat' });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

exports.payment = async (req, res) => {
    const { userId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { isPremiumUser: true }, { new: true });
    res.status(200).json({ message: 'Payment successful', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMatches = async (req, res) => {
    const { gender } = req.query;
    try {
      const users = await User.find({ 'profileDetails.relationshipStatus': 'single' });
      const matches = users.filter((user) => {
        if (gender === 'male') {
          return user.profileDetails.gender === 'female';
        } else {
          return user.profileDetails.gender === 'male';
        }
      });
      res.status(200).json(matches);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

exports.postAboutUs = async (req, res) => {
    const { description } = req.body;
    try {
      // Save the description to a database or file here actually i didnt create any schema for that .
      res.status(200).json({ message: 'About us description added' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
};

// This api for create anually 
exports.createUser = async (req, res) => {
    const { name, email, password, profilePhoto, phoneNumber, age, profileDetails } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      profilePhoto,
      phoneNumber,
      age,
      isGoogleSignup: false,
      isPremiumUser: false,
      profileDetails,
    });
    try {
      await user.save();
      res.status(201).json({ message: 'User created' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, profilePhoto, phoneNumber, age, profileDetails } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        id,
        {
          name,
          email,
          password,
          profilePhoto,
          phoneNumber,
          age,
          profileDetails,
        },
        { new: true }
      );
      res.status(200).json(user);
    } catch (err) {
      res.status(400)
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: 'User deleted' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

exports.getNearbyUsers = async (req, res) => {
  const { latitude, longitude } = req.query;
  try {
    const users = await User.find({
      'profileDetails.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 10000, // 10 km
        },
      },
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};