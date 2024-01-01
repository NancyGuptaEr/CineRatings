import { movies, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as please from '../helper.js'
/////////////  ALL OF THIS IS FOR GETTING MOVIES FOR THE MOVIE LISTING PAGE  ////////////////

let exportedMethods = {

    async getWatchList(userId){
        console.log(`entering db  function for getwatchlist`);
        userId = please.checkStr(userId);

        if(!ObjectId.isValid(userId)){
            throw `User Id isn't the valid object ID`;
        }

        const userData = await users();
        const movieData = await movies();
        const userExists = await userData.findOne({_id: new ObjectId(userId)});

        if(!userExists){
            throw `User doesn't exists`;
        }

        const watchListProjection = {_id: 0, watchList: 1};
        const movieListProjection = {_id: 1, title: 1, thumbnail: 1, overall_rating: 1};

        let userInfo = await userData.find({_id: new ObjectId(userId)}).project(watchListProjection).toArray();

        userInfo = userInfo[0].watchList;
        // console.log(`printing userinfo:`);
        // console.log(userInfo);
        let returnWatchListObject = {};
        
        for (let watchList in userInfo){
            console.log(`watchlist name: ${watchList}`);
            returnWatchListObject[watchList] = [];
            for (let i=0; i < userInfo[watchList].length; i++){
                let movieId = userInfo[watchList][i];
                let movieInfo = await movieData.find({_id: new ObjectId(movieId)}).project(movieListProjection).toArray()
                // console.log(`##########################################3`);
                // console.log(movieInfo);
                // console.log(`########################################`);
                
           
                if (movieInfo.length > 0){
                    movieInfo = movieInfo[0];
                    returnWatchListObject[watchList].push(movieInfo);
                }
            }
        }
        // console.log(`printing returnmovieovject:`);
        // console.log(returnWatchListObject);
        return returnWatchListObject;
    },

    async getMoviesByGenreWithoutLogin(){
        console.log(`entering db function of getmoviesbygnerewithoutloging`);
        const movieData = await movies();
        const genreList = await movieData.distinct('genre');
        console.log(`All genres in the collection:`);
        console.log(genreList);
    
        function chooseRandom(Array){
            // console.log(`overall Array length = :${Array.length}`);  
            const randomChoice = Math.floor(Math.random()*10) % Array.length;
            // console.log(`selected Array index: ${randomChoice}`);
            let returnValue = Array[randomChoice];
            return returnValue;
        }
        
        let uniqueGenres = new Set();

        while (uniqueGenres.size != 3){
            let newGenre = chooseRandom(genreList);
            // console.log(`newGenre=: ${newGenre}`);
            uniqueGenres.add(newGenre);
        }
        uniqueGenres = Array.from(uniqueGenres); //Here we have 3 random and unique genres in the array
        // console.log(`Random unique genres are: ${uniqueGenres}`);
        const movieListProjection = {_id: 1, title: 1, contentRating: 1, thumbnail: 1, overall_rating: 1};

        let MoviesObject = {};
        let returnMoviesArray = [];
        let MoviesWithGenre = {}
        const topMoviesList = await movieData.find().sort({overall_rating: -1}).project(movieListProjection).limit(10).toArray();
        MoviesObject['Top 10 on CineRatings'] = topMoviesList;
        returnMoviesArray.push(MoviesObject); // This will push top rated movies to the array forming first section of the page

        for (let i = 0; i < uniqueGenres.length; i++){// here we find movies for the genres present in uniqueGenres
            const movieList = await movieData.find({genre: uniqueGenres[i]}).project(movieListProjection).limit(10).toArray();
            if(movieList.length > 0){
                MoviesWithGenre[uniqueGenres[i]] = movieList;
            }
        }
        returnMoviesArray.push(MoviesWithGenre);//Now we push the uniqueGenre movies to the array forming second section of the page

        //Structure of returnMoviesArray [{movies with highest ratings},{movies from 3 unique random genres}]
        //                                          0th position^                    1st position^
        
        // console.log(returnMoviesArray); // till here we have random genre and movies with
        // console.log(`__________________________________`);
        // console.log(movieList);
        // console.log(returnMoviesArray);
        // console.log(`_______________________________________________________`);
        return returnMoviesArray;

    },

    async getMoviesWithLogin(userId){
        console.log(`entering db functions for getmovieswithlogin`);
        userId = please.checkStr(userId, "User ID");
        if(!ObjectId.isValid(userId)){
            throw `User ID isn't a valid object ID`;
        }
        
        const userData = await users();
        const userExists = await userData.findOne({_id: new ObjectId(userId)});

        if(!userExists){
            throw `User doesn't exists`;
        }

        const genreProjection = {_id : 1, preferGenre: 1, maxContentRating: 1}
        let userPreference = await userData.find({_id: new ObjectId(userId)}).project(genreProjection).toArray(); //First we'll need to get user genres 
        console.log(`User Info: `);
        console.log(userPreference);
        if(userPreference.length === 0 ){
            throw `User not found`;
        }
        
        const preferedGenres = userPreference[0].preferGenre; // here preferedGenres contains all the Genres that user loves
        const maxContentRating = userPreference[0].maxContentRating;
        // console.log(`age of user: ${minAge}`);
        const contentRatings = ['G','PG','PG-13','R','NC-17'];
        
        function returnContentRatings(maxContentRating){
            // console.log(`minimum age content for the user: ${minimumAge}`);
            let contentRating = [];
            let index = 0;

            for (let i=0 ; i < contentRatings.length; i++){
                if(contentRatings[i] === maxContentRating){
                    
                    index = i;
                    console.log(`max age limit is at location: ${i}`);
                    break;
                }
                else{
                    index = 5;
                }
            }

            for (let j = 0 ; j <= index; j++ ){
                contentRating.push(contentRatings[j]);
            }
            return contentRating;
        }
        const allowedContentRatings = returnContentRatings(maxContentRating);//here we have a array for all content ratings that are legal to user

        // console.log(`user preferedGenres are: ${preferedGenres}`);
        console.log(`content ratings for user: ${allowedContentRatings}`);
    
        const movieData = await movies();
        const movieListProjection = {_id: 1, title: 1, thumbnail: 1, contentRating: 1, overall_rating: 1};
        let movieListByGenre = {};

        for (let i = 0; i < preferedGenres.length; i++){//here we go through users prefered genre and push only movies which fall under users max content rating
            const movieList = await movieData.find({genre: preferedGenres[i], contentRating: {$in: allowedContentRatings}}).project(movieListProjection).limit(10).toArray();
            const genre = preferedGenres[i]
            if(movieList.length > 0){
                movieListByGenre[genre] = movieList;
            }
            // console.log(`printing movieList :`);
            // console.log(movieList);
        }
        // console.log(`Below is the movie list`);
        // console.log(movieListByGenre); // Till here we have movies by user genres
    
        ///////////// From here we'll need to have movies from users watchlist ///////////////////////////

        // const watchlistProjection = {_id: 1, watchList: 1}
        // let watchlist = await userData.find({emailAddress: emailAddress}).project(watchlistProjection).toArray();
        // watchlist = watchlist[0].watchList; //this is an object, here we have all the watchlists of the user
        //structure of watchlist object   {
        //                                 NameOfWatchList1:[movies..],
        //                                 NameOfWatchList2:[movies..]
    //                                 }
        const watchlist = await this.getWatchList(userId);
    //    console.log(`____________________________________`) ;
    // console.log(watchlist);
        // let completeWatchList = {};
        // for (let watchListName in watchlist){
        //     // console.log(`${watchListName}:   `);
        //     let movieList = [];
        //     for (let i = 0; i < watchlist[watchListName].length; i++){
        //         // console.log(watchlist[watchListName][i]);
        //         let movieName = watchlist[watchListName][i];
        //         const movieInfo = await movieData.find({title: movieName}).project(movieListProjection).toArray();
        //         movieList.push(movieInfo[0]);
        //     }
        //     completeWatchList[watchListName] = movieList;
        // }
        // console.log(`printing complete watchlist: `);
        // console.log(completeWatchList);
        //////////////  Here we'll get top rated rated movies for preferred user genres  ////////////////
        const countOfUserGenre = preferedGenres.length;
        const moviesPerGenre = Math.ceil(10/countOfUserGenre);
        let topPicksForUser = [];
        for(let i = 0; i < countOfUserGenre; i++){// this will give us top rated movies from users favorite genres
            let currentUserGenre = preferedGenres[i];
            const movieList = await movieData.aggregate([{$match: {genre: currentUserGenre, contentRating: {$in: allowedContentRatings}}},{$sort: {overall_rating: -1}},{$limit: moviesPerGenre}]).project(movieListProjection).toArray();
            if(movieList.length > 0){
                for (let i =0; i < movieList.length; i++){
                    topPicksForUser.push(movieList[i]);
                }
            }
        }
        let retrunArray = [];
        // console.log(`Top picks for user: printing toppicksforuser array:  `)
        // console.log(topPicksForUser);
        // console.log(`watchlist: `)
        // console.log(watchlist);

        
        /////////////// Below is for First Section i.e: getting movies by genre  //////////////////

        const genreList = await movieData.distinct('genre');
        // console.log(`All genres in the collection:`);
        // console.log(genreList);
    
        function chooseRandom(Array){
            // console.log(`overall Array length = :${Array.length}`);  
            const randomChoice = Math.floor(Math.random()*10) % Array.length;
            // console.log(`selected Array index: ${randomChoice}`);
            let returnValue = Array[randomChoice];
            return returnValue;
        }
        
        let uniqueGenres = new Set();

        while (uniqueGenres.size != 3){
            let newGenre = chooseRandom(genreList);
            // console.log(`newGenre=: ${newGenre}`);
            uniqueGenres.add(newGenre);
        }
        uniqueGenres = Array.from(uniqueGenres);    
        let MoviesWithGenre = {};// this will store movies with 3 random Genres

        for (let i = 0; i < uniqueGenres.length; i++){// here we find movies for the genres present in uniqueGenres
            const movieList = await movieData.find({genre: uniqueGenres[i],contentRating: {$in: allowedContentRatings}}).project(movieListProjection).limit(10).toArray();
            if (movieList.length > 0){
                MoviesWithGenre[uniqueGenres[i]] = movieList;
            }
        }
        // console.log(`printing movies with Genre`)
        // console.log(MoviesWithGenre);
        ////////////// Below is for Top 10 on CineRatings  //////////////////////////////////////////
        let topMoviesObj = {};

        const topMoviesList = await movieData.aggregate([{$match: {contentRating: {$in: allowedContentRatings}}},{$sort: {overall_rating: -1}},{$limit: 10}]).project(movieListProjection).toArray();
        topMoviesObj['Top 10 on CineRatings'] = topMoviesList;
        // console.log(`top 10 on cineratings: `)
        // console.log(topMoviesList);
        retrunArray.push(MoviesWithGenre);
        retrunArray.push(topPicksForUser);
        retrunArray.push(watchlist);
        retrunArray.push(topMoviesObj);

        // BELOW IS THE STRUCTURE OF RETURN ARRAY, EVERY THING ACCEPT watchlist HAS CONTENT RATING APPLIED

        //structure of returnArray  [ {movieGenre:[movies]},   //movies with 3 randomGenres
        //                          [{movie1,movie2,etc}],     //movies recommended based on user genres
        //                          {watchListName:[movies]},  //movies from watchlist
        //                          [movies] ]                 //top 10 on cineratings
        // console.log(`_______________________________________________________`);
        // console.log(retrunArray);
        
        return retrunArray;
    },
    async checkWatchListExists(watchListName, userId){
        console.log(`entering db functionns  for checkwatchliststexist`);
        watchListName = please.checkStr(watchListName, "Watch List Name");
        userId = please.checkStr(userId, "User Id");

        if(!ObjectId.isValid(userId)){
            throw `User ID isn't valid object ID`;
        }
        if(watchListName.length > 25){
            throw `watchlist name can't be greater than 25 characters`;
        }
        if(watchListName.length < 1){
            throw `watchlist name can't be less than 1 character`;
        }
        const userData = await users();
        const userExists = await userData.findOne({_id: new ObjectId(userId)});
        if(!userExists){
            throw `User doesn't exists`;
        }
        const userInfo = await userData.findOne({_id: new ObjectId(userId),[`watchList.${watchListName}`]: {$exists: true}});
        // console.log(`userInfo =:`);
        // console.log(userInfo);
        if(!userInfo){
            return false;
        }
        else{
            return true;
        }
    },
    async addWatchList(watchListName, userId){
        console.log(`entering db functions for add watchlist`)
        watchListName = please.checkStr(watchListName, "Watch List Name");
        userId = please.checkStr(userId, "User ID");

        if(!ObjectId.isValid(userId)){
            throw `User ID isn't valid object ID`;
        }
        if(watchListName.length > 25){
            throw `watchlist name can't be greater than 25 characters`;
        }
        if(watchListName.length < 1){
            throw `watchlist name can't be less than 1 character`;
        }
        const userData = await users();
        const userExists = await userData.findOne({_id: new ObjectId(userId)});
        if(!userExists){
            throw `There is no such user.`
        }
        const userInfo = await userData.findOneAndUpdate({_id: new ObjectId(userId)},
        {$set: {[`watchList.${watchListName}`]:[]}},
        {returnDocument: 'after'});
        // console.log(userInfo);
        if(!userInfo) {
            throw `There was a problem adding watchlist`;
        }
        return true;
    },
    async addMovieToWatchList(movieId, watchListName, userId){
            console.log(`entering db fucntinos for add movie to watchlist`);
            movieId = please.checkStr(movieId, "Movie ID");
            userId = please.checkStr(userId, "user ID");
            watchListName = please.checkStr(watchListName, "Watch List Name");

           if (!ObjectId.isValid(movieId)){
            throw  `Object id for movie is invalid`;
           }
           if (!ObjectId.isValid(userId)){
            throw  `Object id for User is invalid`;
           }
           if(watchListName.length > 25){
            throw `watchlist name can't be greater than 25 characters`;
            }
            if(watchListName.length < 1){
                throw `watchlist name can't be less than 1 character`;
            }
           const userData = await users();
           const movieData = await movies();
           const userInfo = await userData.findOne({_id: new ObjectId(userId)});
           const movieInfo = await movieData.findOne({_id: new ObjectId(movieId)});


           if(!userInfo){
                throw `User Doesn't exists`;
           }
           if(!movieInfo){
                throw `Movie doesn't exists`;
           }
           const watchListExists =  await this.checkWatchListExists(watchListName, userId);
           if(!watchListExists){
                throw `WatchList doesn't exists`;
           }
           const movieExistsinWatchList = await userData.findOne({_id: new ObjectId(userId)},{watchList: watchListName});
        //    console.log(movieExistsinWatchList.watchList[watchListName]);
           let moviesInWatchList = movieExistsinWatchList.watchList[watchListName];
           for (let i=0; i < moviesInWatchList.length; i++ ){
                if(movieId.toString()===moviesInWatchList[i].toString()){
                    throw `Movie is already present in the watchlist`;
                }
           }
        //    console.log(`Movies in `);
        //    console.log(movieExistsinWatchList);
        //    console.log(`__________________________`);
           const movieInsertedInWatchList = await userData.findOneAndUpdate(
                                    {_id: new ObjectId(userId)},
                                    {$push: {[`watchList.${watchListName}`]: new ObjectId(movieId)}},
                                    {returnDocument: 'after'});
            
            if(!movieInsertedInWatchList){
                throw `there was a problem inserting the movie to the watchlist`
            }
            // console.log(movieInsertedInWatchList);
            return true;
    },
    async removeMovieFromWatchList(userId, movieId, watchListName){
        console.log(`entering db functins for removemoviefrom watchlist`);
        userId = please.checkStr(userId, "user ID");
        movieId = please.checkStr(movieId, "Movie ID")
        watchListName = please.checkStr(watchListName,"Watch list name");
        if(!ObjectId.isValid(userId)){
            throw `UserID isn't a valid object ID`;
        }
        if(!ObjectId.isValid(movieId)){
            throw  `MovieID isn't a valid object ID`;
        }
        if(watchListName.length > 25){
            throw `watchlist name can't be greater than 25 characters`;
        }
        if(watchListName.length < 1){
            throw `watchlist name can't be less than 1 character`;
        }
        const userData = await users();
        const userExists = await userData.findOne({_id: new ObjectId(userId)});

        if(!userExists){
            throw `User doesn't exists`;
        }
        let watchListExists = this.checkWatchListExists(watchListName, userId);
        if(!watchListExists){
            throw `WatchLists doesn't exists`;
        }
        
        const movieExistsinWatchList = await userData.findOne({_id: new ObjectId(userId)},{watchList: watchListName});
        let moviesInWatchList = movieExistsinWatchList.watchList[watchListName];
        let doesMovieExists = false;
           for (let i=0; i < moviesInWatchList.length; i++ ){
                if(movieId.toString()===moviesInWatchList[i].toString()){
                    doesMovieExists = true;
                    break;
                }
           }
        if (!doesMovieExists){
            throw `Movie isn't present in the watchlist`;
        }
        let removeMovie = { $pull: {} };
        removeMovie.$pull[`watchList.${watchListName}`] = new ObjectId(movieId);

        const result = await userData.updateOne({ _id: new ObjectId(userId)}, removeMovie);
        // console.log(`ObjectId removed from ${watchListName} array`, result);
        if(!result.acknowledged){
            throw `There was a problem deleting movie from the db`;
        }
        return true;
    },

    async removeWatchList(userId, watchListName){

        userId = please.checkStr(userId, "User ID");
        watchListName = please.checkStr(watchListName, "Watch list name");

        if(!ObjectId.isValid(userId)){
            throw `User ID isn't valid object ID`;
        }
        if(watchListName.length > 25){
            throw `watchlist name can't be greater than 25 characters`;
        }
        if(watchListName.length < 1){
            throw `watchlist name can't be less than 1 character`;
        }
        const userData = await users();
        const userExists = await userData.findOne({_id: new ObjectId(userId)});

        if(!userExists){
            throw `User doesn't exists`;
        }

        let watchListExists = await this.checkWatchListExists(watchListName, userId);
        if(!watchListExists){
            throw `watch list doesn't exists`;
        }

        const removeWatchList = { $unset: {} };
        removeWatchList.$unset[`watchList.${watchListName}`] = ""; // Unset the watchlist

        const result = await userData.updateOne({ _id: new ObjectId(userId) }, removeWatchList);

        if(!result.acknowledged){
            throw `There was a problem removing the watchList`;
        }

       return true;

    }
}

export default exportedMethods;