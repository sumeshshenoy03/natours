// const express = require('express');

// const morgan = require('morgan');

// const AppError = require('./utils/appError');

// const globalErrorHandler = require('./controllers/errorController');

const dotenv = require('dotenv');
// const tourRouter = require('./routes/tourRouters');
// const userRouter = require('./routes/userRouters');

dotenv.config({ path: './config.env' });

// const app = express();

// //console.log(process.env);

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// app.use(express.json());

// app.use(express.static(`${__dirname}/public`));
// app.use('/api/v1/tours/', tourRouter);
// app.use('/api/v1/users/', userRouter);

// //Any routes apart from above goes below

// app.all('*', (req, res, next) => {
//   console.log('all *******');
//   // res.status(404).json({
//   //   status: 'Failed',
//   //   message: `Cannot find the requested resource on ${req.originalUrl}`,
//   // });

//   // const err = new Error(
//   // `Cannot find the requested resource on ${req.originalUrl}`
//   // );
//   //err.status = 'Failed';
//   //err.statusCode = 404;
//   next(
//     new AppError(
//       `Cannot find the requested resource on ${req.originalUrl}`,
//       404
//     )
//   );
// });

// // app.use('/api/v1/tours/:id', (req, res, next) => {
// //   console.log('Hello from Middleware');
// //   next();
// // });
// // app.use((req, res, next) => {
// //   req.requestTime = new Date().toISOString();
// //   console.log('Hello from Middleware_2');
// //   next();
// // });
// app.use(globalErrorHandler);
// //app.patch('/api/v1/tours/:id', updateTour);

// //app.get('/api/v1/tours', getTours);

// //app.get('/api/v1/tours/:id', getTourbyId);

// //app.delete('/api/v1/tours/:id', deleteTour);

// //app.post('/api/v1/tours', createTour);
// module.exports = app;

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRouters');
const userRouter = require('./routes/userRouters');
const reviewRouter = require('./routes/reviewRouter');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const bookingController = require('./controllers/bookingController');
//start express app
const app = express();

app.enable('trust proxy');

//set view engine and path
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//security http headers
// app.use(helmet());
// // 1) MIDDLEWARES
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
    },
  })
);

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again after 1 hour',
});

//implement cors

app.use(cors()); //Sets access-control-cllow-origin:'*'

//options

app.options('*', cors());

//limit requests from same IP
app.use('/api', limiter);

//this should be before body parser
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

//compression
app.use(compression());

//Body parser, reading data from req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Data sanitization against no sql injection

app.use(mongoSanitize());

//Data sanitization against xss
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration', 'price', 'difficulty'],
  })
);
//serving statis files
app.use(express.static(`${__dirname}/public`));

//Test middlewares
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
