import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Component/Login';
import Dashboard from './Component/Dashboard';
import Page from './Component/page';
import './App.css';
import { Navigate } from 'react-router-dom';
import Adddetails  from  './Component/Adddetail'


function App() {
const isAuthenticated = !!localStorage.getItem('token');
    return (
        <Router basename="/" >
            <div className="App">
                <Routes>
                    <Route path="/" element={<Page/>} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/dashboard"
                        element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
                    />
                    <Route path='/details' element={<Adddetails/>}/>
                </Routes>
            </div>
        </Router>
    );
}
export default App;
