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

    const path = HotelUtill.getFirebasePathForHotelImageUploads(
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

const updateHotel = async (req, res) => {
  const { hotelId } = req.params;
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

  // find the hotel
  const hotel = await HotelService.findById(hotelId);
  if (!hotel) throw new NotFoundError("Hotel not found!");

  // update the hotel
  Object.assign(hotel, parsedBody);
  const updatedHotel = await HotelService.save(hotel);

  // upload files to firebase
  // const promises = [];
  // const files = req.files;
  // for (const file of files) {
  //   if (!file) continue;

  //   const path = HotelUtill.getFirebasePathForHotelImageUploads(
  //     updatedHotel._id.toString()
  //   );

  //   // upload image to firebase
  //   promises.push(CommonService.uploadToFirebase(file, path));

  //   const firebaseFile = {
  //     mimeType: file.mimetype,
  //     firebaseStorageRef: path,
  //   };

  //   // add image to attraction doc
  //   updatedHotel.images.push(firebaseFile);
  // }

  // // resolve firebase upload promises
  // await Promise.all(promises);
  const savedHotel = await HotelService.save(updatedHotel);

  return res.status(StatusCodes.OK).json(savedHotel);
};

const deleteHotel = async (req, res) => {
  const { hotelId } = req.params;

  // find the hotel
  const hotel = await HotelService.findById(hotelId);
  if (!hotel) throw new NotFoundError("Hotel not found!");

  // delete the hotel
  await HotelService.deleteById(hotelId);

  const path = HotelUtill.getFirebaseRootPathForHotelImageUploads(hotelId);
  await CommonService.deleteFromFirebase(path)
 
  return res.status(StatusCodes.OK).send();
};

export default { createHotel, getPaginatedHotels, getById ,updateHotel,deleteHotel};

