import React, { useEffect, useState } from 'react';
const parser = new DOMParser();

async function getShowInfo(name) {
  const response = await fetch(`https://api.tvmaze.com/singlesearch/shows?q=${name}`);
  if (!response.ok) {
    throw new Error(`No show found with the name "${name}"`);
  }
  const data = await response.json();
  return data;
}

async function getAmountOfEpisodes(id) {
  const response = await fetch(`https://api.tvmaze.com/shows/${id}/episodes`);
  if (!response.ok) {
    throw new Error(`No episodes found for the show with id "${id}"`);
  }
  const data = await response.json();
  return data.length;
}

function Show({ showName, onSearchAgain }) {
  const [show, setShow] = useState(null);
  const [episodes, setEpisodes] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    getShowInfo(showName).then(data => {
      setShow(data);
      getAmountOfEpisodes(data.id).then(episodeCount => {
        setEpisodes(episodeCount);
      }).catch(error => {
        console.error(error);
        setError(error.message);
      });
    }).catch(error => {
      console.error(error);
      setError(error.message);
    });
  }, [showName]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return show ? (
    <div>
      <ShowInfo show={show} />
      <EpisodeInfo runtime={show.averageRuntime} episodes={episodes} />
      <button onClick={onSearchAgain}>Search Again</button>
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
