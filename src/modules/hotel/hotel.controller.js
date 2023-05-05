import { StatusCodes } from "http-status-codes";
import BadRequestError from "../error/error.classes/BadRequestError.js";
import HotelService from './hotel.service.js';
import Hotel from "./hotel.model.js";
import CommonService from "../common/common.service.js";
import HotelUtill from './hotel.util.js';
import NotFoundError from "../error/error.classes/NotFoundError.js";

const createHotel = async (req, res) => {
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

  // create Hotel
  const hotel = new Hotel(parsedBody);
  const dbHotel = await HotelService.save(hotel);

  // upload files to firebase
  const promises = [];
  const files = req.files;
  for (const file of files) {
    if (!file) continue;

    const path = HotelUtill.getFirebasePathForAttractionImageUploads(
      dbHotel._id.toString()
    );

    // upload image to firebase
    promises.push(CommonService.uploadToFirebase(file, path));

    const firebaseFile = {
      mimeType: file.mimetype,
      firebaseStorageRef: path,
    };

    // add image to attraction doc
    dbHotel.images.push(firebaseFile);
  }

  // resolve firebase upload promises
  await Promise.all(promises);
  const updatedHotel = await HotelService.save(dbHotel);

  return res.status(StatusCodes.CREATED).json(updatedHotel);
};

const getPaginatedHotels = async (req, res) => {
  const pageable = req.body.pageable;
  const { keyword } = req.query;

  const result = await HotelService.findPaginatedHotels(
    keyword,
    pageable
  );

  return res.status(StatusCodes.OK).json(result);
};

const getById = async (req, res) => {
  const { hotelId } = req.params;

  const dbHotel = await HotelService.findById(hotelId);
  if (!dbHotel) throw new NotFoundError("Hotel not found!");

  return res.status(StatusCodes.OK).json(dbHotel);
};

export default { createHotel, getPaginatedHotels, getById };
