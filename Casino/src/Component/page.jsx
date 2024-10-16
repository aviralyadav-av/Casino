import React, { useState, useEffect } from "react"; // Import React and its hooks
import { FaMobileAlt, FaDesktop } from "react-icons/fa"; // Import Font Awesome icons
import axios from "axios"; // Import Axios for API requests
import { TbCircleDotFilled } from "react-icons/tb"; // Import another icon
import config from "../config"; // Import the config file

// Import images
import p1 from "../Images/p1.jpg";
import p2 from "../Images/p2.jpg";
import p3 from "../Images/p3.jpg";
import c from "../Images/c.png";
import c1 from "../Images/c1.png";
import c2 from "../Images/c2.png";
import c3 from "../Images/c3.png";
import c4 from "../Images/c4.png";
import c5 from "../Images/c5.png";
import c6 from "../Images/c6.png";
import per from "../Images/per.webp";
import l1 from "../Images/l1.png";
import p6 from "../Images/Img4.webp";
import { FiRefreshCcw } from "react-icons/fi"; // Import another icon

/**
 * An array of testimonials from partners and associates.
 * {Array<{text: string, author: string, company: string}>}
 */
const testimonials = [
  {
    text: "Gamblizard offers an exciting selection of new casino bonuses for UK players. User-friendly and packed with great deals, it's a goldmine for those seeking to amplify their gaming experience. Highly recommended for enriching online casino adventures!",
    author: "As Riste, Affiliate Manager",
    company: "Amber Spins",
  },
  {
    text: "We appreciate Gamblizard for its unwavering integrity towards us and its users. Any casino falling short of their standards simply doesn't make the cut. Their commitment to quality and honesty is commendable.",
    author: "CASPLAY Diana, Affiliate Manager",
    company: "Casiplay Casino",
  },
  {
    text: "Gamblizard is a fantastic resource for UK players seeking the best casino bonuses. With MrQ Casino featured on their platform, players enjoy an effortless journey to top-tier games and exciting rewards. Truly an enriching player experience!",
    author: "MrQ Andrew, Affiliate Manager",
    company: "MrQ Casino",
  },
  {
    text: "Betfred Casino appreciates how Gamblizard diligently presents the most profitable casino bonuses. By requiring us to provide accurate information, they craft a platform UK players relish for its enhancing gaming experience.",
    author: "Sukhi, Head of Affiliates",
    company: "Betfred Casino",
  },
  {
    text: "Gamblizard excels at updating the latest casino bonuses, ensuring UK players stay in the loop. They ask us periodically for updates, keeping the site fresh and relevant. It's a brilliant resource for enriching your casino gaming journey.",
    author: "Leon, Affiliate Manager",
    company: "Betvictor Casino",
  },
];
/**
 * A React component that displays a list of top casino bonuses.
 */
