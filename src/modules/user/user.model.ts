import mongoose, { Schema } from "mongoose";
import { FirebaseSchema } from "../common/common.model";
import { IUserModel } from "./user.interface";
import constants from "../../constants";

const UserSchema: Schema<IUserModel> = new mongoose.Schema(
  {
    auth: {
      _id: {
        type: String,
        ref: constants.SCHEMAS.AUTH,
        unique: true,
      },
    },
    name: {
      type: String,
      maxlength: [100, "Name cannot exceed 100 characters!"],
      required: [true, "Name is required!"],
    },
    profileImg: {
      type: FirebaseSchema,
    },
    address: {
      type: String,
      maxlength: [500, "Address cannot exceed 500 characters!"],
      required: [true, "Address is required!"],
    },
    mobileNumber: {
      type: String,
      maxlength: [100, "Mobile number cannot exceed 100 characters!"],
      required: [true, "Mobile number is required!"],
    },
    birthday: {
      type: Date,
      required: [true, "Birthday is required!"],
    },
    gender: {
      type: String,
      enum: {
        values: [constants.GENDER.MALE, constants.GENDER.FEMALE],
        message: "Invalid gender!",
      },
      required: [true, "Gender is required!"],
    },
    type: {
      type: String,
      enum: {
        values: [
          constants.USER_TYPES.ADMIN,
          constants.USER_TYPES.TOURIST,
          constants.USER_TYPES.TOUR_GUIDE,
        ],
        message: "Invalid user type!",
      },
      required: [true, "User type is required!"],
    },
    tourGuide: {
      certificate: {
        type: FirebaseSchema,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      rating: {
        type: Number,
        validate: {
          validator: (value: any) => {
            return value <= 5;
          },
          message: (props: any) => `Rating cannot exceed 5!`,
        },
      },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default mongoose.model<IUserModel>(constants.SCHEMAS.USER, UserSchema);
