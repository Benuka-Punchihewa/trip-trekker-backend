import express from "express";
import AuthController from "./auth.controller.js";
import commonMiddleware from "../common/common.middleware.js";

const router = express.Router();

router.post(
  "/sign-up",
  commonMiddleware.uploader.single("file"),
  AuthController.signUp
);

router.post("/sign-in", AuthController.signIn);

export default router;
