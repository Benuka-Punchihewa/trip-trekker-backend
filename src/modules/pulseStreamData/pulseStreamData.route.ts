import express from "express";
import commonMiddleware from "../common/common.middleware";
import PulseStreamDataController from "./pulseStreamData.controller";
import AuthMiddleware from "../auth/auth.middleware";
import constants from "../../constants";

const router = express.Router();

router.post(
  "/attractions/:attractionId",
  commonMiddleware.uploader.single("file"),
  AuthMiddleware.authorize,
  AuthMiddleware.authorizeByRoles([
    constants.USER_TYPES.ADMIN,
    constants.USER_TYPES.TOUR_GUIDE,
  ]),
  PulseStreamDataController.createPulseRecord
);

export default router;
