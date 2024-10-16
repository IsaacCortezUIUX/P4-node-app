import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Match = ({ userId }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMatches = async () => {
    setLoading(true);
    setError(''); // Reset error state
    try {
      const response = await axios.get('http://localhost:5000/auth/match', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure token is stored in localStorage
        },
      });
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setError('Failed to load matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Find Your Matches</h2>
      <button onClick={fetchMatches} disabled={loading}>
        {loading ? 'Loading...' : 'Find Matches'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message if any */}
      <ul>
        {matches.length > 0 ? (
          matches.map((match) => (
            <li key={match._id}>
              {match.name}
              {/* You can add more details about the match here, if needed */}
            </li>
          ))
        ) : (
          <li>No matches found.</li>
        )}
      </ul>
    </div>
  );
};

export default Match;
