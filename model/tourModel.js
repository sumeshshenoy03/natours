const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./usermodel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have name'],
      unique: true,
      trim: true,
    },
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },

    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'Must have difficulty'],
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],

    //guides: Array,(Doccument embedding mthod)

    //Child refernecing method
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },

  //virtual properties part of output
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingAverage: 1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//Doccument middleware before saving the doccument

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: false, // convert to lower case, defaults to `false`
  });
  next();
});

tourSchema.pre('save', function () {
  console.log('Saving...');
});

//Doccument middleware after saving the doccument

tourSchema.post('save', function () {
  console.log('Saved');
});
//Doccument Embedding method

// tourSchema.pre('save', async function (next) {
//   const guidesPromise = this.guides.map(
//     async (id) => await User.findById(id).select('-passwordChangedAt')
//   );
//   console.log(`guides${guidesPromise}`);
//   this.guides = await Promise.all(guidesPromise);
//   next();
// });

//Query middleware

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  console.log('Query middleware');
  next();
});
//populate method
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

//After query execution
tourSchema.post(/^find/, function (docs, next) {
  console.log('Query executed');
  next();
});

//Aggregate middleware

// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

//const Tour = mongoose.model('Tour', tourSchema);

//module.exports = Tour;
module.exports = mongoose.models.Tour || mongoose.model('Tour', tourSchema);
