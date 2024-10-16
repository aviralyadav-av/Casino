import React, { useEffect, useState } from "react";
import { LuFolderEdit } from "react-icons/lu";
import { FaTrash } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import axios from "axios";
import config from "../config";

const Showdetail = () => {
  const [gameDetails, setGameDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentDetail, setCurrentDetail] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "asc",
  });

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(
          `${config.API_URL}/api/details/main_objects`
        );
        setGameDetails(response.data);
       
        setError(null); // Clear error if data is fetched successfully
      } catch (err) {
        setError("Failed to fetch game details.");
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
    

  }, [gameDetails]);

  const handleEdit = (detail) => {
    setCurrentDetail({
      ...detail,
      games: detail.games.map((game) => game.name),
      bonuses: detail.bonuses.map((bonus) => bonus.name),
    });
    setEditMode(true);
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setCurrentDetail((prevDetail) => ({ ...prevDetail, [name]: value }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentDetail((prevDetail) => ({
      ...prevDetail,
      [name]: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    if (!currentDetail || !currentDetail._id) return;

    try {
      const formData = new FormData();
      formData.append("title", currentDetail.title);
      formData.append("description", currentDetail.description);
      formData.append("rtp", currentDetail.rtp);
      formData.append("minimumDeposit", currentDetail.minimumDeposit);
         // Format games and bonuses
    const games = currentDetail.games.map(game => {
      return typeof game === 'string' ? game : { _id: game._id, name: game.name };
    });
    const bonuses = currentDetail.bonuses.map(bonus => {
      return typeof bonus === 'string' ? bonus : { _id: bonus._id, name: bonus.name };
    }); 

    formData.append("games", JSON.stringify(games));
    formData.append("bonuses", JSON.stringify(bonuses));
    
      if (imageFile) formData.append("image", imageFile);
      console.log(formData);
      await axios.put(
        `${config.API_URL}/api/details/update_details/${currentDetail._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const response = await axios.get(
        `${config.API_URL}/api/details/get_details`
      );
      setGameDetails(response.data);
      setEditMode(false);
      setCurrentDetail(null);
      setImageFile(null);
    } catch (err) {
      setError("Failed to update detail.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.API_URL}/api/details/delete_details/${id}`);
      setGameDetails(gameDetails.filter((detail) => detail._id !== id));
    } catch (err) {
      setError("Failed to delete detail.");
    }
  };

 
  const handleClone = async (detail) => {
    try {
      await axios.post(`${config.API_URL}/api/details/clone_details/${detail._id}`);
      const response = await axios.get(`${config.API_URL}/api/details/get_details`);
      setGameDetails(response.data);
    } catch (err) {
      setError("Failed to clone detail.");
    }
  };
  
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const sortedGameDetails = React.useMemo(() => {
    const sortableDetails = [...gameDetails];
    sortableDetails.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sortableDetails;
  }, [gameDetails, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container lg:h-[35.5vw] rounded-2xl mx-auto p-6 bg-gradient-to-r from-purple-100 to-pink-100 overflow-x-hidden">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-800">
        {editMode ? "Edit Details" : "Show Details"}
      </h2>
      {editMode ? (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={currentDetail?.title || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={
                currentDetail?.description
                  ? stripHtmlTags(currentDetail.description)
                  : ""
              }
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">RTP</label>
            <input
              type="number"
              name="rtp"
              value={currentDetail?.rtp || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Minimum Deposit</label>
            <input
              type="text"
              name="minimumDeposit"
              value={currentDetail?.minimumDeposit || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Games</label>
            <input
              type="text"
              name="games"
              value={currentDetail?.games.join(", ") || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Bonuses</label>
            <input
              type="text"
              name="bonuses"
              value={currentDetail?.bonuses.join(", ") || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Image URL</label>
            <input
              type="text"
              name="image"
              value={currentDetail?.image || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <label className="block text-gray-700 mt-4">Upload New Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <button
            onClick={handleUpdate}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
          >
            Update
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-4"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-xl rounded-lg">
          <table className="w-full table-auto">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  Serial No
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  Title
                  {sortConfig.key === "title" &&
                    (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort("description")}
                >
                  Description
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort("rtp")}
                >
                  RTP
                  {sortConfig.key === "rtp" &&
                    (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort("minimumDeposit")}
                >
                  Minimum Deposit
                  {sortConfig.key === "minimumDeposit" &&
                    (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort("games")}
                >
                  Game
                  {sortConfig.key === "title" &&
                    (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                </th>
                <th
                  className="py-3 px-4 text-left cursor-pointer"
                  onClick={() => handleSort("bonuses")}
                >
                  Bonus
                  {sortConfig.key === "title" &&
                    (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                </th>

                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-4 px-4 text-center text-red-700"
                  >
                    {error}
                  </td>
                </tr>
              ) : gameDetails.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-4 px-4 text-center text-gray-700"
                  >
                    No game details available.
                  </td>
                </tr>
              ) : (
                Array.isArray(sortedGameDetails) &&
                sortedGameDetails.map((detail, index) => (
                  <tr
                    key={detail._id}
                    className={
                      detail._id % 2 === 0 ? "bg-white" : "bg-purple-50"
                    }
                  >
                    <td className="py-4 px-4 font-semibold text-purple-700">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4 font-semibold text-purple-700">
                      {detail.title}
                    </td>
                    <td className="py-4 px-4 font-medium">
                      {stripHtmlTags(detail.description)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm font-medium">
                        {detail.rtp}%
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-pink-600">
                      {detail.minimumDeposit}
                    </td>
                    <td className="px-4 py-2">
                      {detail.games.map((game) => game.name).join(", ")}
                    </td>
                    <td className="px-4 py-2">
                      {detail.bonuses.map((bonus) => bonus.name).join(", ")}
                    </td>
                    <td className="py-4 px-4">
                      <img
                        src={
                          detail.image
                            ? `${config.API_URL}/${detail.image}`
                            : ""
                        }
                        alt={detail.title}
                        className="h-12 w-12 rounded-lg border-2 border-purple-300 object-contain"
                      />
                    </td>
                    <td className="py-4 px-4 flex gap-2 items-center">
                      <button
                        onClick={() => handleEdit(detail)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-3 rounded transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        <LuFolderEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(detail._id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded ml-2 transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleClone(detail)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded ml-2 transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        <MdContentCopy />
                      </button>
                      {detail.cloned && (
                        <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-xs font-medium ml-2">
                          Cloned
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Showdetail;
