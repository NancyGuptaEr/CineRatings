import { Router } from "express";
const router = Router();
import * as helpers from "../helper.js";
import * as searchmovies from "../data/search_movie.js"
import { movies } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import xss from 'xss';


router.route('/').post(async(req, res)  =>  {
    // console.log("i have entered routes to delete a review");
    // console.log(`userID is ${req.session.user.emailAddress}`);
    // console.log(req.body);
    //write code here to submit a review
    try {
    let userId = xss(req.session.user.emailAddress);
    // console.log(`userId: ${userId}`);
    // console.log(`movie id: ${req.body.movieId}`);

    let movieId = xss(req.body.movieId);
    // console.log(`movie id is ${movieId}`);
    
        userId = helpers.isValidEmail(userId);
        console.log(`user id is ${userId} after checking`);
        movieId = helpers.checkId(movieId);
        console.log(`movie id is ${movieId}`);
        if(!ObjectId.isValid(movieId)){
            throw `movieId is not proper ObjectID`;
        }
        console.log("i have done all input validation in routes");
        
        const movie = await searchmovies.deleteReview(userId, movieId);
        console.log(`_________________________________________`)
        console.log(movie);
    
    res.redirect(`/movies/${movieId}`);
    }
    catch(e)   {
        res.status(400).render("error", {errors: e, title: "Error Occured!"});
    }
});

export default router;