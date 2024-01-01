import { movies } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { checkStr } from "../helper.js";
export const createReviews = async (
  movieId,
  userId,
  text,
  rating,
  ts,
  flaggedTimes
) => {
  const moviesCollection = await movies();
  const review = await moviesCollection.findOneAndUpdate(
    { _id: new ObjectId(movieId) },
    {
      $push: {
        reviews: {
          _id: new ObjectId(),
          userId,
          review,
          rating,
          ts,
          flaggedTimes,
        },
      },
    },
    { returnDocument: "after" }
  );
  if (review) return "succeed";
  return "failed";
};

export const getMoviesByFlaggedTimes = async () => {
  const moviesCollection = await movies();
  const allMovies = await moviesCollection.find().toArray();
  const flaggedReviews = allMovies.reduce((acc, movie) => {
    const reviewsWithHighFlagTimes = movie.reviews.filter(
      (review) => review.flaggedTimes > 10
    );
    const reviewsWithTitles = reviewsWithHighFlagTimes.map((review) => ({
      ...review,
      title: movie.title,
    }));
    acc.push(...reviewsWithTitles);
    return acc;
  }, []);
  console.log(`flaggedReviews db file getmovisbyflaggedtimes printing contents of return flaggedReviews: `);
  console.log(flaggedReviews);
  return flaggedReviews;
};

export const removeByFlaggedTimes = async (reviewId) => {
  console.log(`entered removedbyflagged time db function`)
  reviewId = checkStr(reviewId, "reviewId");
  // if (!ObjectId.isValid(reviewId)) throw "the reviewId is not valid";
  console.log(`contents in reviewId: ${reviewId}`);
  const moviesCollection = await movies();
  const targetReview = await moviesCollection.findOne({
    reviews: { $elemMatch: { userId: reviewId } },
  });
  console.log(`target revieww....`);
  console.log(targetReview);
  if (!targetReview) throw "the review does not exist";
  const deleteInfo = await moviesCollection.findOneAndUpdate(
    {_id: new ObjectId(targetReview._id) },
    { $pull: { reviews: { userId: reviewId } } },
    { returnDocument: "after" }
  );
  if (!deleteInfo) throw "deleting failed";
  return deleteInfo;
};

