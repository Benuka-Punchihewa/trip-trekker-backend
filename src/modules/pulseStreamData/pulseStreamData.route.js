import express from "express";
import CommonMiddleware from "../common/common.middleware.js";
import PulseStreamDataController from "./pulseStreamData.controller.js";
import AuthMiddleware from "../auth/auth.middleware.js";
import constants from "../../constants.js";

const router = express.Router();

router.post(
  "/attractions/:attractionId",
  CommonMiddleware.uploader.single("file"),
  AuthMiddleware.authorize,
  AuthMiddleware.authorizeByRoles([
    constants.USER_TYPES.ADMIN,
    constants.USER_TYPES.TOUR_GUIDE,
  ]),
  PulseStreamDataController.createPulseRecord
);

router.get(
  "/attractions/:attractionId",
  CommonMiddleware.paginate,
  PulseStreamDataController.getPaginatedPulseStreamData
);

export default router;
