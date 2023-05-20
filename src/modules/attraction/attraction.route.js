import express from "express";
import CommonMiddleware from "../common/common.middleware.js";
import AttractionController from "./attraction.controller.js";
import AuthMiddleware from "../auth/auth.middleware.js";
import constants from "../../constants.js";

const router = express.Router();

router.post(
  "/",
  CommonMiddleware.uploader.array("files", 10),
  AuthMiddleware.authorize,
  AuthMiddleware.authorizeByRoles([constants.USER_TYPES.ADMIN]),
  AttractionController.createAttraction
);

router.get(
  "/",
  CommonMiddleware.paginate,
  AttractionController.getPaginatedAttractions
);

router.get("/:attractionId", AttractionController.getById);

router.get("/nearest/locations", AttractionController.getNearbyAttractions);

export default router;
