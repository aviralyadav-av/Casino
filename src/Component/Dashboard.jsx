/**
 * Dashboard component for the application.
 * This component serves as the main entry point for the application's dashboard.
 * It handles rendering of different sections based on the active section state.
 */ 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Addgame from './Addgame';
import Addbonus from './Addbonus';
import Adddetail from './Adddetail';
import Showdetail from './Showdetail';
import l1 from '../Images/l1.png'
import { MdGames } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";
import { BiDetail } from "react-icons/bi";
import { BiLogOutCircle } from "react-icons/bi";
import config from '../config'; // Import the config file
/**
 * Dashboard component function.
 * The JSX element representing the dashboard.
 */
const Dashboard = () => {
    /**
     * State variable to store the message.
     */
    const [message, setMessage] = useState('');
     /**
     * Navigation hook from react-router-dom.
     */
    const navigate = useNavigate();
/**
     * Effect hook to fetch the message from the API.
     */
    // useEffect(() => {
    //     const fetchMessage = async () => {
    //         try {
    //             const token = localStorage.getItem(config.TOKEN_KEY);
    //             const response = await axios.get(`${config.API_URL}/admin`, {
    //                 headers: {
    //                     Authorization: token,
    //                 },
    //             });
    //             console.log(response.data.message);
    //         } catch (error) {
    //             console.log('You are not authorized to view this page');
    //         }
    //     };

    //     fetchMessage();
    // }, []);
/**
     * Logout handler function.
     */
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    /**
     * State variable to store the active section.
     */
    const [activeSection, setActiveSection] = useState('Addgame');
/**
     * Function to render the active section.
     * The JSX element representing the active section.
     */
    const renderSection = () => {
        switch (activeSection) {
            case 'Addgame':
                return <Addgame />;
            case 'Addbonus':
                return <Addbonus />;
            case 'Adddetail':
                return <Adddetail />;

            case 'Showdetail':
                return <Showdetail/>;

            default:
                return <Addgame />;
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <p>{message}</p>
            <aside className="w-full lg:w-64  md:m-4 md:mr-2 shadow-lg rounded-lg text-black flex flex-col bg-gradient-to-t from-blue-200 to-white">
                <div className="px-8 py-4 text-xl font-bold">
                    <img src={l1} alt="" />
                </div>
                <nav className="flex-grow m-4">
                    <ul>
                        <li
                            className="flex items-center font-semibold gap-3 p-2 mb-4 bg-white rounded-lg shadow-lg hover:bg-gray-200"
                            onClick={() => setActiveSection('Addgame')}
                        >
                            <MdGames />
                            Add Games
                        </li>
                        <li
                            className="flex items-center font-semibold gap-3 p-2 mb-4 bg-white rounded-lg shadow-lg hover:bg-gray-200"
                            onClick={() => setActiveSection('Addbonus')}
                        >
                            <BsCashCoin />
                            Add Bonus
                        </li>
                        <li
                            className="flex items-center font-semibold gap-3 p-2 mb-4 bg-white rounded-lg shadow-lg hover:bg-gray-200"
                            onClick={() => setActiveSection('Adddetail')}
                        >
                            <BiDetail />
                            Add details
                        </li>
                        <li
                            className="flex items-center font-semibold gap-3 p-2 mb-4 bg-white rounded-lg shadow-lg hover:bg-gray-200"
                            onClick={() => setActiveSection('Showdetail')}
                        >
                            <BiDetail />
                            Show Detail
                        </li>
                        <li
                            className="flex items-center font-semibold gap-4 p-2 mb-4 bg-white rounded-lg shadow-lg hover:bg-gray-200"
                            onClick={handleLogout}
                        >
                            <BiLogOutCircle />
                            Logout
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="flex-grow bg-[#F8FAFC] shadow-lg m-2 md:m-4 rounded-3xl p-2 md:p-4 bg-gradient-to-r from-purple-200 to-blue-100">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center mt-2">Welcome to the Dashboard</h1>
                {renderSection()}
            </main>
        </div>
    );
}

export default Dashboard;

