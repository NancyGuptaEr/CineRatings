
function addToWatchlist(selectElement, userId) {
  var userId = selectElement.getAttribute('data-user-id');
  var movieId = selectElement.getAttribute('data-movie-id');
  var watchlistName = selectElement.value;
  console.log(`$userId : ${userId}, movieId: ${movieId}, watchListname: ${watchlistName}`);
if(watchlistName != ''){
    $.ajax({
      url: '/home/add-to-watchlist', 
      type: 'POST',
      contentType: 'application/json', 
      data: JSON.stringify({ 
        userId: userId,
        movieId: movieId,
        watchlistName: watchlistName
      }),
      success: function(response) {
        
        console.log('Movie added to watchlist successfully');
      },
      error: function(xhr, status, error) {
        
        console.log('Error adding movie to watchlist:', error);
      }
    });
  }
}