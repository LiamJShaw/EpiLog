import React, { useState } from 'react';
import './App.css';
import Show from './Show';

function App() {
  const [showName, setShowName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSearch = (e) => {
    setShowName(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  }

  const handleSearchAgain = () => {
    setSubmitted(false);
    setShowName("");
  }

  return (
    <div className="App">
      {!submitted ? (
        <div className="search">
          <form onSubmit={handleSubmit}>
            <input type="text" onChange={handleSearch} placeholder="Search show" />
            <input type="submit" value="Search" />
          </form>
        </div>
      ) : (
        <Show showName={showName} onSearchAgain={handleSearchAgain} />
      )}
    </div>
  );
}

export default App;
