const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/google-signup', userController.googleSignup);
router.post('/otp', userController.sendOTP);
router.post('/profile', userController.buildProfile);
router.post('/chat', userController.chat);
router.post('/payment', userController.payment);
router.get('/matches', userController.getMatches);
router.post('/about-us', userController.postAboutUs);
router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.get('/nearby-users', userController.getNearbyUsers);

module.exports = router;