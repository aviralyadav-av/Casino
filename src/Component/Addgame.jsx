/**
 * AddGame component
 * A React component that allows users to add and remove games from a list.
 * The list is stored in local storage.
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import s1 from '../Images/s1.webp';
import config from '../config'; // Import the config file
/**
 * AddBonus function component
 */
const Addgame = () => {
 /**
   * State to store the current game being added
   */
  const [game, setGame] = useState('');
   /**
   * State to store the list of games
   */
  const [games, setGames] = useState([]);
   /**
   * State to store the loading status
   */
  const [loading, setLoading] = useState(true);
   /**
   * State to store any error messages
   */
  const [error, setError] = useState('');
 /**
   * Fetches the list of games from the API
   */
  const fetchGames = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/games/all`);
      setGames(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch games');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);
 /**
   * Adds a new game to the list
   */
const addGame = async () => {
  if (game) {
    try {
      const response = await axios.post(`${config.API_URL}/api/games/add`, { name: game });
      setGame('');
      fetchGames();
      console.log('Game added:', response.data);
    } catch (error) {
      console.error('Error adding game:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      setError(error.response ? error.response.data.error : error.message);
    }
  }
};
 /**
   * Removes a game from the list
   * The ID of the game to remove
   */
  const removeGame = async (id) => {
    try {
      const response = await axios.delete(`${config.API_URL}/api/games/remove/${id}`);
      console.log('Game removed:', response.data); // Log success response
      fetchGames(); // Refresh the list after removing a game
    } catch (error) {
      console.error('Error removing game:', error); // Log the error
      setError(error.response ? error.response.data.error : error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-28 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl ">
    <div className="flex w-full lg:w-1/2 items-center justify-center mt-10 md:mt-0">
      <div className="bg-white p-6 lg:p-10 rounded-3xl shadow-md w-full w-full lg:w-[30vw]">
        <h1 className="text-xl lg:text-2xl font-bold mb-4 text-purple-800">Game List</h1>
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={game}
              onChange={(e) => setGame(e.target.value)}
              placeholder="Add a game"
            />
            <button
              className="mt-2 w-full  text-white px-3 py-2 font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={addGame}
            >
              Add Game
            </button>
          </div>
          <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 lg:-mr-8">Game Name</th>
            <th className="py-2 px-4 border-b border-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(games) && games.map((game) => (
            <tr key={game._id} className="border-b border-gray-200">
              <td className="py-2 px-4">{game.name}</td>
              <td className="py-2 px-4">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => removeGame(game._id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center mt-10 md:mt-0">
        <img src={s1} alt="Game Illustration" className="w-full h-auto rounded-3xl" />
      </div>
    </div>
  );
};

export default Addgame;
