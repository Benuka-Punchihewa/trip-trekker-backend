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

router.get("/", CommonMiddleware.paginate, HotelController.getPaginatedHotels);
router.get("/:hotelId", HotelController.getById);

//Update Hotel
router.patch(
  "/:hotelId",
  CommonMiddleware.uploader.array("files", 10),
  AuthMiddleware.authorize,
  AuthMiddleware.authorizeByRoles([constants.USER_TYPES.ADMIN]),
  HotelController.updateHotel
);

//Delete Hotel
router.delete(
  "/:hotelId",
  CommonMiddleware.uploader.array("files", 10),
  AuthMiddleware.authorize,
  AuthMiddleware.authorizeByRoles([constants.USER_TYPES.ADMIN]),
  HotelController.deleteHotel
);

// get nearest hotels
router.get("/nearest/locations", HotelController.getNearbyHotels);

export default router;
