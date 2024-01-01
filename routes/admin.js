//Place all admin routes here.
import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { ObjectId } from "mongodb";
import { checkDate, checkStr, checkName } from "../helper.js";
import { adminMovies } from "../data/index.js";
import {
  createReviews,
  getMoviesByFlaggedTimes,
  removeByFlaggedTimes,
} from "../data/flaggedReviews.js";
import { isAdminAuthenticated } from "../middleware.js";

import xss from "xss";

export const adminMoviesRouter = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

adminMoviesRouter.route("/").get(isAdminAuthenticated, async (req, res) => {
  try {
    const allMovies = await adminMovies.getAll();
    let  adminLoggedIn = true;
    return res.render("admin", { allMovies, adminLoggedIn, title: "My Admin Page" });
  } catch (e) {
    return res.json({ error: "there are no movies in database" });
  }
});

adminMoviesRouter
  .route("/addMovie")
  .get(isAdminAuthenticated, async (req, res) => {
    const allGenres = [
      "action",
      "adventure",
      "comedy",
      "drama",
      "fantasy",
      "horror",
      "musicals",
      "mystery",
      "romance",
      "science fiction",
      "sports",
      "thriller",
      "western",
    ];
    let adminLoggedIn = true;
    res.render("uploadMovie", { allGenres,adminLoggedIn, title: "My Admin Page" });
  })
  .post(isAdminAuthenticated, upload.single("image"), async (req, res) => {
    const data = req.body;
    let {
      title,
      genre,
      releaseDate,
      director,
      actors,
      writer,
      producer,
      contentRating,
    } = data;
    title = xss(title);
    releaseDate = xss(releaseDate);
    director = xss(director);
    actors = xss(actors);
    writer = xss(writer);
    producer = xss(producer);
    contentRating = xss(contentRating);
    if (Array.isArray(genre)) {
      genre = genre.map((item) => xss(item));
    }
    try {
      if (!data) throw "input is required";
      const thumbnail = req.file ? "/uploads/" + req.file.filename : "";
      title = checkStr(title, "title");
      if (!Array.isArray(genre)) throw "the type of genre must be array";
      releaseDate = checkDate(releaseDate, "releaseDate");
      director = checkName(director, "director");
      actors = checkStr(actors, "actors");
      actors = actors.split(",")?.map((eachName) => {
        eachName = checkName(eachName, eachName);
        return eachName;
      });
      if (!Array.isArray(actors)) throw "the type of genre must be array";
      if (writer !== "") writer = checkName(writer, "writer");
      producer = checkName(producer, "producer");
      const allContentRatings = ["G", "PG", "PG-13", "R", "NC-17"];
      if (!allContentRatings.includes(contentRating))
        throw "contentRating is not valid";
      const ifExist = await adminMovies.ifMovieExist(title, releaseDate);
      const newMovie = await adminMovies.addNewMovie(
        title,
        genre,
        releaseDate,
        director,
        actors,
        writer,
        producer,
        contentRating,
        thumbnail
      );
      return res.redirect("/admin");
    } catch (error) {
      return res.render("uploadMovie", { error });
    }
  });

