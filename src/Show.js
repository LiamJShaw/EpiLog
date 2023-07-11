import React, { useEffect, useState } from 'react';
const parser = new DOMParser();

async function getShowInfo(name) {
    return fetch(`https://api.tvmaze.com/singlesearch/shows?q=${name}`)
    .then(response => response.json())
    .catch(error => console.error(error));
}

async function getAmountOfEpisodes(id) {
    return fetch(`https://api.tvmaze.com/shows/${id}/episodes`)
    .then(response => response.json())
    .then(data => data.length) // Return the episode count
    .catch(error => console.error(error));
}

function Show() {
    const [show, setShow] = useState(null);
    const [episodes, setEpisodes] = useState(0);
    const showName = "Suits"; // Placeholder

    useEffect(() => {
        getShowInfo(showName).then(data => {
            setShow(data);
            getAmountOfEpisodes(data.id).then(episodeCount => {
                setEpisodes(episodeCount);
            });
        });
    }, [showName]);

    return show ? (
        <div>
            <ShowInfo show={show} />
            <EpisodeInfo runtime={show.averageRuntime} episodes={episodes} />
        </div>
    ) : (
        <div>Loading...</div>
    );
}

function ShowInfo({ show }) {

    const parsedSummary = parser.parseFromString(show.summary, 'text/html');
    const textSummary = parsedSummary.body.textContent;

    return (
        <div>
            <h1>{show.name}</h1>
            <ShowPoster url={show.image.medium} />
            <p>{ textSummary }</p>
            <p>Rating: {show.rating.average}</p>
            <p>Status: {show.status}</p>
            <p>Average Runtime: {show.averageRuntime}</p>
        </div>
    );
}

function ShowPoster({ url }) {
    return <img src={url} alt="Show poster" />;
}

function EpisodeInfo({ runtime, episodes }) {
    const totalRuntime = runtime * episodes;
    return <p>Total Length: {totalRuntime}</p>;
}

export default Show;
