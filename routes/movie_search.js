import { Router } from "express";
const router = Router();
import * as helpers from "../helper.js";
import * as searchMovies from '../data/search_movie.js';
import xss from 'xss';

import { movies } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

router.route('/').get(async (req, res)   =>  {
    console.log("now i will try to open the homepage");
    try {
        res.render("home", {title: "CineRatings: Ratings, Reviews, and Where to Watch the Best Movies"});
    }catch(e)   {
        res.status(400).render("error", {errors: e, title: "Error Occured!"});
    }
    })
    .post(async (req, res)  =>  {
        //console.log("i have entered the post routes");
        let isLoggedIn = false;
        if(req.session.user){
            isLoggedIn = true;
        }
        try {
        let movieName = xss(req.body.Search);
        //console.log(movieName);
        
        
            console.log(`movie name before validation is ${movieName}`);
            movieName = helpers.checkStr(movieName, "Movie Name");
            console.log(`movie name after validation is ${movieName}`);
        
            let searchedMovie = await searchMovies.searchMovies(movieName);
            console.log(`searched movie from database is`);
            console.log(searchedMovie);
    
            searchedMovie = searchedMovie.map(movie => {
                return  {
                    MovieId: movie._id,
                    Title: movie.title,
                    Genre: movie.genre,
                    Thumbnail: movie.thumbnail,
                    Rating: movie.overall_rating,
                    MPA: movie.contentRating
                };
            });
            
            
            if(searchedMovie.length === 0){
                res.render("searchpage", {MovieId: MovieId, title: "CineRatings: Ratings, Reviews, and Where to Watch the Best Movies", movies: searchedMovie, error: "No results found", isLoggedIn});
            }
            res.render("searchpage", {title: "CineRatings: Ratings, Reviews, and Where to Watch the Best Movies", movies: searchedMovie, isLoggedIn});
        }catch(e)   {
            res.status(400).render("searchpage", {title: "CineRatings: Ratings, Reviews, and Where to Watch the Best Movies",movies: [], error: e});
        }
        });

router.route('/:MovieId')
    .get(async (req, res)   =>  {
        console.log("now i have entered routes to fetch single movie data");
        //code here to get a particular movie by name
        
        try {
            req.params.movieName = helpers.checkId(req.params.MovieId);
            let isLoggedIn ;
            let currentUserId; 
            let showEditReviewSection = false;
            let CurrentUserRating;
            let CurrentUserReview;

            if(req.session.user){
                isLoggedIn = true;
                console.log(`REQ.SESSION.USER@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`)
                console.log(req.session.user);
                let emailAddress = req.session.user.emailAddress;
                console.log("i have done error checking in routes: emailAddressof useris: "+emailAddress);
                let movie = await searchMovies.getSingleMovies(req.params.MovieId);
            
                for (let i = 0; i < movie.reviews.length; i++){
                    if(movie.reviews[i].userId === emailAddress){
                        movie.reviews[i]['showEditReviewSection'] = true;
                        CurrentUserRating = movie.reviews[i].rating;
                        CurrentUserReview = movie.reviews[i].review;
                    }
                    else{
                        movie.reviews[i]['showEditReviewSection'] = false;
                    }
                }
                //////////////////// Add showEditReviewSection latest boolean value in every review by every user  ////////
                console.log(`movie info:###########################################`) 
                console.log(movie);
                res.render("individualMovie", {
                    _id: movie._id,
                    title: movie.title, 
                    genre: movie.genre, 
                    releaseDate: movie.releaseDate, 
                    director: movie.artists.director, 
                    actors: movie.artists.actors, 
                    writer: movie.artists.writer, 
                    producer: movie.artists.producer, 
                    mpa: movie.contentRating, 
                    thumbnail: movie.thumbnail, 
                    overall_rating: movie.overall_rating, 
                    reviews: movie.reviews,
                    emailAddress: emailAddress,
                    CurrentUserRating: CurrentUserRating,
                    CurrentUserReview: CurrentUserReview,
                    isLoggedIn: isLoggedIn
                });
            }
            else{
                isLoggedIn = false;
                showEditReviewSection = false;
                const movie = await searchMovies.getSingleMovies(req.params.MovieId);
                console.log(movie);
                res.render("individualMovie", {
                    title: movie.title, 
                    genre: movie.genre, 
                    releaseDate: movie.releaseDate, 
                    director: movie.artists.director, 
                    actors: movie.artists.actors, 
                    writer: movie.artists.writer, 
                    producer: movie.artists.producer, 
                    mpa: movie.contentRating, 
                    thumbnail: movie.thumbnail, 
                    overall_rating: movie.overall_rating, 
                    reviews: movie.reviews,
                    isLoggedIn: isLoggedIn
                });
            }
            

            
        }catch(e)   {
            console.log(`the Error is: ${e}`);
            res.status(400).render("error", {errors: e, title: "Error Occured!"});
        }
    })
    .post(async (req, res)  =>  {
        // console.log("i have entered routes to submit a review");
        // console.log(`userID is ${req.session.user.emailAddress}`);
        // console.log(req.body);
        //write code here to submit a review
        
        // console.log(`userId: ${userId}`);
        // console.log(`rating: ${req.body.ratingValue}`);
        // console.log(`review is: ${req.body.reviewValue}`)
        // console.log(`movie id: ${req.body.movieId}`);
    
        try {
        let userId = xss(req.session.user.emailAddress);
        let rating = xss(req.body.ratingValue);
        console.log(`rating is ${rating}`);
        let review = xss(req.body.reviewValue);
        console.log(`review is ${review}`);
        let movieId = xss(req.body.movieId);
        console.log(`movie id is ${movieId}`);
        
            userId = helpers.isValidEmail(userId);
            console.log(`user id is ${userId} after checking`);
            rating = helpers.isValidRating(rating);
            console.log(`rating is ${rating}`);
            review = helpers.checkReview(review);
            console.log(`review is ${review}`);
            movieId = helpers.checkId(movieId);
            console.log(`movie id is ${movieId}`);
            if(!ObjectId.isValid(movieId)){
                throw `movieId is not proper ObjectID`;
            }
            console.log("i have done all input validation in routes");
            
            const movie = await searchMovies.addReview(movieId, userId, rating, review);
            console.log(`_________________________________________`)
            console.log(movie);
        
        res.redirect(`/movies/${movieId}`);
        }
        catch(e)   {
            res.status(400).render("error", {errors: e, title: "Error Occured!"});
        }
    });


export default router;