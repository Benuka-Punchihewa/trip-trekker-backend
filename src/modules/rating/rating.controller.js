import { StatusCodes } from "http-status-codes";
import AttractionService from "../attraction/attraction.service.js";
import NotFoundError from "../error/error.classes/NotFoundError.js";
import Rating from "./rating.model.js";
import constants from "../../constants.js";
import RatingService from "./rating.service.js";

const rateAttraction = async (req, res) => {
  const { attractionId } = req.params;
  const { rating, review } = req.body;
  const auth = req.body.auth;

  const dbAttraction = await AttractionService.findById(attractionId);
  if (!dbAttraction) throw new NotFoundError("Attraction not found!");

  const ratingDoc = new Rating({
    ratee: {
      type: constants.RATINGS.RATEES.ATTRACTION,
      attraction: {
        _id: dbAttraction._id,
      },
    },
    rater: {
      user: {
        _id: auth.user._id,
        name: auth.user.name,
      },
    },
    rating,
    review,
  });

  const dbRating = await RatingService.save(ratingDoc);

  return res.status(StatusCodes.CREATED).json(dbRating);
};

const updateRating = async (req, res) => {
  const { ratingId } = req.params;
  const { review, rating } = req.body;

  const dbRating = await RatingService.findById(ratingId);
  if (!dbRating) throw new NotFoundError("Rating not found!");

  if (review) dbRating.review = review;
  if (rating) dbRating.rating = rating;

  const dbUpdatedRating = await RatingService.save(dbRating);

  return res.status(StatusCodes.OK).json(dbUpdatedRating);
};

const deleteRating = async (req, res) => {
  const { ratingId } = req.params;

  const dbRating = await RatingService.findByIdAndDelete(ratingId);
  if (!dbRating) throw new NotFoundError("Rating not found!");

  return res.status(StatusCodes.OK).json(dbRating);
};

const getPaginatedAttractionRatings = async (req, res) => {
  const { attractionId } = req.params;
  const pageable = req.body.pageable;

  const dbAttraction = await AttractionService.findById(attractionId);
  if (!dbAttraction) throw new NotFoundError("Attraction not found!");

  const result = await RatingService.findPaginatedRatings(
    {
      type: constants.RATINGS.RATEES.ATTRACTION,
      attractionId: dbAttraction._id,
    },
    pageable
  );

  return res.status(StatusCodes.OK).json(result);
};

export default {
  rateAttraction,
  updateRating,
  deleteRating,
  getPaginatedAttractionRatings,
};
