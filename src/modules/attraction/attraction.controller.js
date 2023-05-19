import { StatusCodes } from "http-status-codes";
import BadRequestError from "../error/error.classes/BadRequestError.js";
import AttractionService from "./attraction.service.js";
import Attraction from "./attraction.model.js";
import CommonService from "../common/common.service.js";
import AttractionUtil from "./attraction.util.js";
import NotFoundError from "../error/error.classes/NotFoundError.js";

const createAttraction = async (req, res) => {
  const { strigifiedBody } = req.body;

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

  // create attraction
  const attraction = new Attraction(parsedBody);
  const dbAttraction = await AttractionService.save(attraction);

  // upload files to firebase
  const promises = [];
  const files = req.files;
  for (const file of files) {
    if (!file) continue;

    const path = AttractionUtil.getFirebasePathForAttractionImageUploads(
      dbAttraction._id.toString()
    );

    // upload image to firebase
    promises.push(CommonService.uploadToFirebase(file, path));

    const firebaseFile = {
      mimeType: file.mimetype,
      firebaseStorageRef: path,
    };

    // add image to attraction doc
    dbAttraction.images.push(firebaseFile);
  }

  // resolve firebase upload promises
  await Promise.all(promises);
  const updatedAttraction = await AttractionService.save(dbAttraction);

  return res.status(StatusCodes.CREATED).json(updatedAttraction);
};

const getPaginatedAttractions = async (req, res) => {
  const pageable = req.body.pageable;
  const { keyword } = req.query;

  const result = await AttractionService.findPaginatedAttractions(
    keyword,
    pageable
  );

  return res.status(StatusCodes.OK).json(result);
};

const getById = async (req, res) => {
  const { attractionId } = req.params;

  const dbAttraction = await AttractionService.findById(attractionId);
  if (!dbAttraction) throw new NotFoundError("Attraction not found!");

  return res.status(StatusCodes.OK).json(dbAttraction);
};

const getNearbyAttractions = async (req, res) => {
  const { lat, lng, limit } = req.query;

  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  const parsedLimit = parseInt(limit);

  if (!parsedLng)
    throw new BadRequestError("Longitude value is not passed or invalid!");
  if (!parsedLat)
    throw new BadRequestError("Latitude value is not passed or invalid!");

  const result = await AttractionService.findNearestAttractions(
    parsedLat,
    parsedLng,
    parsedLimit || 1
  );

  return res.status(StatusCodes.OK).json(result);
};

export default {
  createAttraction,
  getPaginatedAttractions,
  getById,
  getNearbyAttractions,
};
