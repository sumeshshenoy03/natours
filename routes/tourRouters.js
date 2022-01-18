const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authenticationController');
//const reviewController = require('./../controllers/reviewControllers');
const reveiwRouter = require('./../routes/reviewRouter');

const {
  getTours,
  createTour,
  getTourbyId,
  deleteTour,
  updateTour,
  checkID,
  checkBody,
  checkMiddleware,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImags,
} = require('./../controllers/toursController');
//router.param('id', checkID);
router
  .route('/')
  .get(getTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    createTour
  ); //chaining get and post for same routes
router.route('/top-5-cheap').get(aliasTopTours, getTours);
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('user', 'lead-guide'),
    getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImags,
    updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('user', 'lead-guide'),
    deleteTour
  )
  .get(checkMiddleware, getTourbyId); //chaining get,patch and post for same routes

//POST /tour/235fed589/reviews/
//Get /tour/235fed589/reviews/
//Get /tour/235fed589/reviews/e98989ab

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('users'),
//     reviewController.createReview
//   );
router.use('/:tourId/reviews', reveiwRouter);
module.exports = router;
