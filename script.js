'use strict';

const apiKey = '56d21064b7cc44009259fb9e42cb3962'

const searchURL = 'https://listen-api.listennotes.com/api/v2/search';

const recommendationURL = 'https://listen-api.listennotes.com/api/v2/podcasts/';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {

  // if there are previous results, remove them
  $('.js-results').empty();
	if (responseJson.results.length === 0) {
		
    $('.js-results').append(`<p class ="no results"> There are no results for this search </p>`);
	}
	
  // iterate through the podcasr array, stopping at the max number of results
  for (let i = 0; i < responseJson.results.length; i++) {
    // for each podcast object in the list
    //array, add a list item to the results 
    //list with the podcast title, source, author,
    //description, and image

    $('.js-results').append(
      `
<div class="contain">
    <h2 class="js-name clearfix">${responseJson.results[i].title_original}</h2>
    <div class="js-info">
    <img class ="thumbnail" src='${responseJson.results[i].thumbnail}'>
        <p class="readmore-contain">${responseJson.results[i].description_original}</p>
        <a class = "learn-more-button" href='${responseJson.results[i].listennotes_url}' target="_blank">Learn More</a>
        <button id = "myBtn"class = "find-similar" value = ${responseJson.results[i].id}>Find Similar Podcasts</button>
        </div>   
</div> 


`
    )
  $('.modal-content').append(`<div id = ${responseJson.results[i].id}>  </div>`)
 
  };

  //display the results section  
  $('.js-results').removeClass('hidden');

  
};


function getPodcasts(query) {
  const params = {
    q: query,
    type: "podcast",
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  

  const options = {
    headers: new Headers({
      "X-ListenAPI-Key": apiKey
    })
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-warn').text(`Something went wrong`);
    });
}

function getRecommendations(id) {
  
  const parameters = {
    id: id
  };

  const url = recommendationURL + id + '/recommendations?safe_mode=1';
 

  const options = {
    headers: new Headers({
      "X-ListenAPI-Key": apiKey
    })
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayPodcastRecommendations(responseJson,id))
    .catch(err => {
      $('#js-warn').text(`Something went wrong`);
    });

}

function displayPodcastRecommendations(responseJson,id) {

  
    $('.similar').empty();
    
    
    let newid = "#"+id;
    
    
    const url = recommendationURL + id + '/recommendations?safe_mode=1';
    for (let i = 0; i < responseJson.recommendations.length; i++) {
   
        $(newid).append(
      `
<div class="similar">
  <h2 class="js-name clearfix">${responseJson.recommendations[i].title}</h2>
  <div class="js-info">
  <img class ="thumbnail" src='${responseJson.recommendations[i].thumbnail}'>
      <p class="readmore-contain">${responseJson.recommendations[i].description}</p>
      <a class = "learn-more-button" href='${responseJson.recommendations[i].listennotes_url}'>Learn More</a>
  </div>
</div>
`
    )
    
    }

	// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 

  modal.style.display = "block";


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

  //});
  
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('.js-search-term').val();

    getPodcasts(searchTerm);

  });
}

$(watchForm);

$(".js-results").on('click', '.find-similar', function(e) {

    getRecommendations(e.target.value);
  }); 

  

