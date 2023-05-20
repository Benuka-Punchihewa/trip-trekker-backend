import { v4 as uuidv4 } from "uuid";

const getFirebasePathForHotelImageUploads = (hotelId) => {
  const imageId = uuidv4();
  return `hotels/${hotelId}/${imageId}`;
};

const getFirebaseRootPathForHotelImageUploads = (hotelId) => {
  return `hotels/${hotelId}`;
}; 

const getFirebasePathForHotelPromotionUploads = (hotelId) => {
  const imageId = uuidv4();
  return `hotels/${hotelId}/promotions/${imageId}`;
};

const getFirebaseRootPathForHotelPromotionImageUploads = (hotelId) => {
  return `hotels/${hotelId}/promotions`;
}; 

export default { getFirebasePathForHotelImageUploads,getFirebaseRootPathForHotelImageUploads,getFirebasePathForHotelPromotionUploads,getFirebaseRootPathForHotelPromotionImageUploads };
