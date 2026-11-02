import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleAdminClick } from './logic';
// import { Link } from 'react-router-dom';
import './dashboard.css';

const Header = () => {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
    <header className="header">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="menubtn">
            <button className="menu-button" /*onClick={() => setIsSidebarOpen(!isSidebarOpen)}*/ >☰</button>
          <Link to="/" className="navbar-logo">
            <p>HostelManagement</p>
          </Link>
          </div>
          <div className="navbar-menu">
            <ul className="navbar-list">
              <li className="navbar-item">
                <Link to="/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/complaints" className="navbar-link">
                  Complaints
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/mess" className="navbar-link">
                  Mess
                </Link>
              </li>
            </ul>
          </div>
          <div >
            <button className="signin" onClick={() => handleAdminClick(navigate)}>ADMIN</button>
          </div>
        </div>
      </nav>
    </header>
    {/* <Sidebar isOpen={isSidebarOpen} /> */}
    </>
  );
};

export default Header;
