import React from 'react';
import { GrHome, GrFormSearch } from 'react-icons/gr';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="nav" id="nav">
            <ul className="nav-bar">
                <li className="nav-bar__home">
                    <NavLink exact="true" to="/" className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}>
                        <GrHome />
                    </NavLink>
                </li>
                <li>
                    <NavLink exact="true" to="/add" className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}>
                        <GrFormSearch />
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;