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

router.patch(
  "/:portfolioId",
  CommonMiddleware.uploader.single("file"),
  AuthMiddleware.authorize,
  AuthMiddleware.authorizeByRoles([constants.USER_TYPES.TOUR_GUIDE]),
  PortfolioController.updatePortfolioRecord
);

//get paginated portfolios
router.get(
  "/tour-guides/:userId",
  CommonMiddleware.paginate,
  PortfolioController.getPaginatedPortfolios
);

router.delete(
  "/:portfolioId",
  AuthMiddleware.authorize,
  AuthMiddleware.authorizeByRoles([constants.USER_TYPES.TOUR_GUIDE]),
  PortfolioController.deletePortfolio
);

export default router;
