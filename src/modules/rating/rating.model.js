import mongoose, { Schema } from "mongoose";
import constants from "../../constants.js";

const RatingSchema = new mongoose.Schema(
  {
    ratee: {
      type: {
        type: String,
        required: [true, "Ratee type is required!"],
        enum: {
          values: [
            constants.RATINGS.RATEES.HOTEL,
            constants.RATINGS.RATEES.ATTRACTION,
            constants.RATINGS.RATEES.TOUR_GUIDE,
          ],
          message: "Invalid ratee type!",
        },
      },

      hotel: {
        _id: {
          type: Schema.Types.ObjectId,
          // TODO: ref: constants.SCHEMAS.HOTEL
        },
      },
      attraction: {
        _id: {
          type: Schema.Types.ObjectId,
          ref: constants.SCHEMAS.ATTRACTION,
        },
      },
      user: {
        _id: {
          type: Schema.Types.ObjectId,
          ref: constants.SCHEMAS.USER,
        },
      },
    },
    rater: {
      user: {
        _id: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: constants.SCHEMAS.USER,
        },
        name: {
          type: String,
          required: true,
        },
      },
    },
    rating: {
      type: Number,
      required: [true, "Rating is required!"],
      validate: {
        validator: function (v) {
          return v <= 5;
        },
        message: "Rating must be less than 5!",
      },
    },
    review: {
      type: String,
      minlength: [3, "Review should have more than 3 characters!"],
      maxlength: [500, "Review cannot exceed 500 characters!"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model(constants.SCHEMAS.RATING, RatingSchema);
0;
