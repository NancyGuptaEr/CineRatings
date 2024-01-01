
// //this code will validate the search bar queries on client side
(function()  {
    const searchInput = document.getElementById("searchInput");
    const searchForm = document.getElementById("search-form");
    

    function clearMessages()    {
        let errors = document.getElementById("errors");
        errors.textContent = '';
    }

    function isValidMovieName(movieName)  {
        if(!movieName){
            throw `Please provide the movie name`; 
        }
        if(typeof movieName !== 'string'){
            throw 'movie name must be of string type';
        }
        movieName = movieName.trim();
        if(movieName.length === 0){
            throw 'movie name cannot be just empty spaces';
        }
        if(movieName.length > 50){
            throw `movie name can't be greater then 50 characters`
        }
        if(movieName.length < 1){
            throw `movie name should have atleast one character`
        }
        return movieName;
    }

    function appendError(elementId, errorMessage){
        console.log(`printing elementId: ${elementId} | printing errorMessage: ${errorMessage}`);
        let listinHTML = document.getElementById(elementId);
        let createErrorList = document.createElement('li');
        createErrorList.textContent = errorMessage;
        listinHTML.appendChild(createErrorList);
    }
    console.log("now i am about to enter search form on client side");

    if(searchForm)  {
        searchForm.addEventListener('submit', event =>  {
            event.preventDefault();

            let movieInputValue = searchInput.value;
            console.log(`movie input before validation is ${movieInputValue}`);
            try{
                movieInputValue = isValidMovieName(movieInputValue);
                console.log(`movie input after validation is ${movieInputValue}`);
                console.log(`movieIputvalue: ${movieInputValue}`);
                // if(movieInputValue) {
                //     clearMessages();
                // }
                console.log(`about to submit the form`)
                if(movieInputValue) {
                    console.log("now i will submit it and client side is done");
                    searchForm.submit();
                    return;
                }

            }
            catch(error)   {
                console.log(`theres an error entering catch`)
                if(error)   {
                    console.log("now i have caught the error");
                    appendError('errors', error);
                    console.log(error);
                }
                
            }
        })
    }
})();

// $(document).ready(function()    {
//     function clearMessages()    {
//         let errors = document.getElementById("errors");
//         errors.textContent = '';
//     }
//     function appendError(elementId, errorMessage){
//         console.log(`printing elementId: ${elementId} | printing errorMessage: ${errorMessage}`);
//         let listinHTML = document.getElementById(elementId);
//         let createErrorList = document.createElement('li');
//         createErrorList.textContent = errorMessage;
//         listinHTML.appendChild(createErrorList);
//     }
//     $('#search-form').on('submit', function(event)  {
//         event.preventDefault();
//         try{
//         var searchInput = $('#searchInput').val();
//         if(!searchInput)  {
//             throw `Please provide the movie name`; 
//         }
//         if(typeof searchInput !== 'string')   {
//             throw 'movie name must be of string type';
//         }
//         searchInput = searchInput.trim();
//         if(searchInput.length === 0)  {
//             throw 'movie name cannot be just empty spaces';
//         }
//         if(searchInput.length > 50) {
//             throw 'movie name cannot be more than 50 characters';
//         }
//         if(searchInput.length < 1)  {
//             throw 'movie name cannot be less than 1  character';
//         }
//         console.log(`search input is ${searchInput}`);
//         console.log("entering ajax");
//         $.ajax({
//             url: '/movies',
//             type: 'POST',
//             contentType: 'application/json',
//             data: JSON.stringify({
//                 searchInput: searchInput
//             }),
//             success:function(response)  {
//                 alert('movie search successful');
//                 window.location.reload();
//             },
//             error: function(error)  {
//                 console.error('Error in searching the movie', error);
//             }
//         });
//     }catch(error)   {
//         if(error)   {
//             console.log('error discovered and entered catch block');
//             appendError('search movie error', error);
//             console.log(error);
//         }
//     }
//     });
// });