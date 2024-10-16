import React, { useState, useEffect } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";
import s1 from "../Images/s1.webp";
import config from "../config"; // Import the config file
import { FaEdit, FaSave, FaTrash } from "react-icons/fa"; // Import icons

const Addgame = () => {
  const [games, setGames] = useState([]);
  const [game, setGame] = useState("");
  const [editId, setEditId] = useState(null);
  const [editGameName, setEditGameName] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/games/all`);
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, []);

  const addGame = async () => {
    if (game) {
      try {
        const response = await axios.post(`${config.API_URL}/api/games/add`, {
          name: game,
        });
        setGames([...games, response.data]);
        setGame("");
      } catch (error) {
        console.error(
          "Error adding game:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const removeGame = async (id) => {
    try {
      await axios.delete(`${config.API_URL}/api/games/remove/${id}`);
      setGames(games.filter((g) => g._id !== id));
    } catch (error) {
      console.error(
        "Error removing game:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const startEdit = (id, currentName) => {
    setEditId(id);
    setEditGameName(currentName);
  };

  const saveEdit = async (id) => {
    if (editGameName) {
      try {
        await axios.put(`${config.API_URL}/api/games/update/${id}`, {
          name: editGameName,
        });
        setGames(
          games.map((g) => (g._id === id ? { ...g, name: editGameName } : g))
        );
        setEditId(null);
        setEditGameName("");
      } catch (error) {
        console.error(
          "Error updating game:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-28 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
      <div className="flex w-full lg:w-1/2 items-center justify-center">
        <div className="bg-white p-6 lg:p-10 rounded-3xl shadow-md w-full lg:w-[30vw]">
          <h1 className="text-xl lg:text-2xl font-bold mb-4 text-purple-800">
            Add or Edit Game
          </h1>
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={game}
              onChange={(e) => setGame(e.target.value)}
              placeholder="Add a Game"
            />
            <button
              className={`mt-2 w-full text-white px-3 py-2 font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                editId ? "bg-green-500" : "bg-blue-500"
              }`}
              onClick={editId ? () => saveEdit(editId) : addGame}
            >
              {editId ? "Save Game" : "Add Game"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200">
                    Game Name
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(games) &&
                  games.map((g) => (
                    <tr key={g._id} className="border-b border-gray-200">
                      <td className="py-2 px-4">
                        {editId === g._id ? (
                          <input
                            type="text"
                            value={editGameName}
                            onChange={(e) => setEditGameName(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                          />
                        ) : (
                          g.name
                        )}
                      </td>
                      <td className="py-2 px-4 flex space-x-2">
                        {editId === g._id ? (
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center"
                            onClick={() => saveEdit(g._id)}
                          >
                            <FaSave className="mr-1" /> Save
                          </button>
                        ) : (
                          <>
                            <button
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center"
                              onClick={() => startEdit(g._id, g.name)}
                            >
                              <FaEdit className="mr-1" /> Edit
                            </button>
                            <button
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center"
                              onClick={() => removeGame(g._id)}
                            >
                              <FaTrash className="mr-1" /> Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center mt-10 md:mt-0">
        <img className="rounded-2xl w-full h-auto" src={s1} alt="Game Image" />
      </div>
    </div>
  );
};

export default Addgame;
