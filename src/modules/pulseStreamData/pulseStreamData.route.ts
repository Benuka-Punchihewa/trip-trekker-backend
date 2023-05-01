import express from "express";
import commonMiddleware from "../common/common.middleware";
import PulseStreamDataController from "./pulseStreamData.controller";

const router = express.Router();

router.post(
  "/attractions/:attractionId",
  commonMiddleware.uploader.single("file"),
  PulseStreamDataController.createPulseRecord
);

export default router;
