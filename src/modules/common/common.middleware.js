import multer from "multer";
import BadRequestError from "../error/error.classes/BadRequestError.js";

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit files size to 5 MB
  },
});

const paginate = async (req, res, next) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 8;
  let orderBy = req.query.orderBy || "desc";

  page = parseInt(page);
  if (!page) throw new BadRequestError("Page Number Should be a Number!");

  limit = parseInt(limit);
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
