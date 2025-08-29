import React, { useState } from "react";
import './Header.css';
import { Link } from "react-router-dom";
import ff from "./images/ff2.png"
import { useAuth } from './context/AuthContext';
const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="header">
          <div className="title">  <h1><img src={ff} alt="" /></h1></div>
            <nav className="navbar">
                <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    {!isAuthenticated && <li><Link to="/register">Signup</Link></li>}
                    <div className="login">
                        {isAuthenticated ? (
                            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
                        ) : (
                            <li><Link to="/login">Login</Link></li>
                        )}
                    </div>
                </ul>                <div className="m-view">
                {isAuthenticated ? (
                    <div className="login2"><p><button onClick={handleLogout} className="logout-btn">Logout</button></p></div>
                ) : (
                    <div className="login2"><p><Link to="/login">Login</Link></p></div>
                )}
                <div className="hamburger" onClick={toggleMenu}>
                
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div></div>
            </nav>
        </header>
    );
};

export default Header;
