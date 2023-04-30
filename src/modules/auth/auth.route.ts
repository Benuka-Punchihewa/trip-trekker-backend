import express from "express";
import AuthController from "./auth.controller";
import commonMiddleware from "../common/common.middleware";

const router = express.Router();

router.post(
  "/sign-up",
  commonMiddleware.uploader.single("file"),
  AuthController.signUp
);

router.post("/sign-in", AuthController.signIn);

export default router;
