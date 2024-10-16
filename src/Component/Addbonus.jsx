/**
 * AddBonus component
 * A React component that allows users to add and remove bonuses.
 * The component stores the bonuses in local storage and displays them in a list.
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import s2 from '../Images/s2.jpg';
import config from '../config'; // Import the config file
/**
 * AddBonus function component
 */
const Addbonus = () => {
  /**
   * State to store the list of bonuses
   */
  const [bonuses, setBonuses] = useState([]);
  /**
   * State to store the current bonus being added
   */
  const [bonus, setBonus] = useState('');
/**
   * Fetch bonuses from local storage on mount
   */
  useEffect(() => {
    // Fetch bonuses from the backend
    const fetchBonuses = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/api/bonus/all_bonus`);
        setBonuses(response.data);
      } catch (error) {
        console.error('Error fetching bonuses:', error);
      }
    };
    fetchBonuses();
  }, []);
 /**
   * Add a new bonus to the list
   */
  const addBonus = async () => {
    if (bonus) {
      try {
        const response = await axios.post(`${config.API_URL}/api/bonus/add_bonus`, { name: bonus });
        setBonuses([...bonuses, response.data]);
        setBonus('');
      } catch (error) {
        console.error('Error adding bonus:', error.response ? error.response.data : error.message);
      }
    }
  };
 /**
   * Remove a bonus from the list
   * The index of the bonus to remove
   */
  const removeBonus = async (id) => {
    try {
      await axios.delete(`${config.API_URL}/api/bonus/bonus/${id}`);
      setBonuses(bonuses.filter((b) => b._id !== id));
    } catch (error) {
      console.error('Error removing bonus:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='flex flex-col lg:flex-row gap-6 lg:gap-28 rounded-2xl p-4 bg-gradient-to-r from-purple-100 to-pink-100'>
    <div className="flex w-full lg:w-1/2 items-center justify-center">
      <div className="bg-white p-6 lg:p-10 rounded-3xl shadow-md w-full lg:w-[30vw]">
      <h1 className="text-xl lg:text-2xl font-bold mb-4 text-purple-800">Add A New Bonus</h1>
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={bonus}
               /**
   * State using to store the current bonus being addedm
   */
              onChange={(e) => setBonus(e.target.value)}
              placeholder="Add a Bonus"
            />
            <button
              className="mt-2 w-full bg-blue-500 text-white px-3 py-2 font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={addBonus}
                  /**
 *  make a function to Add a bonus to the list when click the button
 */
            >
              Add Bonus
            </button>
          </div>
          <ul className="list-disc pl-5 space-y-2">
          { /**
   * State to store the list of bonuses
   */}
            {Array.isArray(bonuses) && bonuses.map((b) => (
                  <li key={b._id} className="flex justify-between items-center">
                    {b.name}
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => removeBonus(b._id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}

          </ul>
        </div>
      </div>

       {/* addbonus component page Image  */}

      <div className="flex w-full lg:w-1/2 items-center justify-center">
        <img className='rounded-2xl w-full h-auto' src={s2} alt="Bonus Image" />
      </div>
    </div>
  );
};

export default Addbonus;
