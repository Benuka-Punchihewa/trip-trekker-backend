import express from "express";
import CommonMiddleware from "../common/common.middleware.js";
import userController from "./user.controller.js";
import constants from "../../constants.js";
import AuthMiddleware from "../auth/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  CommonMiddleware.paginate,
  userController.getPaginatedTourGuide
);

router.get(
  "/admin",
  AuthMiddleware.authorize,
  AuthMiddleware.authorizeByRoles([constants.USER_TYPES.ADMIN]),
  CommonMiddleware.paginate,
  userController.getPaginatedTourGuide
);

router.get("/:userId", userController.findById);

router.patch(
  "/:userId",
  AuthMiddleware.authorize,
  AuthMiddleware.authorizeByRoles([constants.USER_TYPES.ADMIN]),
  userController.updateUserIsVerified
);

export default router;
