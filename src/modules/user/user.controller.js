import NotFoundError from "../error/error.classes/NotFoundError.js";
import userService from "./user.service.js";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../error/error.classes/BadRequestError.js";
import constants from "../../constants.js";
import userUtil from "./user.util.js";
import commonService from "../common/common.service.js";

const getPaginatedTourGuide = async (req, res) => {
  const pageable = req.body.pageable;
  const { keyword } = req.query;
  const auth = req.body.auth;

  const result = await userService.findPaginatedTourGuides(
    keyword,
    auth?.user?.type === constants.USER_TYPES.ADMIN ? true : false,
    pageable
  );

  return res.status(StatusCodes.OK).json(result);
};

const findById = async (req, res) => {
  const { userId } = req.params;
  const dbUser = await userService.findById(userId);
  return res.status(StatusCodes.OK).json(dbUser);
};

const updateUserIsVerified = async (req, res) => {
  const { userId } = req.params;
  const { tourGuide } = req.body;

  const user = await userService.findById(userId);

  if (!user) {
    throw new NotFoundError("User Not Found!");
  }

  // check if user is a tour guide
  if (user.type !== constants.USER_TYPES.TOUR_GUIDE) {
    throw new BadRequestError("User is not a Tour Guide!");
  }

  user.tourGuide.isVerified = tourGuide.isVerified;
  await userService.save(user);

  return res.status(StatusCodes.OK).json({ user });
};

const updateProfileImage = async (req, res) => {
  const file = req.file;
  const { userId } = req.params;

  // check if user exists
  const dbUser = await userService.findById(userId);
  if (!dbUser) throw new NotFoundError("User not found!");

  // upload image if provided
  if (file) {
    const path = userUtil.getFirebasePathForProfileImageUploads(
      dbUser._id.toString()
    );

    // upload image to firebase
    await commonService.uploadToFirebase(file, path);

    const firebaseFile = {
      mimeType: file.mimetype,
      firebaseStorageRef: path,
    };

    // set profile image
    dbUser.profileImg = firebaseFile;
    await userService.save(dbUser);
  }

  return res.status(StatusCodes.OK).json(dbUser);
};

export default {
  getPaginatedTourGuide,
  findById,
  updateUserIsVerified,
  updateProfileImage,
};
