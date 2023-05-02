import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import AttractionService from "../attraction/attraction.service.js";
import NotFoundError from "../error/error.classes/NotFoundError.js";
import BadRequestError from "../error/error.classes/BadRequestError.js";
import PulseStreamData from "./pulseStreamData.model.js";
import PulseStreamDataService from "./pulseStreamData.service.js";
import PulseStreamDataUtil from "./pulseStreamData.util.js";
import CommonService from "../common/common.service.js";

const createPulseRecord = async (req, res) => {
  const { attractionId } = req.params;
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

  // validate attraction
  const dbAttraction = await AttractionService.findById(attractionId);
  if (!dbAttraction) throw new NotFoundError("Attraction not found!");

  // create pulse record
  const pulseStreamData = new PulseStreamData({
    attraction: {
      _id: dbAttraction._id,
    },
    user: {
      _id: new mongoose.Types.ObjectId("644ee85b1964bc66120f5ef3"),
      name: "Benuka Punchihewa",
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

export default { createPulseRecord, getPaginatedPulseStreamData };
