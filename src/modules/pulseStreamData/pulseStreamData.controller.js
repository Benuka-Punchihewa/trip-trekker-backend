import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import AttractionService from "../attraction/attraction.service.js";
import NotFoundError from "../error/error.classes/NotFoundError.js";
import BadRequestError from "../error/error.classes/BadRequestError.js";
import PulseStreamData from "./pulseStreamData.model.js";
import PulseStreamDataService from "./pulseStreamData.service.js";
import PulseStreamDataUtil from "./pulseStreamData.util.js";
import CommonService from "../common/common.service.js";
import ForbidderError from "../error/error.classes/ForbiddenError.js";
import constants from "../../constants.js";

const createPulseRecord = async (req, res) => {
  const { attractionId } = req.params;
  const { strigifiedBody } = req.body;
  const auth = req.body.auth;

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

  // validate attraction
  const dbAttraction = await AttractionService.findById(attractionId);
  if (!dbAttraction) throw new NotFoundError("Attraction not found!");

  // create pulse record
  const pulseStreamData = new PulseStreamData({
    attraction: {
      _id: dbAttraction._id,
    },
    user: {
      _id: auth.user._id,
      name: auth.user.name,
    },
    ...parsedBody,
  });
  const dbPulseStreamData = await PulseStreamDataService.save(pulseStreamData);

  // upload image
  const path = PulseStreamDataUtil.getFirebasePathForPulseRecordImageUploads(
    dbAttraction._id.toString(),
    dbPulseStreamData._id.toString()
  );

  // upload image to firebase
  await CommonService.uploadToFirebase(file, path);

  const firebaseFile = {
    mimeType: file.mimetype,
    firebaseStorageRef: path,
  };

  // set image
  dbPulseStreamData.image = firebaseFile;
  const dbUpdatedPulseStreamData = await PulseStreamDataService.save(
    dbPulseStreamData
  );

  return res.status(StatusCodes.CREATED).json(dbUpdatedPulseStreamData);
};

const updatePulseStreamData = async (req, res) => {
  const { pulseStreamDataId } = req.params;
  const auth = req.body.auth;
  const { strigifiedBody } = req.body;

  // validate pulse stream record
  const dbPulseStreamData = await PulseStreamDataService.findById(
    pulseStreamDataId
  );
  if (!dbPulseStreamData)
    throw new NotFoundError("Pulse stream data record not found!");

  if (
    dbPulseStreamData.user._id.toString() !== auth.user._id.toString() ||
    auth.user.type === constants.USER_TYPES.ADMIN
  )
    throw new ForbidderError("You're not authorized to access this resource!");

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

  // update image
  if (req.file) {
    const path = dbPulseStreamData.image.firebaseStorageRef;
    // upload image to firebase
    await CommonService.uploadToFirebase(file, path);

    const firebaseFile = {
      mimeType: file.mimetype,
      firebaseStorageRef: path,
    };

    dbPulseStreamData.image = firebaseFile;
  }

  // update image
  if (parsedBody.tag) dbPulseStreamData.tag = parsedBody.tag;
  if (parsedBody.description)
    dbPulseStreamData.description = parsedBody.description;

  // save updates
  const dbUpdatedPulseStreamData = await PulseStreamDataService.save(
    dbPulseStreamData
  );

  return res.status(StatusCodes.OK).json(dbUpdatedPulseStreamData);
};

const deletePulseStreamData = async (req, res) => {
  const { pulseStreamDataId } = req.params;
  const auth = req.body.auth;

  // validate pulse stream record
  const dbPulseStreamData = await PulseStreamDataService.findById(
    pulseStreamDataId
  );
  if (!dbPulseStreamData)
    throw new NotFoundError("Pulse stream data record not found!");
  if (
    dbPulseStreamData.user._id.toString() !== auth.user._id.toString() ||
    auth.user.type !== constants.USER_TYPES.ADMIN
  )
    throw new ForbidderError("You're not authorized to access this resource!");

  await PulseStreamDataService.deleteById(dbPulseStreamData._id);

  return res.status(StatusCodes.OK).json(dbPulseStreamData);
};

const getPaginatedPulseStreamData = async (req, res) => {
  const pageable = req.body.pageable;
  const { attractionId } = req.params;

  // validate attraction
  const dbAttraction = await AttractionService.findById(attractionId);
  if (!dbAttraction) throw new NotFoundError("Attraction not found!");

  const result = await PulseStreamDataService.findPulseStreamDataPaginated(
    dbAttraction._id,
    pageable
  );

  return res.status(StatusCodes.OK).json(result);
};
export default {
  createPulseRecord,
  updatePulseStreamData,
  getPaginatedPulseStreamData,
  deletePulseStreamData,
};
