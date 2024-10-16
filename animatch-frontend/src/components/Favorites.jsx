import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Favorites = ({ userId }) => {
  const [favorites, setFavorites] = useState([]);
  const [newAnime, setNewAnime] = useState({ title: '', genre: '', rating: '' });

  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await axios.get('http://localhost:5000/auth/favorites', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFavorites(response.data);
    };
    fetchFavorites();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAnime({ ...newAnime, [name]: value });
  };

  const handleAddAnime = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/favorites', newAnime, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFavorites(response.data.favoriteAnime); // Update state with new favorites list
      setNewAnime({ title: '', genre: '', rating: '' }); // Clear input fields
    } catch (error) {
      console.error('Error adding anime:', error);
    }
  };

  const handleDeleteAnime = async (animeId) => {
    try {
      await axios.delete(`http://localhost:5000/auth/favorites/${animeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFavorites(favorites.filter(anime => anime._id !== animeId)); // Remove anime from state
    } catch (error) {
      console.error('Error deleting anime:', error);
    }
  };

  return (
    <div className="container">
      <h2>Your Favorite Anime</h2>
      <ul>
        {favorites.map((anime) => (
          <li key={anime._id}>
            {anime.title} - {anime.genre} (Rating: {anime.rating})
            <button onClick={() => handleDeleteAnime(anime._id)}>Delete</button>
          </li>
        ))}
      </ul>
      
      <h3>Add New Anime</h3>
      <form onSubmit={handleAddAnime}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newAnime.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={newAnime.genre}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating"
          value={newAnime.rating}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Anime</button>
      </form>
    </div>
  );
};

export default Favorites;
