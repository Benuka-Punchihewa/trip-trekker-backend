import mongoose from "mongoose";
import constants from "../../constants.js";
import { GeoJsonSchema, FirebaseSchema } from "../common/common.model.js";

const AttractionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, "Name should have more than 3 characters!"],
      maxlength: [100, "Name cannot contain more than 100 characters!"],
      required: [true, "Name is required!"],
    },
    location: {
      type: GeoJsonSchema,
      required: [true, "Location is required!"],
    },
    description: {
      type: String,
      maxlength: [
        10000,
        "Description cannot contain more than 10000 characters!",
      ],
      required: [true, "Description is required!"],
    },
    openHours: {
      open: {
        type: Date,
        required: [true, "Open hour is required!"],
      },
      close: {
        type: Date,
        required: [true, "Close hour is required!"],
      },
    },
    images: {
      type: [FirebaseSchema],
      required: true,
      default: [],
    },
    accessibilityOptions: {
      type: [String],
      required: true,
      default: [],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required!"],
      default: 5,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model(constants.SCHEMAS.ATTRACTION, AttractionSchema);
