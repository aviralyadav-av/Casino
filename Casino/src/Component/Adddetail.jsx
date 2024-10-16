import React, { useState, useEffect } from "react";
import axios from "axios";
import { ImFolderUpload } from "react-icons/im";
import MyEditor from "./MyEditor"; // Ensure this component properly updates paragraph2
import Select from "react-select";
import config from "../config"; // Import the config file
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for Toastify

const MyComponent = () => {
  // State variables to store the image, title, description, RTP, minimum deposit, games, and bonuses.
  const [image, setImage] = useState(null);
  const [paragraph1, setParagraph1] = useState("");
  const [paragraph2, setParagraph2] = useState(""); // For description from MyEditor
  const [number1, setNumber1] = useState(""); // For RTP, use string initially
  const [stringValue, setStringValue] = useState(""); // For minimum deposit
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bonuses, setBonuses] = useState([]);

  const [selectedGames, setSelectedGames] = useState([]);
  const [selectedBonuses, setSelectedBonuses] = useState([]);

  // Handles image upload.
  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  // Handles form submission.
  const handleSubmit = async () => {
    try {
      // Create a new FormData object to store the form data.
      const formData = new FormData();
      // Append the image, title, description, RTP, and minimum deposit to the form data.
      if (image) formData.append("image", image);
      formData.append("title", paragraph1);
      formData.append("description", paragraph2 || "");
      formData.append("rtp", number1 || ""); // RTP should be sent as a string
      formData.append("minimumDeposit", stringValue || "");

      // Convert games and bonuses to the correct format
      const gamesArray = selectedGames.map((game) => game.value);
      const bonusesArray = selectedBonuses.map((bonus) => bonus.value);
      formData.append("games", JSON.stringify(gamesArray));
      formData.append("bonuses", JSON.stringify(bonusesArray));

      // Log FormData content for debugging purposes.
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Send a POST request to the API to add the game details.
      const response = await axios.post(
        `${config.API_URL}/api/details/add_details`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Log the response data for debugging purposes.
      console.log("Game details added:", response.data);
      toast.success("Game details added successfully!");
    } catch (error) {
      console.error(
        "Error submitting game details:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data?.error ||
          "An error occurred while submitting game details"
      );
      toast.error("Failed to add game details.");
    }
  };

  // Fetches the games from the API.
  const fetchGames = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/games/all`);
      console.log("Games response:", response.data); // Debugging line
      if (Array.isArray(response.data)) {
        setGames(
          response.data.map((game) => ({ value: game.name, label: game.name }))
        );
      } else {
        setError("Unexpected response format for games");
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch games");
      setLoading(false);
    }
  };

  // Fetches the bonuses from the API.
  const fetchBonuses = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/api/bonus/all_bonus`);
      console.log("Bonuses response:", response.data); // Debugging line
      if (Array.isArray(response.data)) {
        setBonuses(
          response.data.map((bonus) => ({
            value: bonus.name,
            label: bonus.name,
          }))
        );
      } else {
        setError("Unexpected response format for bonuses");
      }
    } catch (error) {
      console.error("Error fetching bonuses:", error);
    }
  };

  // Use the useEffect hook to fetch the games and bonuses when the component mounts.
  useEffect(() => {
    fetchGames();
    fetchBonuses();
  }, []);

  // If the component is still loading, return a loading message.
  if (loading) return <p>Loading...</p>;

  // If an error occurred, return an error message.
  if (error) return <p>{error}</p>;

  // Return the JSX element representing the component.
  return (
    <div className="p-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl shadow-2xl lg:h-[38vw] overflow-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-800">
        Game Details
      </h1>
      <form className="mb-4 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-lg">
          <label
            className="block mb-2 text-sm font-medium text-gray-700"
            htmlFor="image-upload"
          >
            Upload Image
          </label>
          <div className="flex items-center gap-2 mb-4">
            <ImFolderUpload className="text-3xl text-indigo-600" />
            <input
              className="text-sm text-gray-700 w-full font-semibold cursor-pointer focus:outline-none"
              type="file"
              id="image-upload"
              onChange={handleImageUpload}
            />
          </div>
          <div className="border-2 border-dashed border-indigo-300 p-2 w-full h-64 max-h-64 max-w-full rounded-lg overflow-hidden flex items-center justify-center bg-indigo-50">
            {image && (
              <div className="mb-4 w-full h-full">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Uploaded"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-lg">
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="paragraph1"
            >
              Title
            </label>
            <input
              id="paragraph1"
              value={paragraph1}
              onChange={(e) => setParagraph1(e.target.value)}
              className="block w-full text-lg text-gray-800 border border-indigo-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-medium text-gray-700"
              htmlFor="paragraph2"
            >
              Description
            </label>
            <MyEditor initialData={paragraph2} onChange={setParagraph2} />
          </div>
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex flex-col w-full lg:w-1/2">
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="number1"
              >
                RTP
              </label>
              <input
                id="number1"
                value={number1}
                onChange={(e) => setNumber1(e.target.value)}
                className="block w-full text-lg text-gray-800 border border-indigo-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <div className="flex flex-col w-full lg:w-1/2">
              <label
                className="block mb-2 text-sm font-medium text-gray-700"
                htmlFor="number2"
              >
                Minimum Deposit
              </label>
              <input
                id="number2"
                type="text" // Use type="text" to handle it as a string
                value={stringValue}
                onChange={(e) => setStringValue(e.target.value)}
                className="block w-full text-lg text-gray-800 border rounded-lg p-2 mb-4"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Games
            </label>
            <Select
              options={games}
              isMulti
              value={selectedGames}
              onChange={setSelectedGames}
              className="w-full mb-4"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Bonuses
            </label>
            <Select
              options={bonuses}
              isMulti
              value={selectedBonuses}
              onChange={setSelectedBonuses}
              className="w-full mb-4"
            />
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default MyComponent;
