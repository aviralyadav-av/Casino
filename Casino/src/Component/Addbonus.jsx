import React, { useState, useEffect } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";
import s2 from "../Images/s2.jpg";
import config from "../config"; // Import the config file
import { FaEdit, FaSave, FaTrash } from "react-icons/fa"; // Import icons

const Addbonus = () => {
  const [bonuses, setBonuses] = useState([]);
  const [bonus, setBonus] = useState("");
  const [editId, setEditId] = useState(null);
  const [editBonusName, setEditBonusName] = useState("");

  useEffect(() => {
    const fetchBonuses = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/api/bonus/all_bonus`
        );
        setBonuses(response.data);
      } catch (error) {
        console.error("Error fetching bonuses:", error);
      }
    };
    fetchBonuses();
  }, []);

  const addBonus = async () => {
    if (bonus) {
      try {
        const response = await axios.post(
          `${config.API_URL}/api/bonus/add_bonus`,
          { name: bonus }
        );
        setBonuses([...bonuses, response.data]);
        setBonus("");
      } catch (error) {
        console.error(
          "Error adding bonus:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const removeBonus = async (id) => {
    try {
      await axios.delete(`${config.API_URL}/api/bonus/bonus/${id}`);
      setBonuses(bonuses.filter((b) => b._id !== id));
    } catch (error) {
      console.error(
        "Error removing bonus:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const startEdit = (id, currentName) => {
    setEditId(id);
    setEditBonusName(currentName);
  };

  const saveEdit = async (id) => {
    if (editBonusName) {
      try {
        await axios.put(`${config.API_URL}/api/bonus/update/${id}`, {
          name: editBonusName,
        });
        setBonuses(
          bonuses.map((b) => (b._id === id ? { ...b, name: editBonusName } : b))
        );
        setEditId(null);
        setEditBonusName("");
      } catch (error) {
        console.error(
          "Error updating bonus:",
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
            Add or Edit Bonus
          </h1>
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
              placeholder="Add a Bonus"
            />
            <button
              className={`mt-2 w-full text-white px-3 py-2 font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                editId ? "bg-green-500" : "bg-blue-500"
              }`}
              onClick={editId ? () => saveEdit(editId) : addBonus}
            >
              {editId ? "Save Bonus" : "Add Bonus"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200">
                    Bonus Name
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(bonuses) &&
                  bonuses.map((b) => (
                    <tr key={b._id} className="border-b border-gray-200">
                      <td className="py-2 px-4">
                        {editId === b._id ? (
                          <input
                            type="text"
                            value={editBonusName}
                            onChange={(e) => setEditBonusName(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                          />
                        ) : (
                          b.name
                        )}
                      </td>
                      <td className="py-2 px-4 flex space-x-2">
                        {editId === b._id ? (
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 flex items-center"
                            onClick={() => saveEdit(b._id)}
                          >
                            <FaSave className="mr-1" />
                          </button>
                        ) : (
                          <>
                            <button
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center"
                              onClick={() => startEdit(b._id, b.name)}
                            >
                              <FaEdit className="mr-1" />
                            </button>
                            <button
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center"
                              onClick={() => removeBonus(b._id)}
                            >
                              <FaTrash className="mr-1" />
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
        <img className="rounded-2xl w-full h-auto" src={s2} alt="Bonus Image" />
      </div>
    </div>
  );
};

export default Addbonus;