const Page = () => {
  // State variables
  const [selectedDevice, setSelectedDevice] = useState(""); // Store the selected device
  const [currentSlide, setCurrentSlide] = useState(0); // Store the current slide index
  const [games, setGames] = useState([]); // Store the list of games
  const [gameDetails, setGameDetails] = useState([]); // Store the game details
  const [bonus, setBonuses] = useState([]); // Store the list of bonuses
  const [loading, setLoading] = useState(true); // Store the loading state

  const [error, setError] = useState(""); // Store any error messages
  const [currentIndex, setCurrentIndex] = useState(0); // Store the current index
  const [selectedGame, setSelectedGame] = useState(""); // Store the selected game
  const [selectedBonus, setSelectedBonus] = useState(""); // Store the selected bonus
  const [showGameDetails, setShowGameDetails] = useState(false); // Store whether to show game details

  // Fetch data from API
  const fetchData = async () => {
    try {
      const [gamesRes, bonusesRes] = await Promise.all([
        axios.get(`${config.API_URL}/api/games/all`), // Fetch games
        axios.get(`${config.API_URL}/api/bonus/all_bonus`), // Fetch bonuses
      ]);
      setGames(gamesRes.data); // Update games state
      setBonuses(bonusesRes.data); // Update bonuses state
    } catch (err) {
      setError("Failed to fetch data"); // Update error state
    } finally {
      setLoading(false); // Update loading state
    }
  };
  // Use the useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);
  // Fetch game details
  const fetchGameDetails = async (gameId, bonusId) => {
    try {
      console.log(
        "Fetching details for gameId:",
        gameId,
        "and bonusId:",
        bonusId
      );
      const response = await axios.get(
        `${config.API_URL}/api/details/get_details`,
        {
          params: { gameId, bonusId },
        }
      );
      console.log("Game details response:", response.data);
      if (response.data && Array.isArray(response.data)) {
        setGameDetails(response.data); // Update game details state
        setCurrentIndex(0); // Update current index
      } else {
        setError("No game details found"); // Update error state
      }
    } catch (error) {
      console.error(
        "Error fetching game details:",
        error.response ? error.response.data : error.message
      );
      setError(
        "Failed to fetch game details: " +
          (error.response ? error.response.data.error : error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitButton = (e) => {
    e.preventDefault();
    if (selectedGame && selectedBonus) {
      fetchGameDetails(selectedGame, selectedBonus);
      setShowGameDetails(true);
    } else {
      setError("Please select both a game and a bonus");
    }
  };

  /**
   * Handles pagination click event.
   * The index of the testimonial to display.
   */
  const handlePaginationClick = (index) => {
    setCurrentSlide(index);
  };

  const handleNextDetail = () => {
    console.log("ok");
    setCurrentIndex((prevIndex) => {
      if (gameDetails.length > 1) {
        return (prevIndex + 1) % gameDetails.length; // Cycle through details if multiple
      }
      return 0; // If only one detail, stay on the same
    });
  };

  const gameDetail = gameDetails ? gameDetails[currentIndex] : null;

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <p>
        {error} <button onClick={() => window.location.reload()}>Retry</button>
      </p>
    );

  const handleDeviceSelection = () => {
    console.log("value");
  };
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };
  return (
    <>
      <div className="">
        {/** Casino Logo  */}
        <nav>
          <img
            className="w-1/2 mt-4 -mb-4 ml-24 lg:w-[10vw] lg:ml-40"
            src={l1}
            alt=""
          />
        </nav>

        {/** Best Casino offer container 1  */}

        <div Container1 className="  bg-white py-10 ">
          <div className="  w-7xl lg:w-[85vw]  mx-auto px-4  lg:px-8 ">
            <div
              className="text-center"
              style={{
                background:
                  "linear-gradient(to bottom, #e6f7f2 50%, #ffffff 100%)",
                padding: "20px",
                borderRadius: "95px",
              }}
            >
              <h1 className="text-3xl  font-extrabold text-gray-900 sm:text-5xl">
                Best{" "}
                <span className="text-white bg-green-500 px-2 rounded">
                  casino offers
                </span>{" "}
                from trusted sites
              </h1>
              <p className="mt-4 text-lg leading-6 text-gray-500">
                We’ve analyzed over 2000+ casino bonuses to let you enjoy the
                top of them
              </p>
            </div>
          </div>
        </div>

        {/** Functinality  container 2  */}

        <div className="py-16  bg-[#F4F8FA] rounded-3xl   w-full lg:w-4/5 lg:mt-10 lg:ml-[10vw]">
          <div className="max-w-6xl mx-auto  sm:px-6 lg:px-0 flex flex-col lg:flex-row lg:w-full ">
            {/**Find Your Perfect Bonus  Functionality 1*/}
            <div className="lg:w-1/2 w-full">
              <h2 className="text-3xl font-bold text-[#1E293B] mb-8 ml-10">
                Find Your Perfect Bonus
              </h2>
              <form
                className="space-y-6"
                style={{ width: "80%", marginLeft: 50 }}
              >
                <div>
                  <label
                    htmlFor="game"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your preferred game
                  </label>
                  <select
                    id="game"
                    name="game"
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "9px",
                      backgroundColor: "#FFFEFE",
                      fontSize: "16px",
                      color: "black",
                      appearance: "none",
                    }}
                    defaultValue="Select a game"
                  >
                    <option value="Select a game" disabled>
                      Select a game
                    </option>
                    {Array.isArray(games) &&
                      games.map((g) => (
                        <option key={g._id} value={g._id}>
                          {g.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="main-device"
                  >
                    Main device you play on
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => handleDeviceSelection("Mobile")}
                      className={`flex items-center justify-center w-1/2 py-2 border rounded-md ${
                        selectedDevice === "Mobile"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      <FaMobileAlt className="mr-2" />
                      Mobile
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeviceSelection("Desktop")}
                      className={`flex items-center justify-center w-1/2 py-2 border rounded-md ${
                        selectedDevice === "Desktop"
                          ? "w-full py-3 px-4 bg-[#0F766E] text-white rounded-lg font-medium"
                          : "w-full py-3 px-4 bg-[#0F766E] text-white rounded-lg font-medium"
                      }`}
                    >
                      <FaDesktop className="mr-2" />
                      Desktop
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="bonus"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Type of bonus you wish to use
                  </label>
                  <select
                    id="bonus"
                    name="bonus"
                    onChange={(e) => setSelectedBonus(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    style={{
                      width: "100 %",
                      padding: "12px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "9px",
                      backgroundColor: "#FFFEFE",
                      fontSize: "16px",
                      color: "black",
                      appearance: "none",
                    }}
                    defaultValue="Select a bonus type"
                  >
                    <option value="Select a bonus type" disabled>
                      Select a bonus type
                    </option>
                    {bonus.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>{" "}
                </div>
                <div>
                  <button
                    onClick={handleSubmitButton}
                    type="submit"
                    className="w-full py-3 px-4 bg-[#0F766E] text-white rounded-lg font-medium"
                  >
                    Find Bonus »
                  </button>
                </div>
              </form>
            </div>

            {/**Here Is Your Perfect Bonus Functionality 2*/}
            <div className="bg-blue-100 w-full lg:w-1/2 lg:h-[38vw] lg:-mb-16 p-4 rounded-r-3xl lg:-mt-[4.5vw] mt-16">
              <h1 className="text-xl lg:text-3xl font-bold text-[#1E293B] lg:mt-2 lg:ml-8">
                Here Is Your Perfect Bonus
              </h1>
              <p className="text-sm lg:text-base text-gray-500 mb-2 lg:ml-8">
                From 500+ casinos searched this one matches your preferences
              </p>
              {!showGameDetails && (
                <div className="rounded-2xl w-full lg:w-[35vw] lg:h-[28vw] lg:ml-16 p-4">
                  <img
                    className="rounded-lg w-full h-full object-cover"
                    src={p6}
                    alt="Default"
                  />
                </div>
              )}
              {showGameDetails && gameDetail && (
                <div className="bg-white rounded-2xl w-full lg:w-[35vw] lg:h-[28vw] lg:ml-4 p-4">
                  <div className="flex justify-center lg:justify-start">
                    <div className="w-[40vw] lg:w-[12vw] h-auto lg:h-[6vw] lg:ml-[10vw]">
                      <img
                        className="rounded-lg w-full h-full object-contain"
                        src={`${config.API_URL}/${gameDetail.image}`}
                        alt={gameDetail.title || "Game image"}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="bg-[#F4F8FB] shadow-lg w-full lg:w-[31vw] lg:ml-2 lg:h-[8vw] rounded-xl p-4 lg:p-0 mt-4 lg:mt-10">
                      <p className="text-gray-500 text-center lg:-mt-4">
                        {gameDetail.title}
                      </p>
                      <p className="font-semibold text-base lg:text-lg text-center">
                        {stripHtmlTags(gameDetail.description)}
                      </p>
                      <p className="text-blue-500 text-xs lg:text-sm text-center">
                        T&Cs Apply
                      </p>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-2 mt-2 lg:mt-4">
                      <div className="bg-[#F4F8FB] shadow-lg w-full lg:w-[18vw] lg:h-[4vw] lg:mx-2 rounded-xl p-4 lg:p-2">
                        <p className="text-sm text-gray-600 text-center lg:-mt-1 font-semibold">
                          RTP
                        </p>
                        <p className="text-center lg:ml-2">{gameDetail.rtp}</p>
                      </div>
                      <div className="bg-[#F4F8FB] shadow-lg w-full lg:w-[18vw] lg:h-[4vw] lg:mx-4 rounded-xl p-4 lg:p-2">
                        <p className="text-sm text-gray-600 text-center lg:-mt-1 font-semibold">
                          Min. Deposit
                        </p>
                        <p className="text-center">
                          {gameDetail.minimumDeposit}
                        </p>
                      </div>
                    </div>
                    <button className="lg:h-[4vw] py-3 px-2 w-full lg:w-[31vw] lg:mt-4 mt-2 lg:ml-2 bg-[#594EE7] text-white rounded-lg font-medium text-center">
                      Claim Free Spins »
                    </button>
                  </div>

                  {gameDetails.length > 1 && (
                    <div className="flex flex-row gap-2 lg:mt-6 mt-2 ml-24 text-[#594EE7] cursor-pointer">
                      <FiRefreshCcw
                        onClick={handleNextDetail}
                        className="ml-2 text-2xl lg:ml-20"
                        style={{ animation: "rotate 2s linear infinite" }}
                      />
                      <p
                        onClick={handleNextDetail}
                        style={{ cursor: "pointer", marginBottom: "3px" }}
                      >
                        Try Again
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/** What our partners say container 3  */}

        <div className="py-6 lg:bg-[#F8FAFC] lg:w-4/5 lg:ml-[10vw] lg:mt-20 rounded-3xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 lg:mt-10">
              <h2 className="text-3xl font-bold text-[#1E293B] mb-8 ml-10  lg:ml-20">
                What our partners say
              </h2>
              <p
                className="text-gray-700 mb-6"
                style={{
                  width: "70%",
                  marginLeft: 80,
                  fontSize: 18,
                  marginTop: -20,
                }}
              >
                Here's what our partners and associates have to say about
                cooperating with Gamblizard.
              </p>
            </div>
            <div
              className="bg-[#F8FAFC] p-8 rounded-lg max-w-2xl mx-auto w-full md:w-1/2"
              style={{ fontSize: 20 }}
            >
              <div className="mb-8 min-h-[200px]">
                {" "}
                {/* Adjust min-height as needed */}
                <p
                  style={{ fontSize: 25 }}
                  className=" text-justify text-gray-800 text-lg mb-4 font-semibold"
                >
                  {testimonials[currentSlide].text}
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full mr-3 flex items-center justify-center text-white font-bold">
                    AS
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500">
                      {testimonials[currentSlide].author}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testimonials[currentSlide].company}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-2 lg:flex-row md:items-center">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePaginationClick(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentSlide ? "bg-blue-500" : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/** Top Casino Bonuses container 4  */}

        <div className="py-16  rounded-3xl w-[88vw] lg:w-[80vw] lg:ml-28">
          <div className="-mt-10">
            <h1 className="text-3xl font-bold text-[#1E293B] mb-8 ml-10">
              Top Casino Bonuses
            </h1>
            <p className="ml-10 text-gray-400">
              Gamblizard Ranking of Best Casino Bonuses.
            </p>
            <p className="ml-10 text-gray-600 text-justify">
              We always check a website with several reputation/blacklist
              services to see if it is secure before recommending it.
            </p>
          </div>
          <div className="container ml-5 -mt-5 mx-auto p-4 pt-6 md:p-6 lg:p-12">
            <ul className="list-none mb-6 ">
              <li className="flex items-center mb-2 gap-4 ml-4">
                <TbCircleDotFilled style={{ color: "grey" }} />
                <span className="mr-2">Legality & licensing</span>
              </li>
              <li className="flex items-center mb-2 gap-4 ml-4 ">
                <TbCircleDotFilled style={{ color: "green" }} />
                <span className="mr-2">Depositing & withdrawals</span>
              </li>
              <li className="flex items-center mb-2 gap-4 ml-4">
                <TbCircleDotFilled style={{ color: "grey" }} />
                <span className="mr-2">Game selection</span>
              </li>
              <li className="flex items-center mb-2 gap-4 ml-4">
                <TbCircleDotFilled style={{ color: "green" }} />
                <span className="mr-2">Customer support service</span>
              </li>
              <li className="flex items-center mb-2 gap-4 ml-4">
                <TbCircleDotFilled style={{ color: "grey" }} />
                <span className="mr-2">All terms and conditions</span>
              </li>
            </ul>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1E293B] mt-2 mb-8 ml-10">
              What Are the Top Casino Bonuses?
            </h1>
            <p className="ml-10 text-gray-400">
              Gamblizard Ranking of Best Casino Bonuses.
            </p>
            <p className="ml-10 text-gray-600 text-justify">
              Our casino experts use rigorous analytical methods and strict
              criteria to assess casino bonus sites and their offers, so we can
              easily single out the best online casino bonus in the UK. We have
              organised these stellar offers into subcategories for easier
              navigation, and they are:
            </p>
            <div className="container  ml-5 p-3  pt-6 md:p-6 lg:p-12">
              <ul className="list-none " style={{ textAlign: "justify" }}>
                <li className="flex items-center mb-5 gap-4">
                  <p className="mr-2 " style={{ color: "grey" }}>
                    <span className="font-bold" style={{ fontSize: 20 }}>
                      Highest casino bonuses –{" "}
                    </span>{" "}
                    Such deals offer players maximum win per spin or max bonus
                    conversion equal to lifetime deposits. They mostly come as
                    welcome bonuses to all new casino players.
                  </p>
                </li>
                <li className="flex items-center mb-5 gap-4">
                  <p className="mr-2" style={{ color: "grey" }}>
                    <span className="font-bold" style={{ fontSize: 20 }}>
                      Free Spins Offers –
                    </span>{" "}
                    After qualifying this deposit, players will be credited with
                    a certain amount of free spins instantly. These bonus rounds
                    should be then used within a particular amount of time on
                    pre-selected slot games.
                  </p>
                </li>
                <li className="flex items-center mb-5 gap-4">
                  <p className="mr-2" style={{ color: "grey" }}>
                    <span className="font-bold" style={{ fontSize: 20 }}>
                      No Deposit Deals –
                    </span>{" "}
                    Getting extra funds and bonus rounds without a need to make
                    a deposit has never been easier. With a No Deposit Bonus
                    players can enrich their gambling experience with just one
                    click. The offer can be available both for new and existing
                    players.
                  </p>
                </li>
                <li className="flex items-center mb-2 gap-4">
                  <p className="mr-2" style={{ color: "grey" }}>
                    <span className="font-bold" style={{ fontSize: 20 }}>
                      1st Deposit Promos –
                    </span>{" "}
                    Almost any cash sum placed as the first deposit is usually
                    doubled, so there’s no doubt such an offer is one of the
                    most rewarding for British players. Especially considering
                    that all these percs became available starting with just a
                    £10 minimum deposit.
                  </p>
                </li>
              </ul>
            </div>{" "}
          </div>
        </div>

        {/** Top Casino Bonuses container 5  */}

        <div className="py-6  bg-[#F8FAFC] rounded-3xl w-full lg:w-4/5 lg:p-10 mx-auto ">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row">
            <div className="w-full -ml-10 lg:w-1/2 lg:ml-[-10%]">
              <p className="text-grey ml-20 mb-2">WHO WE ARE</p>
              <h2 className="text-3xl font-bold text-[#1E293B] mb-8 ml-20">
                Team Of Experts
              </h2>
              <p className="w-[70%] ml-20 text-lg mt-[-5%] text-grey text-justify">
                Our team consists of professionals who love gambling and know
                how this business works
              </p>
              <button className="border-2 border-grey py-2 px-4 rounded-lg lg:ml-20 ml-40 mt-5">
                More about us »{" "}
              </button>
            </div>
            <div className=" rounded-lg w-1/2 lg:w-4/5 ml-6  max-w-2xl lg:mx-auto mt-8 lg:mt-0  flex flex-row sm:flex-row gap-5">
              <img
                src={p2}
                className="rounded-full w-[50%] sm:w-[30%] lg:w-[200px] lg:h-[200px]"
                alt="Profile 2"
              />
              <img
                src={p1}
                className="rounded-full w-[50%] sm:w-[30%] lg:w-[200px] lg:h-[200px]"
                alt="Profile 1"
              />

              <img
                src={p3}
                className="rounded-full w-[50%] sm:w-[30%] lg:w-[200px] lg:h-[200px]"
                alt="Profile 3"
              />
            </div>
          </div>
        </div>

        {/** Our Team Recommends container 6  */}

        <div className="rounded-3xl w-[90%] mx-auto my-16">
          <h2 className="text-3xl font-bold mb-6 lg:ml-16 ">
            Our Team Recommends
          </h2>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
              <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-between h-[450px]">
                <img src={c} alt="Casino Casino" className="mb-4 mt-20" />
                <p className="text-sm text-center py-4 bg-[#F3FCF6] text-darkgreen w-full h-[50px] text-[17px] mb-[-18px]">
                  THE BEST LIVE CASINO
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full lg:w-2/3 ml-0 lg:ml-4">
              <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-between">
                <img src={c1} alt="Casino Casino" className="h-16" />
                <p className="text-sm text-center text-green-600">
                  THE BEST LIVE CASINO
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-between">
                <img src={c2} alt="Gala Casino" className="h-16 mb-4" />
                <p className="text-sm text-center text-green-600">
                  CROSS-PLATFORM CASINO APP
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-between">
                <img src={c3} alt="Diamond7" className="h-16 mb-4" />
                <p className="text-sm text-center text-green-600">
                  NO WITHDRAWAL LIMITS
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-between">
                <img src={c4} alt="Lucky VIP" className="h-16 mb-4" />
                <p className="text-sm text-center text-green-600">
                  TOP PROGRESSIVE SLOTS
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-between">
                <img src={c5} alt="Foxy Bingo" className="h-16 mb-4" />
                <p className="text-sm text-center text-green-600">
                  EXTENSIVE GAME PROVIDERS
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-between">
                <img src={c6} alt="Party Casino" className="h-16 mb-4" />
                <p className="text-sm text-center text-green-600">
                  LOW WAGERING BONUS
                </p>
              </div>
            </div>
          </div>
        </div>

        {/** STAY TUNED container 7  */}

        <div className="bg-green-500  flex items-center justify-between ">
          <div className="max-w-xl ml-10 lg:ml-40 mt-14">
            <p className="text-white text-sm uppercase mb-2">STAY TUNED</p>
            <h2 className="text-white text-2xl lg:text-3xl font-bold mb-6">
              Want to get more new offers from licensed casinos?
            </h2>
            <div className="flex flex-col mb-4 gap-5 w-5/6 ml-3 lg:-ml-1">
              <input
                type="email"
                placeholder="Your Email"
                className="flex-grow p-3 rounded-lg"
              />
              <button className="bg-gray-700 text-white px-1 py-3 rounded-lg">
                Get More Offers »
              </button>
            </div>
            <div className="flex items-start mb-40 lg:mb-40 w-[85%] text-justify">
              <input type="checkbox" className="mt-1 mr-2" />
              <p className="text-white text-xs">
                I am 18+ and I agree to receiving emails on gambling news and
                offers. By subscribing you verify that you are aware of{" "}
                <a href="#" className="underline">
                  terms and conditions
                </a>
              </p>
            </div>
          </div>
          <div className="mt-20 lg:-mt-20 hidden sm:block">
            <img src={per} alt="Description of the image" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
