import express from "express";
import CommonMiddleware from "../common/common.middleware.js";
import AuthMiddleware from "../auth/auth.middleware.js";
import constants from "../../constants.js";
import PortfolioController from "./guidePortfolio.controller.js";

const router = express.Router();

router.post(
  "/",
  CommonMiddleware.uploader.single("file"),
  AuthMiddleware.authorize,
  AuthMiddleware.authorizeByRoles([constants.USER_TYPES.TOUR_GUIDE]),
  PortfolioController.createPortfolioRecord
);

export default router;
