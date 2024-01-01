import { Router } from "express";
const router = Router();
import * as helpers from "../helper.js";
import * as searchmovies from "../data/search_movie.js"
import { movies } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import xss from 'xss';
import { moviesSearch } from "../data/index.js";


router.route('/').post(async(req, res)  =>  {
    
    try {
        console.log("i have entered routes to flag a review");
        console.log(`userID is ${req.session.user._id}`);
        console.log(req.body);
        //write code here to submit a review
        let userId = xss(req.body.EmailAddressOfReview);
        let flagUserId = xss(req.session.user._id);
        console.log(`flaguserId: ${flagUserId}`);
        console.log(`userId: ${userId}`);
        console.log(`movie id: ${req.body.movieId}`);

        let movieId = xss(req.body.movieId);
        console.log(`movie id is ${movieId}`);
        userId = helpers.isValidEmail(userId);
        console.log(`user id is ${userId} after checking`);
        movieId = helpers.checkId(movieId);
        console.log(`movie id is ${movieId}`);
        if(!ObjectId.isValid(movieId)){
            throw `movieId is not proper ObjectID`;
        }
        console.log("i have done all input validation in routes");
        
        const flagAreivew = await moviesSearch.flagTheReview(movieId,userId,flagUserId);
        if(!flagAreivew){
            throw `There was an error flagging the reivew`;
        }
    
    res.redirect(`/movies/${movieId}`);
    }
    catch(e)   {
        console.log(`ERROR CAUGHT IN FLAGREVIEW ROUTES WITH DESCRIPTRION: ${e}`);
        if(e === '500'){
            res.status(500);
        }
        else{
            res.status(400);
        }
    }
});

export default router;