const showName = document.querySelector('.show-name');
const showPoster = document.querySelector('.show-poster');
const showSummary = document.querySelector('.show-summary');
const showRating = document.querySelector('.show-rating');
const showStatus = document.querySelector('.show-status');
// const episodeAmount = document.querySelector('.episode-amount');
const showRuntime = document.querySelector('.show-runtime');
const showTotalLength = document.querySelector('.show-total-length');

function getShowInfo(name) {
    return fetch(`https://api.tvmaze.com/singlesearch/shows?q=${name}`)
    .then(response => response.json())
    .catch(error => console.error(error));
}

function getAmountOfEpisodes(id) {
    return fetch(`https://api.tvmaze.com/shows/${id}/episodes`)
    .then(response => response.json())
    .then(data => data.length) // Return the episode count
    .catch(error => console.error(error));
}

function displayShowInfo() {
    let show = "White Lotus"; // Placeholder

    getShowInfo(show)
    .then(data => {
        showName.textContent = data.name;
        showPoster.setAttribute('src', data.image.medium);
        showSummary.innerHTML = data.summary;
        showRating.textContent = "Rating: " + data.rating.average;
        showStatus.textContent = "Status: " + data.status;
        showRuntime.textContent = "Average Runtime: " + data.averageRuntime;

        // Wait for the episode count promise to resolve before calculating total runtime
        getAmountOfEpisodes(data.id)
        .then(episodeCount => {
            showTotalLength.textContent = "Total Length: " + calculateTotalRuntime(data.averageRuntime, episodeCount);
        });
    });
}

function calculateTotalRuntime(runtime, episodes) {
    let totalMinutes = runtime * episodes;
    console.log("Total runtime: " + totalMinutes);
    return totalMinutes; // Return the total minutes
}

displayShowInfo();
