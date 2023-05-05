import express from "express";
import RatingController from "./rating.controller.js";
import AuthMiddleware from "../auth/auth.middleware.js";

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

export default router;
