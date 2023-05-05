import express from "express";
import CommonMiddleware from "../common/common.middleware.js";
import userController from "./user.controller.js";

const router = express.Router();

router.get(
  "/",
  CommonMiddleware.paginate,
  userController.getPaginatedTourGuide
);

export default router;
