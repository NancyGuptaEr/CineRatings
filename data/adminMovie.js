import { checkStr, checkDate, checkName } from "../helper.js";
import { movies } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const getMovie = async (movieId) => {
  const id = checkStr(movieId, "movieId");
  if (!ObjectId.isValid(id)) throw "the movieId is not valid!";
  const moviesCollection = await movies();
  const movieInfo = await moviesCollection.findOne({
    _id: new ObjectId(id),
  });
  if (!movieInfo) throw "the movie with this id does not exist";
  movieInfo._id = movieInfo._id.toString();
  return movieInfo;
};

export const ifMovieExist = async (title, releaseDate) => {
  const moviesCollection = await movies();
  const ifExist = await moviesCollection.find({ title, releaseDate }).toArray();
  if (ifExist.length !== 0) throw "the movie already exists";
  return ifExist;
};

export const ifMovieExist2Other = async (title, releaseDate, id) => {
  const moviesCollections = await movies();
  const ifExist = await moviesCollections
    .find({
      _id: { $ne: new ObjectId(id) },
      title: title,
      releaseDate: releaseDate,
    })
    .toArray();
  if (ifExist.length !== 0) throw "the same movie already exists";
  return ifExist;
};

export const getAll = async () => {
  const moviesCollection = await movies();
  const allObjIdMovies = await moviesCollection.find().toArray();
  const allMovies = allObjIdMovies
    .map((movie) => {
      if (!movie._id) {
        console.log("Missing _id", movie);
        return null;
      }
      return {
        _id: movie._id.toString(),
        movieName: movie.title,
        thumbnailUrl: movie.thumbnail,
        director: movie.artists.director,
        actors: movie.artists.actors,
        genre: movie.genre,
        releaseDate: movie.releaseDate,
        overall_rating: movie.overall_rating,
        contentRating: movie.contentRating,
      };
    })
    .filter((e) => e);
  return allMovies;
};

export const addNewMovie = async (
  title,
  genre,
  releaseDate,
  director,
  actors,
  writer,
  producer,
  contentRating,
  thumbnail
) => {
  title = checkStr(title, "title");
  if (!Array.isArray(genre)) throw "the type of genre must be array";
  releaseDate = checkDate(releaseDate, "releaseDate");
  director = checkName(director, "director");
  if (!Array.isArray(actors)) throw "the type of actors must be array";
  actors = actors.map((eachName) => {
    eachName = checkName(eachName, eachName);
    return eachName;
  });
  if (writer !== "") writer = checkName(writer, "writer");
  producer = checkName(producer, "producer");
  const allContentRatings = ["G", "PG", "PG-13", "R", "NC-17"];
  if (!allContentRatings.includes(contentRating))
    throw "contentRating is not valid";
  if (
    !thumbnail.match(
      /^\/uploads\/[0-9]{13}-[a-zA-Z_0-9]{0,20}\.(jpg|bmp|png)$/g
    )
  )
    throw "the format of thumbnail is not right";
  const artists = {
    director: [director],
    actors,
    ...(writer !== "" && { writer: [writer] }),
    producer: [producer],
  };
  const newMovie = {
    title,
    genre,
    releaseDate,
    artists,
    contentRating,
    reviews: [],
    thumbnail,
    overall_rating: "0",
  };
  const moviesCollection = await movies();
  const insertInfo = await moviesCollection.insertOne(newMovie);
  if (insertInfo.acknowledged !== true) throw "create new movies failed";
  const movie = await getMovie(insertInfo.insertedId.toString());
  return movie;
};

// const MovieInfo = await addNewMovie('Top Gun', ['Action'], '12/23/1986','Tom Cruise', ['Tom Cruise'], 'Tom Cruise','Taam Cruuj','G', '/uploads/1234567890123-filename.jpg');
// const movieInfo1 = await addNewMovie('The Shawshank Redemption', ['Drama'], '09/23/1994', 'Frank Darabont', ['Tim Robbins', 'Morgan Freeman'], 'Stephen King', 'Niki Marvin', 'R', '/uploads/1234567890123-shawshank.jpg');
// const movieInfo2 = await addNewMovie('Inception', ['SciFi'], '07/16/2010', 'Christopher Nolan', ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'], 'Christopher Nolan', 'Emma Thomas', 'PG-13', '/uploads/1234567890124-inception.jpg');
// const movieInfo3 = await addNewMovie('Forrest Gump', ['Drama'], '07/06/1994', 'Robert Zemeckis', ['Tom Hanks', 'Robin Wright'], 'Winston Groom', 'Wendy Finerman', 'PG-13', '/uploads/1234567890125-forrestgump.jpg');
// const movieInfo4 = await addNewMovie('Pulp Fiction', ['Crime'], '10/14/1994', 'Quentin Tarantino', ['John Travolta', 'Uma Thurman'], 'Quentin Tarantino', 'Lawrence Bender', 'R', '/uploads/1234567890126-pulpfiction.jpg');
// const movieInfo5 = await addNewMovie('The Dark Knight', ['Action'], '07/18/2008', 'Christopher Nolan', ['Christian Bale', 'Heath Ledger'], 'Jonathan Nolan', 'Christopher Nolan', 'PG-13', '/uploads/1234567890127-darkknight.jpg');

// console.log(MovieInfo);
// console.log(movieInfo1);
// console.log(movieInfo2);
// console.log(movieInfo3);
// console.log(movieInfo4);
// console.log(movieInfo5);

export const remove = async (movieId) => {
  const id = checkStr(movieId, "movieId");
  if (!ObjectId.isValid(id)) throw "the movieId is not valid";
  const moviesCollection = await movies();
  const theMovie = await getMovie(id);
  if (!theMovie) throw "the movie with this id does not exist";
  const deleteInfo = await moviesCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });
  if (!deleteInfo) throw "delete failed";
  return { movieName: theMovie.title, deleted: true };
};

export const update = async (
  movieId,
  title,
  genre,
  releaseDate,
  artists,
  contentRating,
  thumbnail
) => {
  const id = checkStr(movieId, "movieId");
  title = checkStr(title, "title");
  if (!Array.isArray(genre)) throw "the type of array must be array";
  releaseDate = checkDate(releaseDate, "releaseDate");
  if (typeof artists !== "object" || Array.isArray(artists))
    throw "the type of artists must be object";
  const allContentRatings = ["G", "PG", "PG-13", "R", "NC-17"];
  if (!allContentRatings.includes(contentRating))
    throw "contentRating is not valid";
  const moviesCollection = await movies();
  const targetMovie = await moviesCollection.findOne({ _id: new ObjectId(id) });
  if (!targetMovie) throw "the movie does not exist";
  const updateInfo = await moviesCollection.findOneAndUpdate(
    {
      _id: new ObjectId(id),
    },
    { $set: { title, genre, releaseDate, artists, contentRating, thumbnail } },
    { returnDocument: "after" }
  );
  if (!updateInfo) throw "update failed";
  return updateInfo;
};
