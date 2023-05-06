import { StatusCodes } from "http-status-codes";
import BadRequestError from "../error/error.classes/BadRequestError.js";
import CommonService from "../common/common.service.js";
import guidePortfolioModel from "./guidePortfolio.model.js";
import guidePortfolioService from "./guidePortfolio.service.js";
import guidePortfolioUtil from "./guidePortfolio.util.js";
import UnAuthorizedError from "../error/error.classes/UnAuthorizedError.js";
import constants from "../../constants.js";
import NotFoundError from "../error/error.classes/NotFoundError.js";
import userService from "../user/user.service.js";

const createPortfolioRecord = async (req, res) => {
  const auth = req.body.auth;
  const user = auth.user;
  const { strigifiedBody } = req.body;

  const file = req.file;
  if (!file) throw new BadRequestError("An image is required!");

  // parse strigifiedBody
  let parsedBody;
  if (strigifiedBody) {
    try {
      parsedBody = JSON.parse(strigifiedBody);
    } catch (err) {
      throw new BadRequestError("Invalid JSON body!");
    }
  }
  if (!parsedBody) throw new BadRequestError("Request body is undefined!");

  // check if user is a tour guide
  if (user.type !== constants.USER_TYPES.TOUR_GUIDE) {
    throw new UnAuthorizedError("Only tour guides can create portfolio!");
  }

  const portfolioData = new guidePortfolioModel({
    user: {
      _id: user._id,
    },
    ...parsedBody,
  });
  const dbPortfolioData = await guidePortfolioService.save(portfolioData);

  // upload image
  const path = guidePortfolioUtil.getFirebasePathForPortfolioImageUploads(
    user._id.toString(),
    dbPortfolioData._id.toString()
  );

  // upload image to firebase
  await CommonService.uploadToFirebase(file, path);

  const firebaseFile = {
    mimeType: file.mimetype,
    firebaseStorageRef: path,
  };

  // set image
  dbPortfolioData.image = firebaseFile;
  const dbUpdatedPortfolioData = await guidePortfolioService.save(
    dbPortfolioData
  );

  return res.status(StatusCodes.CREATED).json(dbUpdatedPortfolioData);
};

const updatePortfolioRecord = async (req, res) => {
  const auth = req.body.auth;
  const user = auth.user;
  const { strigifiedBody } = req.body;

  const file = req.file;

  // parse strigifiedBody
  let parsedBody;
  if (strigifiedBody) {
    try {
      parsedBody = JSON.parse(strigifiedBody);
    } catch (err) {
      throw new BadRequestError("Invalid JSON body!");
    }
  }
  if (!parsedBody) throw new BadRequestError("Request body is undefined!");

  // get portfolio id from request params
  const { portfolioId } = req.params;

  // check if user is authorized to update portfolio record
  const portfolioData = await guidePortfolioService.findById(portfolioId);
  if (!portfolioData) throw new NotFoundError("Portfolio not found!");

  if (user._id.toString() !== portfolioData.user._id.toString()) {
    throw new UnAuthorizedError(
      "You are not authorized to update this portfolio!"
    );
  }

  // update portfolio data
  Object.assign(portfolioData, parsedBody);
  const dbPortfolioData = await guidePortfolioService.save(portfolioData);

  // upload image if provided
  if (file) {
    const path = guidePortfolioUtil.getFirebasePathForPortfolioImageUploads(
      user._id.toString(),
      dbPortfolioData._id.toString()
    );

    // upload image to firebase
    await CommonService.uploadToFirebase(file, path);

    const firebaseFile = {
      mimeType: file.mimetype,
      firebaseStorageRef: path,
    };

    // set image
    dbPortfolioData.image = firebaseFile;
    await guidePortfolioService.save(dbPortfolioData);
  }

  return res.status(StatusCodes.OK).json(dbPortfolioData);
};

const deletePortfolio = async (req, res) => {
  const auth = req.body.auth;

  const { portfolioId } = req.params;

  const portfolioData = await guidePortfolioService.findById(portfolioId);
  if (!portfolioData) throw new NotFoundError("Portfolio not found!");

  // Check if the user is authorized to delete the portfolio
  if (portfolioData.user._id.toString() !== auth.user._id.toString()) {
    throw new UnAuthorizedError(
      "You are not authorized to delete this portfolio!"
    );
  }

  // Delete the portfolio
  await guidePortfolioService.deleteOne({ _id: portfolioId });
  return res.status(StatusCodes.OK).json();
};

const getPaginatedPortfolios = async (req, res) => {
  const pageable = req.body.pageable;

  const { userId } = req.params;
  const dbUser = await userService.findById(userId);
  if (!dbUser) throw new NotFoundError("User not found");
  const result = await guidePortfolioService.findPaginatedPortfolios(
    pageable,
    dbUser._id
  );

  return res.status(StatusCodes.OK).json(result);
};

export default {
  createPortfolioRecord,
  updatePortfolioRecord,
  deletePortfolio,
  getPaginatedPortfolios,
};
