const express = require('express');

const router = express.Router();

const viewController = require('./../controllers/viewsController');
const authController = require('../controllers/authenticationController');

const bookingController = require('../controllers/bookingController');

//router.use(authController.isLoggedIn);

router.use(viewController.alert);

router.get(
  '/',
  //bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);

router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);

router.get('/login', authController.isLoggedIn, viewController.getLogin);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
