import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import GlobalFunctions from '../services/GlobalFunctions';
/* import favicon from '../assets/favicon.png' */

const Navbar = () => {
    useEffect(() => {
        GlobalFunctions.headerScroll()
    }, [])

    return (
        <nav className="nav" id="nav">
            <ul className="nav-bar">
                <li className="nav-bar__home">
                    <NavLink exact to="/" className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}>Home
                        {/*             <img src={favicon} alt="favicon" className="nav-logo" />*/}
                    </NavLink>
                </li>
                <li>
                    <NavLink exact to="/add" className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}>Ajouter</NavLink>
                </li>
                <li>
                    <NavLink exact to="/edit" className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}>Modifier</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;