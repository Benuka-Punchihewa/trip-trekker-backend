import { StatusCodes } from "http-status-codes";
import BadRequestError from "../error/error.classes/BadRequestError.js";
import CommonService from "../common/common.service.js";
import guidePortfolioModel from "./guidePortfolio.model.js";
import guidePortfolioService from "./guidePortfolio.service.js";
import guidePortfolioUtil from "./guidePortfolio.util.js";
import UnAuthorizedError from "../error/error.classes/UnAuthorizedError.js";
import constants from "../../constants.js";

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

export default { createPortfolioRecord };
