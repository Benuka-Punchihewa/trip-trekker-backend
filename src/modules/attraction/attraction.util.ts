import { v4 as uuidv4 } from "uuid";

const getFirebasePathForAttractionImageUploads = (attractionId: string) => {
  const imageId = uuidv4();
  return `attractions/${attractionId}/${imageId}`;
};

export default { getFirebasePathForAttractionImageUploads };