adminMoviesRouter
  .route("/:movieId")
  .delete(isAdminAuthenticated, async (req, res) => {
    let id = xss(req.params.movieId);
    try {
      id = checkStr(id, "movieId");
      if (!ObjectId.isValid(id)) throw "the movieId is not valid";
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const targetMovie = await adminMovies.getMovie(id);
    } catch (e) {
      return res.status(404).json({ error: "movie not found" });
    }
    try {
      const targetMovie = await adminMovies.remove(id);
      return res.json({ message: "movie deleted successfully" });
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  });

adminMoviesRouter
  .route("/update/:movieId")
  .get(isAdminAuthenticated, async (req, res) => {
    let movieId = xss(req.params.movieId);
    try {
      movieId = checkStr(movieId, "movieId");
      if (!ObjectId.isValid(movieId)) throw "the movieId is not valid";
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const movie = await adminMovies.getMovie(movieId);
      movie.ratingOption = {
        G: movie.contentRating === "G",
        PG: movie.contentRating === "PG",
        PG13: movie.contentRating === "PG-13",
        R: movie.contentRating === "R",
        NC17: movie.contentRating === "NC-17",
      };
      const allGenres = [
        "action",
        "adventure",
        "comedy",
        "drama",
        "fantasy",
        "horror",
        "musicals",
        "mystery",
        "romance",
        "science fiction",
        "sports",
        "thriller",
        "western",
      ];
      const genresWithSelection = allGenres.map((genre) => {
        return { name: genre, selected: movie.genre.includes(genre) };
      });
      let  adminLoggedIn = true;
      res.render("updateMovie", { movie, genresWithSelection,  adminLoggedIn, title: "My Admin Page" });
    } catch (error) {
      res.status(404).send("Movie not found");
    }
  });

adminMoviesRouter.post(
  "/toUpdate/:movieId",
  upload.single("image"),
  isAdminAuthenticated,
  async (req, res) => {
    const movieId = xss(req.params.movieId);
    const data = req.body;
    let id;
    let {
      title,
      genre,
      releaseDate,
      director,
      actors,
      writer,
      producer,
      contentRating,
    } = data;
    title = xss(title);
    releaseDate = xss(releaseDate);
    director = xss(director);
    actors = xss(actors);
    writer = xss(writer);
    producer = xss(producer);
    contentRating = xss(contentRating);
    if (Array.isArray(genre)) {
      genre = genre.map((item) => xss(item));
    }
    try {
      id = checkStr(movieId, "movieId");
      if (!ObjectId.isValid(id)) throw "the movieId is not valid";
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const targetMovie = await adminMovies.getMovie(id);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
    try {
      if (!data) throw "input is required";
      let {
        title,
        genre,
        releaseDate,
        director,
        actors,
        writer,
        producer,
        contentRating,
      } = data;

      const thumbnail = req.file ? "/uploads/" + req.file.filename : "";
      title = checkStr(title, "title");
      if (!Array.isArray(genre)) throw "the type of array must be array";
      releaseDate = checkDate(releaseDate, "releaseDate");
      director = checkName(director, "director");
      if (writer !== "") writer = checkName(writer, "writer");
      producer = checkName(producer, "producer");
      actors = checkStr(actors, "actors");
      actors = actors.split(",")?.map((eachName) => {
        eachName = checkName(eachName, eachName);
        return eachName;
      });
      const artists = {
        director: [director],
        actors,
        producer: [producer],
        ...(writer !== undefined && { writer: [writer] }),
      };
      if (typeof artists !== "object" || Array.isArray(artists))
        throw "the type of artists must be object";
      const allContentRatings = ["G", "PG", "PG-13", "R", "NC-17"];
      if (!allContentRatings.includes(contentRating))
        throw "contentRating is not valid";
      const ifExist = await adminMovies.ifMovieExist2Other(
        title,
        releaseDate,
        id
      );
      const newMovie = await adminMovies.update(
        id,
        title,
        genre,
        releaseDate,
        artists,
        contentRating,
        thumbnail
      );
      if (newMovie) return res.redirect("/admin");
    } catch (e) {
      return res.render("adminError", { error: e, id });
    }
  }
);

adminMoviesRouter
  .route("/addReview/:movieId")
  .post(isAdminAuthenticated, async (req, res) => {
    const movieId = xss(req.params.movieId);
    const data = req.body;
    const { userId, text, rating, ts, flaggedTimes } = data;
    userId = xss(userId);
    text = xss(text);
    ts = xss(ts);
    flaggedTimes = xss(flaggedTimes);
    try {
      const review = await createReviews(
        movieId,
        userId,
        text,
        rating,
        ts,
        flaggedTimes
      );
      return res.status(200).json("succeed");
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  });

adminMoviesRouter
  .route("/flaggedReviews")
  .get(isAdminAuthenticated, async (req, res) => {
    try {
      const allFlaggedReviews = await getMoviesByFlaggedTimes();
      // console.log(`printing allflaggedreviews for rendering on webpage`);
      // console.log(allFlaggedReviews)
      let adminLoggedIn = true;
      return res.render("flaggedReviews", { allFlaggedReviews, adminLoggedIn, title: "My Admin Page" });
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  });

adminMoviesRouter
  .route("/flaggedReviews/:reviewId")
  .delete(isAdminAuthenticated, async (req, res) => {
    // console.log(`adminMoviesRouter/delete called from webpage`);
    // console.log(req.params);
    let reviewId = xss(req.params.reviewId);
    // console.log(`contnets in reviewId: ${reviewId}`);
    try {

      reviewId = checkStr(reviewId, "reviewId");
      // if (!ObjectId.isValid(reviewId)) throw "the reviewId is not valid";

    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      // console.log(`calling removebyflaggedtimes db function`)
      const deleteInfo = await removeByFlaggedTimes(reviewId);
      if (!deleteInfo) throw "deleting failed";
      return res.render("flaggedReviews", {title: "My Admin Page"});
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  });
