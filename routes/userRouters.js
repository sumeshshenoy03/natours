const express = require('express');
const router = express.Router();
const usersController = require('./../controllers/usersController');
const authController = require('./../controllers/authenticationController');

router.post('/signup', authController.signup);

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect); // This middleware applicable only to below middlewares

router.patch('/updatePassword', authController.updatePassword);
router.patch(
  '/updateMe',
  usersController.uploadUserPhoto,
  usersController.resizeUserPhoto,
  usersController.updateMe
);
router.delete('/deleteMe', usersController.deleteMe);

// router
//   .route('/')
//   .get(usersController.getUsers)
//   .post(usersController.createUser); // chaining get and post for same routes

router.get('/me', usersController.getMe, usersController.getUserbyId);

router.use(authController.restrictTo('admin')); // This middleware applicable only to below middlewares

router
  .route('/:id')
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser)
  .get(usersController.getUserbyId); // chaining get,patch and post for same routes

module.exports = router;
