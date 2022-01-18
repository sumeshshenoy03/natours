const AppError = require('../utils/appError');
const Tour = require('../model/tourModel');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../model/usermodel');

const Booking = require('../model/bookingModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1) Get tour data from collection

  const tours = await Tour.find();

  //2) Build template

  //3) Render the template using tour data from 1)
  res.status(200).render('overview', {
    tours: tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1) get tour data, for the requested tor(including reviews and guides)

  const tourName = req.params.slug;
  const tour = await Tour.findOne({ slug: tourName }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  //2) build template

  //3) Render template using data from 1)

  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour,
  });
});

exports.getLogin = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'login',
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'Your Account',
    user: updatedUser,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  //Find all Bookings

  const bookings = await Booking.find({ user: req.user.id });

  // Find tours with the returned ID's
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.alert = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert = 'Your booking was successful, please check your email';
  next();
};
