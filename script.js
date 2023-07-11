const tvShowForm = document.getElementById("tv-show-form");
const tvShowInput = document.getElementById("tv-show-input");
const tvShowList = document.getElementById("tv-show-list");

let tvShows = [];

// Create TV Show object
function createTVShowObject(name) {
    return fetch(`https://api.tvmaze.com/singlesearch/shows?q=${name}`)
    .then(response => response.json())
    .then(data => {

        console.log({ 
            name: data.name,
            summary: data.summary,
            runtime: data.averageRuntime
        });

        console.log(data.image.medium);

        return data;
    })
    .catch(error => console.error(error));
}

// Display TV shows in the list
function displayTVShows() {
  tvShowList.innerHTML = "";
  for (let i = 0; i < tvShows.length; i++) {
    const li = document.createElement("li");
    li.setAttribute("data-index", i)
    li.innerHTML = `${tvShows[i].name} <img src=${tvShows[i].image.medium}> ${tvShows[i].summary} <button class="delete-tv-show-btn">Delete</button>`;
    tvShowList.appendChild(li);
  }
}

// Add a TV show to the list
function addTVShow(event) {
  event.preventDefault();
  const tvShow = tvShowInput.value.trim();

  if (tvShow !== "") {
    createTVShowObject(tvShow)
    .then(data => {        
        tvShows.push(data);
        displayTVShows();
        tvShowInput.value = "";
        tvShowInput.focus();
    })
  }
}

// Delete a TV show from the list
function deleteTVShow(event) {
  if (event.target.classList.contains("delete-tv-show-btn")) {
    const index = event.target.parentElement.getAttribute("data-index");
    tvShows.splice(index, 1);
    displayTVShows();
  }
}

function showDetails(event) {
    if (!event.target.classList.contains("delete-tv-show-btn")) {
        const index = event.target.getAttribute("data-index");
        console.log("Summary: " + tvShows[index].summary);
    }
}

// Event listeners
tvShowForm.addEventListener("submit", addTVShow);
tvShowList.addEventListener("click", deleteTVShow);
tvShowList.addEventListener("click", showDetails);