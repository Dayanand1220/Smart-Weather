import React from 'react';
import { Navbar, Container, Button, Dropdown } from 'react-bootstrap';
import { BsSun, BsMoon, BsCloudSun, BsPersonCircle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import './Header.css';

function Header({ theme, onToggleTheme }) {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar variant={theme} className="py-3">
      <Container>
        <Navbar.Brand className="d-flex align-items-center fw-bold fs-4">
          <BsCloudSun size={35} className="me-2 brand-icon" />
          <div className="brand-text">
            <span className="brand-main">WeatherWise</span>
            <span className="brand-sub">Smart Decisions</span>
          </div>
        </Navbar.Brand>
        
        <div className="d-flex align-items-center gap-2">
          <Button 
            variant={theme === 'dark' ? 'outline-light' : 'outline-dark'}
            onClick={onToggleTheme}
            className="rounded-pill px-4 py-2"
          >
            {theme === 'light' ? (
              <>
                <BsMoon size={18} className="me-2" />
                Dark Mode
              </>
            ) : (
              <>
                <BsSun size={18} className="me-2" />
                Light Mode
              </>
            )}
          </Button>

          {user && (
            <Dropdown align="end">
              <Dropdown.Toggle 
                variant={theme === 'dark' ? 'outline-light' : 'outline-dark'}
                className="rounded-pill px-3 py-2"
              >
                <BsPersonCircle size={18} className="me-2" />
                {user.username}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item disabled>
                  <small className="text-muted">{user.email}</small>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;
