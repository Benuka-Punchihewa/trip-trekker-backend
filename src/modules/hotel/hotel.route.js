import express from "express";
import CommonMiddleware from "../common/common.middleware.js";
import HotelController from "./hotel.controller.js";
import AuthMiddleware from "../auth/auth.middleware.js";
import constants from "../../constants.js";

const router = express.Router();

router.post(
  "/",
  CommonMiddleware.uploader.array("files", 10),
  AuthMiddleware.authorize,
  AuthMiddleware.authorizeByRoles([constants.USER_TYPES.ADMIN]),
  HotelController.createHotel
);

router.get(
  "/",
  CommonMiddleware.paginate,
  HotelController.getPaginatedHotels
);

router.get("/:hotelId", HotelController.getById);

export default router;
