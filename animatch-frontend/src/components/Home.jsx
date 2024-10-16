import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to AniMatch</h1>
      <p>Find your favorite anime and match with friends!</p>
      <Link to="/favorites">View Favorites</Link>
      <Link to="/match">Find Matches</Link>
    </div>
  );
};

export default Home;