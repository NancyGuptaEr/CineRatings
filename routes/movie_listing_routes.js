import { Router } from "express";
import { movieListingDataFuncs } from "../data/index.js";
import xss from 'xss';

const router = Router();

router
    .route('/')
    .get(async (req, res) => {
       try{
        // console.log(top10onCineRating);
        if(req.session.user){
            // console.log(`we do have a user session....`);
            // console.log(req.session.user);
            const userId = req.session.user._id;
            // console.log(userEmailAddress)
            let movieInfo ;
            if(!req.session.user.isAdmin){
                movieInfo = await movieListingDataFuncs.getMoviesWithLogin(userId);
            }
            else{
                movieInfo = await movieListingDataFuncs.getMoviesByGenreWithoutLogin();
                const moviesByGenre = movieInfo[1]; //This is an object which contains 3 random genres 
                //and their respective movies in array which are again an object of {title,thumbnail,overall_rating}
                const top10onCineRating = movieInfo[0]; //This is an object containing top 10 movies on cineratings
                // console.log(`printing top10oncineratings withoutloggin `);
                // console.log(top10onCineRating);
                // console.log(`______________________________________________`);
                res.render('movieListing',{title: 'CineRatings', Genres: moviesByGenre, Top10: top10onCineRating, isLoggedIn: true});
            }
            // console.log(movieInfo[1]);
            const moviesByGenre = movieInfo[0];
            const topPicksForUser = movieInfo[1];
            const userWatchListMovies = movieInfo[2];
            const top10onCineRating = movieInfo[3];
            // console.log(`printing watchlist `)
            let watchListNames = [];
            for (let watchlistName in userWatchListMovies){
                watchListNames.push(watchlistName);
            }
            console.log(watchListNames);
            res.render('movieListing',{title: "My Movie Page" , Genres: moviesByGenre, recommendedMovies: topPicksForUser, UserWatchListMovies: userWatchListMovies, Top10: top10onCineRating, isLoggedIn: true, watchListNames: watchListNames, userId: userId});
        }
        else {
            const movieInfo = await movieListingDataFuncs.getMoviesByGenreWithoutLogin();
            const moviesByGenre = movieInfo[1]; //This is an object which contains 3 random genres 
            //and their respective movies in array which are again an object of {title,thumbnail,overall_rating}
            const top10onCineRating = movieInfo[0]; //This is an object containing top 10 movies on cineratings
            console.log(`printing top10oncineratings withoutloggin `);
            console.log(top10onCineRating);
            console.log(`______________________________________________`);
            res.render('movieListing',{title: 'My Movie Page', Genres: moviesByGenre, Top10: top10onCineRating,isLoggedIn: false});
        }
    }
    catch(error){
        res.status(400).render('error',{errors: error});
    }
    })
    .post(async (req,res)=>{

    });
    router.route('/add-to-watchlist')
        .get(async (req, res) => {
            // console.log(`entered get of add to watchlist route`);
        })
        .post(async (req, res) => {
            // console.log(`\n we are in post of add to watchlist route`);
            // console.log(req.body);
            try{
            let userId = xss(req.body.userId);
            let movieId = xss(req.body.movieId);
            let watchListName = xss(req.body.watchlistName);
            const insertMovieInWatchList = await movieListingDataFuncs.addMovieToWatchList(movieId,watchListName,userId);
            if(!insertMovieInWatchList){
                console.log(`there was a problem inserting movie to the watchlist`);//throw needs to be written
            }
            else{
                console.log(`return from db: ${insertMovieInWatchList}`);
            }
        }
        catch(error){
            res.status(400).render('error',{errors: error});
        }
        })

export default router;