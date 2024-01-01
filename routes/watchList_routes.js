import { Router } from "express";
import { movieListingDataFuncs } from "../data/index.js";
import { compareSync } from "bcrypt";
import * as please from '../helper.js';
import { ObjectId } from "mongodb";
import xss from 'xss';

const router = Router();

router.route('/').get(async (req,res) => {
    try{
    if(req.session.user){
        const userInfo = req.session.user;
        let userId = userInfo._id;
        userId = please.checkStr(userId,"User Id");
        if(!ObjectId.isValid(userId)){
            throw `userId isn't a valid objectID`;
        }

        console.log(`user id of the user logged in: ${userId}`);

        const movieInfo = await movieListingDataFuncs.getWatchList(userId);
        console.log(`printing movieInfo routes...............................`);
        console.log(movieInfo);
        let newMovieInfo = movieInfo;
        for(let watchlist in newMovieInfo){
            console.log(`watchlist: ${watchlist}`);
            for(let i=0; i < newMovieInfo[watchlist].length; i++){
                newMovieInfo[watchlist][i]['watchListName'] = watchlist;
            }
            
        }
        console.log(`printing new movie info #####################################`);
        console.log(newMovieInfo);
        let isWatchlistEmpty = false;
        let watchlistArray = Array.from(newMovieInfo);
        console.log(watchlistArray);
        if(watchlistArray.length < 1){
            console.log(`watchlsit is empty`);
            isWatchlistEmpty = true
        }
        
        // res.render('watchList',)
        res.render('watchList', {title: 'My Watchlist', UserWatchListMovies: newMovieInfo, userId: userId, isWatchlistEmpty: isWatchlistEmpty, isLoggedIn: true});
    }
}
catch(error){
    res.status(400).render('error',{errors: error});
}
}).post(async(req, res)=>{
    
})

router.route('/remove-Watch-list').post(async (req,res) => {

    console.log(`entered for post routes for removing watchlist`);
    try{
    if(req.session.user){
        const deletionInfo = xss(req.body);
        let userId = xss(req.session.user._id);
        let watchListName = xss(req.body.watchlistName);
        userId = please.checkStr(userId,"User Id");
        if(!ObjectId.isValid(userId)){
            throw `userId isn't a valid objectID`;
        }
        watchListName = please.checkStr(watchListName);
        if(watchListName.length > 25 ){
            throw `watchlist name can't be greater than 25 characters`
        }
        if(watchListName.length < 1){
            throw `watchlist name can't be less than 1 character`;
        }

        console.log(`userid :${userId}, watchListname: ${watchListName}`);

        const removeWatchList = await movieListingDataFuncs.removeWatchList(userId, watchListName);

        if(removeWatchList){
            console.log(`watchlist deletion successfull reload page `);
        }
    }
    res.redirect('/watchlist');
    
}
catch(error){
    res.status(400).render('error',{errors: error});
}
})
router.route('/remove-movie-watchList').post(async(req, res)=> {
    // console.log(`movie deletion route......`);
    // console.log(req.body);
    try{
    let userId = xss(req.body.userId);
    let movieId = xss(req.body.movieId);
    let watchlistName = xss(req.body.watchlistName);

    

    watchlistName = please.checkStr(watchlistName);
        if(watchlistName.length > 25 ){
            throw `watchlist name can't be greater than 25 characters`
        }
        if(watchlistName.length < 1){
            throw `watchlist name can't be less than 1 character`;
        }
    console.log(`userId: ${userId}, movieid: ${movieId}, watchlistName: ${watchlistName}`);

    const deletedMovie = await movieListingDataFuncs.removeMovieFromWatchList(userId, movieId, watchlistName);

    if(deletedMovie){
        console.log(`movie has been deleted reload`);
    }
    res.redirect('/watchlist');
}
catch(error){
    res.status(400).render('error',{errors: error});
}
})

router.route('/create-watchlist').post(async(req, res)=> {
    try{
    let userId = xss(req.session.user._id);
    console.log(`userid: ${userId}, watchlistName: ${req.body.watchlistName}`);
    
    const watchListName = xss(req.body.watchlistName);
    const watchlistData = await movieListingDataFuncs.addWatchList(watchListName, userId);
    if(watchlistData){
        console.log(`watchlist creation complete reload page`);
    }
    res.redirect('/watchlist');

}
catch(error){
    res.status(400).render('error', {errors: error});
}
})
export default router;