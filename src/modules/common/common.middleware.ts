import multer from "multer";
import BadRequestError from "../error/error.classes/BadRequestError";
import { NextFunction, Request, Response } from "express";

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit files size to 5 MB
  },
});

const paginate = async (req: Request, res: Response, next: NextFunction) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 8;
  let orderBy = req.query.orderBy || "desc";

  page = parseInt(page as string);
  if (!page) throw new BadRequestError("Page Number Should be a Number!");

  limit = parseInt(limit as string);
  if (!limit) throw new BadRequestError("Page Limit Should be a Number!");

  if (orderBy != "asc" && orderBy != "desc" && orderBy != "") {
    throw new BadRequestError('Sorting Order Should be "asc" or "desc!"');
  }

  req.body.pageable = { page, limit, orderBy };

  next();
};

export default {
  uploader,
  paginate,
};
