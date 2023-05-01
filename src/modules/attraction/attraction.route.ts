import express from "express";
import commonMiddleware from "../common/common.middleware";
import AttractionController from "./attraction.controller";

const router = express.Router();

router.post(
  "/",
  commonMiddleware.uploader.array("files", 10),
  AttractionController.createAttraction
);

export default router;
