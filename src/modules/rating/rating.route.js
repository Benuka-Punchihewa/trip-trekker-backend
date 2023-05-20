import express from "express";
import RatingController from "./rating.controller.js";
import AuthMiddleware from "../auth/auth.middleware.js";
import commonMiddleware from "../common/common.middleware.js";

const router = express.Router();

router.post(
  "/attractions/:attractionId",
  AuthMiddleware.authorize,
  RatingController.rateAttraction
);

router.patch(
  "/:ratingId",
  AuthMiddleware.authorize,
  RatingController.updateRating
);

router.delete(
  "/:ratingId",
  AuthMiddleware.authorize,
  RatingController.deleteRating
);

router.get(
  "/attractions/:attractionId",
  commonMiddleware.paginate,
  RatingController.getPaginatedAttractionRatings
);

router.post(
  "/users/:userId",
  AuthMiddleware.authorize,
  RatingController.rateTourGuide
);

router.get(
  "/users/:userId",
  commonMiddleware.paginate,
  RatingController.getPaginatedTourGuideRatings
);

router.post(
  "/hotels/:hotelId",
  AuthMiddleware.authorize,
  RatingController.rateHotel
);

router.get(
  "/hotels/:hotelId",
  commonMiddleware.paginate,
  RatingController.getPaginatedHotelRatings
);
export default router;
