import authRoutes from './auth_routes.js';
import { adminMoviesRouter } from "./admin.js";
import movieListsRouter from "./movie_listing_routes.js";
import moviesSearchRoute from "./movie_search.js";
import userRoutes from './user.js';
import watchListRoutes from './watchList_routes.js';
import deleteReviewRoute from './deleteReview.js';
import flagReviewRoute from './flaggedReview.js';

const constructorMethod = (app) => {
    app.use('/', authRoutes);
    app.use("/admin", adminMoviesRouter);
    app.use("/login", authRoutes);
    console.log(`about hit /home in index`);
    app.use("/home", movieListsRouter);
    app.use('/users', userRoutes);
    app.use("/movies",moviesSearchRoute);
    app.use('/watchlist', watchListRoutes);
    app.use("/deleteReview", deleteReviewRoute);
    app.use('/flagReview', flagReviewRoute);
    app.use('*', (req, res) => {

        res.status(404).send("No such route exist.");
    });
};
export default constructorMethod;