import express from "express";
import CommonMiddleware from "../common/common.middleware";
import AttractionController from "./attraction.controller";
import AuthMiddleware from "../auth/auth.middleware";
import constants from "../../constants";

const router = express.Router();

router.post(
  "/",
  CommonMiddleware.uploader.array("files", 10),
  AuthMiddleware.authorize,
  AuthMiddleware.authorizeByRoles([constants.USER_TYPES.ADMIN]),
  AttractionController.createAttraction
);

export default router;
