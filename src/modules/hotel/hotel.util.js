import { v4 as uuidv4 } from "uuid";

const getFirebasePathForHotelImageUploads = (hotelId) => {
  const imageId = uuidv4();
  return `hotels/${hotelId}/${imageId}`;
};

const getFirebaseRootPathForHotelImageUploads = (hotelId) => {
  return `hotels/${hotelId}`;
}; 
export default { getFirebasePathForHotelImageUploads,getFirebaseRootPathForHotelImageUploads };
