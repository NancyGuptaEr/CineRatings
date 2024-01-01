
//this will remove the entire watchlist
function removeWatchlist(selectElement, userId) {
    var userId = selectElement.getAttribute('data-user-id');
    var watchlistName = selectElement.getAttribute('data-watchlist-name');
    

        if(!userId){
        throw `userId not provided`;
    }
    if(!watchlistName){
        throw `watchlistname not provied`;
    }
    if(typeof userId != "string"){
        throw `userId should be of type string`;
    }
    if(typeof watchlistName != "string"){
        throw `watchlist name should be of type string`;
    }

    userId = userId.trim();
    watchlistName = watchlistName.trim();
    if(userId.length === 0){
        throw `userId can't be a blank string`;
    }
    if(watchlistName.length === 0){
        throw `watchlist name can't be a blank string`;
    }
    if(watchlistName.length > 25 ){
        throw `watchlist name can't be greater than 25 characters`
    }
    if(watchlistName.length < 1){
        throw `watchlist name can't be less than 1 character`;
    }
    console.log(`$userId : ${userId}, watchListname: ${watchlistName}`);
 
    if(watchlistName != ''){
    console.log(`entering ajax`);
      $.ajax({
        url: '/watchlist/remove-Watch-list', 
        type: 'POST',
        contentType: 'application/json', 
        data: JSON.stringify({ 
          userId: userId,
          watchlistName: watchlistName
        }),
        success: function(response) {
            alert('Watchlist removed successfully');
            window.location.reload();
          console.log('Movie added to watchlist successfully');
        },
        error: function(xhr, status, error) {
          
          console.log('Error adding movie to watchlist:', error);
        }
      });
    }

  }
  // this delete a movie from the watchlist
  function removeMovieWatchlist(selectElement, userId, movieId){
    var userId = selectElement.getAttribute('data-user-id');
    var movieId = selectElement.getAttribute('data-movie-id');
    var watchlistName = selectElement.getAttribute('data-watchlist-name');
    if(!userId){
        throw `userId is missing.`
    }
    if(!movieId){
        throw `movieId is missing.`
    }
    if(!watchlistName){
        throw `watchlist name is missing`;
    }
    if(typeof userId !== "string"){
        throw `userId should only be of type string`
    }
    if(typeof movieId !== "string"){
        throw `movieId should only be of type string`
    }
    if(typeof watchlistName !== "string"){
        throw `watchlistName should only be of type string`
    }
    userId = userId.trim();
    movieId = movieId.trim();
    watchlistName = watchlistName.trim();
    if(userId.length === 0){
        throw `userId can't be empty string`;
    }
    if(movieId.length === 0){
        throw `movieId can't be empty string`;
    }
    if(watchlistName.length === 0){
        throw `watchlistName can't be empty string`;
    }
    if(watchlistName.length > 25 ){
        throw `watchlist name can't be greater than 25 characters`
    }
    if(watchlistName.length < 1){
        throw `watchlist name can't be less than 1 character`;
    }
    console.log(`userId: ${userId}, movieId: ${movieId}, watchlistName: ${watchlistName}`);
    if(watchlistName != ''){
        console.log(`entering ajax`);
          $.ajax({
            url: '/watchlist/remove-movie-watchList', 
            type: 'POST',
            contentType: 'application/json', 
            data: JSON.stringify({ 
              userId: userId,
              movieId: movieId,
              watchlistName: watchlistName
            }),
            success: function(response) {
              alert(`Movie removed from the watchlist successfully`);
              window.location.reload();
              console.log('Movie added to watchlist successfully');
            },
            error: function(xhr, status, error) {
              
              console.log('Error adding movie to watchlist:', error);
            }
          });
        }
  }
  
  
  $(document).ready(function() {
    function clearErrorMessages(){
        const errors = document.getElementById('create-watchlist-error');
        errors.textContent = '';
    }
    function appendError(elementId, errorMessage){
        console.log(`printing elementId: ${elementId} | printing errorMessage: ${errorMessage}`);
        let listinHTML = document.getElementById(elementId);
        let createErrorList = document.createElement('li');
        createErrorList.textContent = errorMessage;
        listinHTML.appendChild(createErrorList);
    }
    $('#watchlist-form').on('submit', function(event) {
        event.preventDefault();
        try{
        // Get form data
        var watchlistName = $('#watchlistName').val();
        console.log(`watchlistName: ${watchlistName}`);
        if(!watchlistName){
            throw `watchlistName is not provided`
        }
        if(typeof watchlistName !== "string"){
            throw `watchlistName should only be of type string`
        }
        watchlistName = watchlistName.trim();

        if(watchlistName.length === 0 ){
            throw `watchlistName can't be just empty spaces`;
        }
        if(watchlistName.length > 25 ){
            throw `watchlist name can't be greater than 25 characters`
        }
        if(watchlistName.length < 1){
            throw `watchlist name can't be less than 1 character`;
        }

        // AJAX request
        console.log(`entering ajax`);
        $.ajax({
            url: '/watchlist/create-watchlist',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                watchlistName: watchlistName
            }),
            success: function(response) {
                alert(`Watchlist Created successfully! Now you can add movies in your Watchlist.`);
                //window.location.reload();
                window.location.href = 'http://localhost:3000/home';
                console.log('Watchlist created successfully');

            },
            error: function(error) {
                console.error('Error creating watchlist:', error);
                
            }
        });
    }catch(error){
        if(error){
            console.log(`error discovered entered catch -> if`);
            appendError('create-watchlist-error', error);
            console.log(error);
        }
    }
    });
});