import mongoose from "mongoose";
import constants from "../../constants.js";
import { GeoJsonSchema, FirebaseSchema } from "../common/common.model.js";

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, "Name should have more than 3 characters!"],
      maxlength: [100, "Name cannot contain more than 100 characters!"],
      required: [true, "Name is required!"],
    },
    description: {
      type: String,
      maxlength: [
        10000,
        "Description cannot contain more than 10000 characters!",
      ],
      required: [true, "Description is required!"],
    },
    registrationNumber: {
      type: String,
      maxlength: [50, "Hotel name should not exceed 50 characters!"],
      required: [true, "Hotel registration number is required!"],
      unique: true,
    },
    address: {
      type: String,
      maxlength: [150, "Hotel address should not exceed 150 characters!"],
      required: [true, "Hotel address is required!"],
    },
    contactNumber: {
      type: String,
      maxlength: [20, "Hotel contact number should not exceed 20 characters!"],
      required: [true, "Hotel contact number is required!"],
    },
    email: {
      type: String,
      unique: true,
      maxlength: [50, "Email should not exceed 50 characters!"],
      required: [true, "Email is required!"],
      validate: {
        validator: (value) => {
          return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          );
        },
        message: (props) => `"${props.value}" is not a valid email address!`,
      },
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
    hotelFacilities: {
      type: [String],
      required: true,
      default: [],
    },
    location: {
      type: GeoJsonSchema,
      required: [true, "Location is required!"],
    },
    images: {
      type: [FirebaseSchema],
      required: true,
      default: [],
    },
    promotionImages: {
      type: [FirebaseSchema],
      required: true,
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model(constants.SCHEMAS.HOTEL, HotelSchema);
