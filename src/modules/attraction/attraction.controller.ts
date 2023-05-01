import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../error/error.classes/BadRequestError";
import { ICreateAttractionStrigifiedBody } from "./attraction.interface";
import AttractionService from "./attraction.service";
import Attraction from "./attraction.model";
import CommonService from "../common/common.service";
import AttractionUtil from "./attraction.util";
import { IFirebaseFile } from "../common/common.interface";

const createAttraction = async (req: Request, res: Response) => {
  const { strigifiedBody } = req.body;

  // parse strigifiedBody
  let parsedBody;
  if (strigifiedBody) {
    try {
      parsedBody = JSON.parse(
        strigifiedBody
      ) as ICreateAttractionStrigifiedBody;
    } catch (err) {
      throw new BadRequestError("Invalid JSON body!");
    }
  }
  if (!parsedBody) throw new BadRequestError("Request body is undefined!");

  // create attraction
  const attraction = new Attraction(parsedBody);
  const dbAttraction = await AttractionService.save(attraction);

  // upload files to firebase
  const promises: Array<Promise<any>> = [];
  const files = req.files as Array<Express.Multer.File>;
  for (const file of files) {
    if (!file) continue;

    const path = AttractionUtil.getFirebasePathForAttractionImageUploads(
      dbAttraction._id.toString()
    );

    // upload image to firebase
    promises.push(CommonService.uploadToFirebase(file, path));

    const firebaseFile: IFirebaseFile = {
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

export default { createAttraction };
