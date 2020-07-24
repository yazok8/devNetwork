import React from 'react';
import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i>DevNetwork
        </Link>
      </h1>
      <ul>
        <li>
          <Link to="!#"></Link>Deveopers
        </li>
        <li>
          <Link to="/register"></Link>Register
        </li>
        <li>
          <Link to="/login"></Link>Login
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
