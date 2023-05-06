import mongoose from "mongoose";
import constants from "../constants";

const users = [
  {
    _id: new mongoose.Types.ObjectId("6455dfeb31254ef4a70ac318"),
    auth: {
      _id: "admin@gmail.com",
    },
    name: "Benuka Punchihewa",
    address: "412/1A, Orange Rd., Pineapple",
    mobileNumber: "0712541544",
    birthday: new Date("1999-07-27T00:00:00.000+00:00"),
    gender: "Male",
    type: constants.USER_TYPES.ADMIN,
  },
  {
    _id: new mongoose.Types.ObjectId("6455e0211fe8fa83ebbfabe2"),
    auth: {
      _id: "tourguide@gmail.com",
    },
    name: "Benuka Punchihewa",
    address: "412/1A, Orange Rd., Pineapple",
    mobileNumber: "0712541544",
    birthday: new Date("1999-07-27T00:00:00.000+00:00"),
    gender: "Male",
    type: constants.USER_TYPES.TOUR_GUIDE,
    tourGuide: {
      isVerified: false,
      certificate: {
        mimeType: "application/pdf",
        firebaseStorageRef: "users/6455d42152534a9e2659ca94/certificate",
      },
    },
  },
  {
    _id: new mongoose.Types.ObjectId("6455e02a730fd892321c29cc"),
    auth: {
      _id: "tourist@gmail.com",
    },
    name: "Benuka Punchihewa",
    address: "412/1A, Orange Rd., Pineapple",
    mobileNumber: "0712541544",
    birthday: new Date("1999-07-27T00:00:00.000+00:00"),
    gender: "Male",
    type: constants.USER_TYPES.TOURIST,
  },
];

module.exports = users;
